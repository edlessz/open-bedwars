import * as esbuild from "esbuild";

esbuild
	.build({
		entryPoints: ["src/main.ts"],
		bundle: true,
		platform: "node",
		target: "node18",
		outdir: "dist",
		sourcemap: true,
		format: "cjs",
	})
	.catch(() => process.exit(1));
