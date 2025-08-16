const TICKS_PER_SECOND = 20;
export const secondsToTicks = (seconds: number) =>
	Math.round(seconds * TICKS_PER_SECOND);

export const log = (message: string, emoji?: string) =>
	console.log(`${emoji ? emoji + "  " : ""}${message}`);
