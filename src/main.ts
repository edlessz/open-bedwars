import { BedwarsDatapack } from "./BedwarsDatapack.js";
import * as fs from "fs";
import BedwarsCore from "./plugins/BedwarsCore/index.js";

// Delete existing datapack directory if it exists
const datapackPath = `C:/Users/ebles/AppData/Roaming/.minecraft/saves/test/datapacks/edwars2`;
if (fs.existsSync(datapackPath))
  fs.rmdirSync(datapackPath, { recursive: true });

// Create and build the datapack
const namespace = datapackPath.split("/").at(-1);
if (namespace) {
  const datapack = new BedwarsDatapack("Edwars v2.0", namespace);

  const core = datapack.usePlugin(BedwarsCore);

  core.addShop("test", {
    items: [{ Slot: 0, id: "minecraft:stone", Count: 64 }],
    name: "Test Shop 2",
  });

  core.addGenerator({
    item: "minecraft:gold_block",
    position: { x: 224, y: -60, z: 10 },
    delaySeconds: 1,
  });

  core.addShopkeeper({
    shopId: "test",
    position: { x: 241, y: -60, z: 10 },
  });

  datapack.build(datapackPath.split("/").slice(0, -1).join("/"));
}
