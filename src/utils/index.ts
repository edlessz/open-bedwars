import type { Vector3 } from "types";

const TICKS_PER_SECOND = 20;
export const secondsToTicks = (seconds: number) =>
	Math.round(seconds * TICKS_PER_SECOND);

export const log = (message: string, emoji?: string) =>
	console.log(emoji ? `${emoji}  ${message}` : message);

export const getPosition = (vector3: Vector3): string =>
	`${vector3.x} ${vector3.y} ${vector3.z}`;

export const snbt = (obj: unknown): string => {
	if (obj === null) return "null";
	else if (typeof obj === "string") return `"${obj.replace(/"/g, '\\"')}"`;
	else if (typeof obj === "number")
		return Number.isInteger(obj) ? `${obj}b` : `${obj}f`;
	else if (typeof obj === "boolean") return obj ? "1b" : "0b";
	else if (Array.isArray(obj)) return `[${obj.map(snbt).join(",")}]`;
	else if (typeof obj === "object") {
		const entries = Object.entries(obj).map(([k, v]) => `${k}:${snbt(v)}`);
		return `{${entries.join(",")}}`;
	} else {
		throw new Error(`Unsupported type: ${typeof obj}`);
	}
};

export const execute = (predicate: string, commands: string[]): string[] => {
	return commands.map((c) => `execute ${predicate} run ${c}`);
};
