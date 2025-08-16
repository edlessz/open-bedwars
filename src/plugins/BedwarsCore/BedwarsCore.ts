import BedwarsPlugin from "../../BedwarsPlugin";
import { getPosition, secondsToTicks, snbt } from "../../utils";
import type { Generator, Shop, ShopId, Shopkeeper } from "./types";

export default class BedwarsCore extends BedwarsPlugin {
	private generators: Generator[] = [];
	public addGenerator(generator: Generator) {
		this.generators.push(generator);
	}

	private shopkeepers: Shopkeeper[] = [];
	public addShopkeeper(shopkeeper: Shopkeeper) {
		this.shopkeepers.push(shopkeeper);
	}

	private shops: Record<ShopId, Shop> = {};
	public addShop(shop: Shop): ShopId {
		const shopId = Object.keys(this.shops).length.toString();
		this.shops[shopId] = shop;
		return shopId;
	}

	public onLoad(): string[] {
		return [
			`scoreboard objectives add ${this.namespace}_generators dummy`,
			...this.generators.flatMap((_, i) => [
				`scoreboard players set ${i} ${this.namespace}_generators 0`,
			]),
			...this.shopkeepers.flatMap((shop, i) => [
				`summon villager ${getPosition(shop.position)} {Tags:["${this.namespace}","${this.namespace}_shopkeeper","${this.namespace}_shopkeeper_${i}"],NoAI:1b,Silent:1b,Invulnerable:1b}`,
				`summon item_display ${shop.position.x} ${shop.position.y + 1} ${shop.position.z} {Tags:["${this.namespace}"],Passengers:[{id:"minecraft:chest_minecart",Tags:["${this.namespace}", "${this.namespace}_shop", "${this.namespace}_shop_${i}", "${this.namespace}_shopId_${shop.shop}"],Passengers:[{id:marker,Tags:[${this.namespace},${this.namespace}_shopkeeper_${i}]}],Silent:1b,Invulnerable:1b,CustomName:'${this.shops[shop.shop]?.name ?? "Shop"}',DisplayState:{Name:"minecraft:barrier"}}]}`,
			]),
			...Object.entries(this.shops).flatMap(([shopId, shop]) => [
				`data modify storage ${this.namespace}:shops ${shopId} set value ${snbt(
					shop.items.map((item) => ({
						...item,
						components: {
							custom_data: {
								[`${this.namespace}_shop_item`]: 1,
							},
							Tags: [`${this.namespace}`],
						},
					})),
				)}`,
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
				`# Set shops`,
				...Object.entries(this.shops).flatMap(([shopId, _]) => [
					`execute as @e[tag=${this.namespace}_shopId_${shopId}] run data modify entity @s Items set from storage ${this.namespace}:shops ${shopId}`,
				]),
				`# Check for Purchases`,
				`execute as @a run clear @s *[custom_data={${this.namespace}_shop_item: 1b}]`,
			]),
		];
	}
}
