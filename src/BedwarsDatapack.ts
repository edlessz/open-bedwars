import * as fs from "fs";
import * as path from "path";
import { log } from "./utils";
import type BedwarsPlugin from "./BedwarsPlugin";

export class BedwarsDatapack {
  public readonly namespace: string;
  constructor(public displayName: string, namespace: string) {
    this.namespace = namespace;
  }

  private plugins: BedwarsPlugin[] = [];
  public usePlugin<T extends BedwarsPlugin>(
    PluginCtor: new (...args: any[]) => T
  ): T {
    const plugin = new PluginCtor(this.namespace); // adjust args here
    this.plugins.push(plugin);
    return plugin;
  }

  public build(buildPath: string) {
    const datapackPath = path.join(buildPath, this.namespace);
    if (!fs.existsSync(datapackPath))
      fs.mkdirSync(datapackPath, { recursive: true });
    log(`Found directory ${datapackPath}`, "📂");

    log(`Building ${this.namespace}...`, "🛠️");

    // Write pack.mcmeta file
    fs.writeFileSync(
      path.join(datapackPath, "pack.mcmeta"),
      JSON.stringify(
        {
          pack: {
            description: this.displayName,
            pack_format: 81,
          },
        },
        null,
        2
      )
    );

    //#region Write event listeners
    const mcFunctionsPath = path.join(
      datapackPath,
      "data",
      "minecraft",
      "tags",
      "function"
    );
    const dpFunctionsPath = path.join(
      datapackPath,
      "data",
      this.namespace,
      "function"
    );
    fs.mkdirSync(mcFunctionsPath, { recursive: true });
    fs.mkdirSync(dpFunctionsPath, { recursive: true });
    ["load", "unload", "tick"].forEach((event) => {
      if (event !== "unload") {
        const values = [`${this.namespace}:${event}`];
        fs.writeFileSync(
          path.join(mcFunctionsPath, `${event}.json`),
          JSON.stringify({
            values,
          })
        );
        log(`Wrote ${event}.json`, "✏️");
      }

      const funcs = {
        load: this.buildLoadFunction,
        unload: this.buildUnloadFunction,
        tick: this.buildTickFunction,
      };
      fs.writeFileSync(
        path.join(dpFunctionsPath, `${event}.mcfunction`),
        funcs[event as keyof typeof funcs].call(this).join("\n")
      );
      log(`Wrote ${event}.mcfunction`, "✏️");
    });
    //#endregion

    //#region Build plugins
    const results = this.plugins.map((plugin) => {
      log(`Building plugin ${plugin.constructor.name}...`, "🛠️");
      const result = plugin.onBuild(datapackPath);
      if (result) {
        log(`Plugin ${plugin.constructor.name} built successfully`, "✅");
      } else {
        log(`Plugin ${plugin.constructor.name} failed to build`, "❌");
      }
      return result;
    });

    if (results.some((result) => !result)) {
      log("Some plugins failed to build, aborting datapack build", "❌");
      fs.rmdirSync(datapackPath, { recursive: true });
      return;
    } else {
      log(`Datapack ${this.namespace} built successfully`, "✅");
    }
  }

  private buildTickFunction(): string[] {
    return [...this.plugins.map((plugin) => plugin.onTick()).flat()];
  }
  private buildUnloadFunction(): string[] {
    return [
      ...this.plugins.map((plugin) => plugin.onUnload()).flat(),
      `kill @e[tag=${this.namespace}]`,
    ];
  }
  private buildLoadFunction(): string[] {
    return [...this.plugins.map((plugin) => plugin.onLoad()).flat()];
  }
}
