import {
  BaganCache,
  type ThemeDirs,
  type PageObject,
  type AssetsObject,
} from "@bagandev/bagan_cache";
import { BaganLiquid } from "./liquid.js";
import { loadConfig } from "./config.js";
import type {
  _SiteConfig,
  DataContext,
  SiteContext,
  PageContext,
  LayoutsObjects,
  LayoutsContext,
} from "./types.js";
import { loadAllData } from "./data.js";
import path from "node:path";
import { writeFile } from "./helpers.js";

class Bagan {
  private _config = {} as _SiteConfig;
  private _cache = {} as BaganCache;
  private _liquid = {} as BaganLiquid;
  private _themeDirs = {} as ThemeDirs;
  private _dataCtx = {} as DataContext;
  private _pageObjects = {} as PageObject[];
  private _assetsObjects = {} as AssetsObject[];
  private _layoutNames: string[] = [];
  private _layoutObjects: LayoutsObjects = [];

  private async config() {
    this._config = await loadConfig();
  }
  private cache() {
    this._cache = new BaganCache(
      this._config.rootDir,
      this._config.assetsDir,
      this._config.options,
    );
    if (this._config.peisarPlugins.length > 0) {
      for (let plugin of this._config.peisarPlugins) {
        this._cache.usePlugin(plugin);
      }
    }
    this._themeDirs = this._cache.themeDirs();
    this._pageObjects = this._cache.pages();
    this._assetsObjects = this._cache.assets();
  }
  private async liquid() {
    // for liquid
    this._liquid = new BaganLiquid(
      this._themeDirs.layoutsDir,
      this._themeDirs.includesDir,
    );
    await this._liquid.init();
    this._layoutNames = this._liquid.layoutNames;
    this._layoutObjects = this._liquid.layouts;
  }
  private async data() {
    const localDataDir = this._config.dataDir
      ? path.join(this._config.rootDir as string, this._config.dataDir)
      : undefined;
    this._dataCtx = await loadAllData(localDataDir, this._themeDirs.dataDir);
  }
  public async init() {
    // const tasks = [
    //   this.config,
    //   () => Promise.resolve(this.cache()),
    //   this.liquid,
    //   this.data,
    // ];
    // for (const task of tasks) {
    //   await task();
    // }
    await this.config();
    this.cache();
    await this.liquid();
    await this.data();
  }
  public get pageContexts(): PageContext[] {
    return this._pageObjects.map((obj) => {
      const { extra, ...rest } = obj;
      return { ...rest, ...extra } as PageContext;
    });
  }
  public siteContex() {
    let ctx = { ...this._config.site } as SiteContext;
    ctx.data = { ...this._dataCtx };
    for (const layout of this._layoutNames) {
      const page_ctx = this.pageContexts.filter((c) => c.layout === layout);
      ctx[layout] = page_ctx;
    }
    return ctx;
  }
  public async build() {
    for (const page of this.pageContexts) {
      const ctx: LayoutsContext = {
        site: { ...this.siteContex() },
        page: { ...page },
      };
      const found = this._layoutObjects.find((p) => p.name === page.layout);
      if (found) {
        const content = await found.fn(ctx);
        await writeFile(page.outFilePath, content);
      }
    }
    for (const assets of this._assetsObjects) {
      await writeFile(assets.outFilePath, assets.raw);
    }
  }
}

export { Bagan };
