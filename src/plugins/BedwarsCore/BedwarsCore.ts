import * as fs from "node:fs";
import path from "node:path";
import BedwarsPlugin from "../../BedwarsPlugin";
import { getPosition, log, secondsToTicks } from "../../utils";
import type { Generator, Shop, Shopkeeper } from "./types";

export default class BedwarsCore extends BedwarsPlugin {
	private generators: Generator[] = [];
	public addGenerator(generator: Generator) {
		this.generators.push(generator);
	}

	private shopkeepers: Shopkeeper[] = [];
	public addShopkeeper(shopkeeper: Shopkeeper) {
		this.shopkeepers.push(shopkeeper);
	}

	private shops: Record<string, Shop> = {};
	public addShop(shopId: string, shop: Shop) {
		if (this.shops[shopId])
			log(`Shop ${shopId} already exists, overwriting.`, "⚠️");
		this.shops[shopId] = shop;
	}

	public onBuild(datapackPath: string): boolean {
		try {
			const storagePath = path.join(
				datapackPath,
				"data",
				this.namespace,
				"storage",
			);
			fs.mkdirSync(storagePath, { recursive: true });
			fs.writeFileSync(
				path.join(storagePath, "shops.json"),
				JSON.stringify(
					Object.entries(this.shops).reduce(
						(acc, [key, val]) => {
							acc[key] = val.items.map((item) => ({
								...item,
								Slot: `${item.Slot}b`,
								Count: `${item.Count}b`,
							}));
							return acc;
						},
						{} as Record<string, object[]>,
					),
				),
			);
			log(`Wrote shops.json`, "✏️");
			return true;
		} catch {
			return false;
		}
	}

	public onLoad(): string[] {
		return [
			`scoreboard objectives add ${this.namespace}_generators dummy`,
			...this.generators.map(
				(_, i) => `scoreboard players set ${i} ${this.namespace}_generators 0`,
			),
			...this.shopkeepers.flatMap((shop) => [
				`summon villager ${getPosition(shop.position)} {Tags:["${this.namespace}","${this.namespace}_shopkeeper"],NoAI:1b,Silent:1b,Invulnerable:1b}`,
				`summon item_display ${shop.position.x} ${shop.position.y + 1} ${shop.position.z} {Tags:["${this.namespace}"],Passengers:[{id:"minecraft:chest_minecart",Tags:["${this.namespace}"],Silent:1b,Invulnerable:1b,CustomName:'${this.shops[shop.shopId]?.name ?? "Shop"}',DisplayState:{Name:"minecraft:barrier"}}]}`,
			]),
		];
	}
	public onUnload(): string[] {
		return [`scoreboard objectives remove ${this.namespace}_generators`];
	}
	public onTick(): string[] {
		return [
			...this.generators.flatMap((g, i) => [
				`# Generators`,
				`scoreboard players add ${i} ${this.namespace}_generators 1`,
				`execute if score ${i} ${
					this.namespace
				}_generators matches ${secondsToTicks(
					g.delaySeconds,
				)}.. run summon item ${getPosition(g.position)} {Tags:["${this.namespace}"],Item:{id:"${g.item}"}}`,
				`execute if score ${i} ${
					this.namespace
				}_generators matches ${secondsToTicks(
					g.delaySeconds,
				)}.. run scoreboard players reset ${i} ${this.namespace}_generators`,
				`# Shopkeepers`,
				`execute as @e[tag=${this.namespace}_shopkeeper] at @s run tp @s ~ ~ ~ facing entity @p`,
			]),
		];
	}
}
