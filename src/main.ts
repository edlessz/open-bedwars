import * as fs from "node:fs";
import { BedwarsDatapack } from "./BedwarsDatapack";
import BedwarsCore from "./plugins/BedwarsCore";

// Delete existing datapack directory if it exists
const datapackPath = `C:/Users/ebles/AppData/Roaming/.minecraft/saves/test/datapacks/edwars2`;
if (fs.existsSync(datapackPath))
	fs.rmdirSync(datapackPath, { recursive: true });

// Create and build the datapack
const namespace = datapackPath.split("/").at(-1);
if (namespace) {
	const datapack = new BedwarsDatapack("Edwars v2.0", namespace);

	const core = datapack.usePlugin(BedwarsCore);

	const testShop = core.addShop({
		items: [{ Slot: 0, id: "minecraft:stone", Count: 64 }],
		name: "Test Shop 2",
	});

	core.addGenerator({
		item: "minecraft:gold_block",
		position: { x: 241, y: -60, z: 16 },
		delaySeconds: 1,
	});

	core.addShopkeeper({
		shop: testShop,
		position: { x: 241, y: -60, z: 10 },
	});

	datapack.build(datapackPath.split("/").slice(0, -1).join("/"));
}
