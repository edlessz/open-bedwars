export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Item {
  id: string;
  Count: number;
  Slot: number;
  [key: string]: any; // Allow additional properties
}

