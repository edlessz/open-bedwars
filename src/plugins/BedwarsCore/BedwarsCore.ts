import path from "path";
import * as fs from "fs";
import BedwarsPlugin from "../../BedwarsPlugin.js";
import type { Generator, Shopkeeper, Shop } from "./types.js";
import { log, secondsToTicks } from "../../utils/index.js";

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
        "storage"
      );
      fs.mkdirSync(storagePath, { recursive: true });
      fs.writeFileSync(
        path.join(storagePath, "shops.json"),
        JSON.stringify(
          Object.entries(this.shops).reduce((acc, [key, val]) => {
            acc[key] = val.items.map((item) => ({
              ...item,
              Slot: `${item.Slot}b`,
              Count: `${item.Count}b`,
            }));
            return acc;
          }, {} as Record<string, object[]>)
        )
      );
      log(`Wrote shops.json`, "✏️");
      return true;
    } catch (error) {
      return false;
    }
  }

  public onLoad(): string[] {
    return [
      `scoreboard objectives add ${this.namespace}_generators dummy`,
      ...this.generators.map(
        (g, i) => `scoreboard players set ${i} ${this.namespace}_generators 0`
      ),
      ...this.shopkeepers
        .map((shop) => [
          `summon villager ${shop.position.x} ${shop.position.y} ${shop.position.z} {Tags:["${this.namespace}"],NoAI:1b,Silent:1b,Invulnerable:1b}`,
          `setblock ${shop.position.x} ${shop.position.y} ${
            shop.position.z
          } chest{CustomName:'${this.shops[shop.shopId]?.name ?? "Shop"}'}`,
        ])
        .flat(),
    ];
  }
  public onUnload(): string[] {
    return [`scoreboard objectives remove ${this.namespace}_generators`];
  }
  public onTick(): string[] {
    return [
      ...this.generators
        .map((g, i) => [
          `# Generators`,
          `scoreboard players add ${i} ${this.namespace}_generators 1`,
          `execute if score ${i} ${
            this.namespace
          }_generators matches ${secondsToTicks(
            g.delaySeconds
          )}.. run summon item ${g.position.x} ${g.position.y} ${
            g.position.z
          } {Tags:["${this.namespace}"],Item:{id:"${g.item}"}}`,
          `execute if score ${i} ${
            this.namespace
          }_generators matches ${secondsToTicks(
            g.delaySeconds
          )}.. run scoreboard players reset ${i} ${this.namespace}_generators`,
        ])
        .flat(),
    ];
  }
}
