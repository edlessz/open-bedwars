export default abstract class BedwarsPlugin {
  public onUnload(): string[] {
    return [];
  }
  public onLoad(): string[] {
    return [];
  }
  public onTick(): string[] {
    return [];
  }
  public onBuild(datapackPath: string): boolean {
    return true;
  }

  public readonly namespace: string;
  constructor(namespace: string) {
    this.namespace = namespace;
  }
}
