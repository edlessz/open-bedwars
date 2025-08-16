import type { Vector3 } from "types";

const TICKS_PER_SECOND = 20;
export const secondsToTicks = (seconds: number) =>
	Math.round(seconds * TICKS_PER_SECOND);

export const log = (message: string, emoji?: string) =>
	console.log(emoji ? `${emoji}  ${message}` : message);

export const getPosition = (vector3: Vector3): string =>
	`${vector3.x} ${vector3.y} ${vector3.z}`;
