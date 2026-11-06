import {
  BaganCache,
  type ThemeDirs,
  type PageObject,
  type AssetsObject,
} from "@bagandev/bagan_cache";
import { BaganLiquid } from "./liquid/index.js";
import { loadConfig } from "./config/index.js";
import type {
  _SiteConfig,
  DataContext,
  SiteContext,
  PageContext,
  LayoutsObjects,
  LayoutsContext,
} from "./config/types.js";
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
      this._config.site.rootDir,
      this._config.site.assetsDir,
      {
        markdown: { ...(this._config.markdown || {}) },
        archive: { ...(this._config.archive || {}) },
        hosting: { ...(this._config.hosting || {}) },
        themeConfig: { ...(this._config.themeConfig || {}) },
        ...(this._config.site.theme != null
          ? { theme: this._config.site.theme }
          : {}),
        ...(this._config.outDir != null ? { outDir: this._config.outDir } : {}),
        ...(this._config.cacheDir != null
          ? { cacheDir: this._config.cacheDir }
          : {}),
      },
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
      (url) => this._cache.resolveUrl(url),
    );
    await this._liquid.init();
    this._layoutNames = this._liquid.layoutNames;
    this._layoutObjects = this._liquid.layouts;
  }
  private async data() {
    const localDataDir = this._config.site.dataDir
      ? path.join(
          this._config.site.rootDir as string,
          this._config.site.dataDir as string,
        )
      : undefined;
    this._dataCtx = await loadAllData(localDataDir, this._themeDirs.dataDir);
  }
  public async init() {
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
      if (assets.fileType === "Image") {
        const buffer = Buffer.from(assets.raw, "base64");
        await writeFile(assets.outFilePath, buffer);
      } else {
        await writeFile(assets.outFilePath, assets.raw);
      }
    }
  }
  public cacheObject() {
    return this._cache;
  }
}

export { Bagan };
