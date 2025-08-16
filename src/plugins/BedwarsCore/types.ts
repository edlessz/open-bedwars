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
	items: Item[];
	name: string;
}

export interface Item {
	id: string;
	count: number;
	Slot: number;
	[key: string]: unknown; // Allow additional properties
}

export type ShopId = string;
