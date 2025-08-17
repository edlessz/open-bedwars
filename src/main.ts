import * as fs from "node:fs";
import { BedwarsDatapack } from "./BedwarsDatapack";
import BedwarsCore from "./plugins/BedwarsCore";

// Delete existing datapack directory if it exists
const datapackPath = `C:/Users/ebles/AppData/Roaming/.minecraft/saves/test/datapacks/edwars2`;
if (fs.existsSync(datapackPath)) fs.rmSync(datapackPath, { recursive: true });

// Create and build the datapack
const namespace = datapackPath.split("/").at(-1);
if (namespace) {
	const datapack = new BedwarsDatapack("Edwars v2.0", namespace);

	const core = datapack.usePlugin(BedwarsCore);
	core.registerCurrency("minecraft:iron_ingot", "Iron", "gray");
	core.registerCurrency("minecraft:gold_ingot", "Gold", "yellow");
	core.registerCurrency("minecraft:diamond", "Diamonds", "aqua");
	core.registerCurrency("minecraft:emerald", "Emeralds", "green");

	const testShop = core.addShop({
		items: [
			{
				Slot: 13,
				id: "minecraft:diamond_sword",
				name: "Diamond Sword",
				count: 1,
				price: { id: "minecraft:emerald", count: 4 },
			},
		],
		name: "Test Shop 2",
	});

	core.addShopkeeper({
		shop: testShop,
		position: { x: 241, y: -60, z: 10 },
	});

	core.addGenerator({
		item: "minecraft:emerald",
		position: { x: 241, y: -60, z: 16 },
		delaySeconds: 5,
	});

	datapack.build(datapackPath.split("/").slice(0, -1).join("/"));
}
