import * as fs from "node:fs";
import path from "node:path";
import { BedwarsDatapack } from "./BedwarsDatapack";
import BedwarsCore from "./plugins/BedwarsCore";

// Delete existing datapack directory if it exists
const datapackPath = `C:/Users/ebles/AppData/Roaming/.minecraft/saves/test/datapacks/edwars2`;
const namespace = path.basename(datapackPath);
const worldDatapacksPath = path.dirname(datapackPath);

if (fs.existsSync(datapackPath)) fs.rmSync(datapackPath, { recursive: true });

// Create and build the datapack

const datapack = new BedwarsDatapack("Edwars v2.0", namespace);

const core = datapack.usePlugin(BedwarsCore);
core.configure({
	currencies: [
		{ id: "minecraft:iron_ingot", name: "Iron", color: "gray" },
		{ id: "minecraft:gold_ingot", name: "Gold", color: "yellow" },
		{ id: "minecraft:diamond", name: "Diamonds", color: "aqua" },
		{ id: "minecraft:emerald", name: "Emeralds", color: "green" },
	],
	generators: [
		{
			item: "minecraft:emerald",
			position: { x: 241, y: -60, z: 16 },
			delaySeconds: 5,
		},
	],
	shops: [
		{
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
			shopkeepers: [
				{
					position: { x: 241, y: -60, z: 10 },
				},
			],
		},
	],
});

datapack.build(worldDatapacksPath);
