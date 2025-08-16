import type { Vector3, Item } from "../../types/index.js";

export interface Generator {
  item: string;
  position: Vector3;
  delaySeconds: number;
}

export interface Shopkeeper {
  shopId: string;
  position: Vector3;
}

export interface Shop {
  items: Item[];
  name: string;
}