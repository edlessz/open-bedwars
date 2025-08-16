import type { Vector3 } from "../../types";

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

export interface Item {
  id: string;
  Count: number;
  Slot: number;
  [key: string]: any; // Allow additional properties
}
