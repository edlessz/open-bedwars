import type { Vector3 } from "../../types";

export interface Generator {
	item: string;
	position: Vector3;
	delaySeconds: number;
}

export interface Shopkeeper {
	shop: ShopId;
	position: Vector3;
}

export interface Shop {
	items: ShopItem[];
	name: string;
}

export interface Item {
	id: string;
	count: number;
}
export interface ShopItem extends Item {
	name: string;
	Slot: number;
	price: Item;
}

export type ShopId = string;
