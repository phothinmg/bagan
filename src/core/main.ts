import fs from "node:fs";
import path from "node:path";
import { BaganCache } from "@bagandev/bagan_cache";
import type { BaganPlugin } from "@bagandev/types";
import tcolor from "@suseejs/color";
import { Liquid, type LiquidOptions } from "liquidjs";
import type {
  GetBaganConfig,
  LayoutFunction,
  LayoutsContext,
  LayoutsObject,
  LayoutsObjects,
  DataContext,
  PageContext,
  SiteContext,
} from "./config/index.js";
import { baganConfig } from "./config/index.js";
import { getPlugins, parseJson, relativeUrl } from "./plugins/index.js";
import { resolveLiquidLayout, writeFile } from "./utils.js";
import { loadAllData } from "./data.js";

class Bagan {
  // Load config file
  private config: GetBaganConfig = baganConfig();
  // Plugins
  private builtInPlugins: BaganPlugin[] = [parseJson, relativeUrl];
  private configPlugins = this.config.plugins;
  private plugins: BaganPlugin[] = [];
  // Cache module
  cache: BaganCache = new BaganCache(
    this.config.rootDir,
    this.config.assetsDir,
    this.config.baganCacheOpts,
  );
  // Liquid
  private layoutObjects: LayoutsObjects = [];
  private themeDir = this.cache.themeDirs();
  private liquidOptions: LiquidOptions = {
    extname: ".html",
    cache: true,
    layouts: this.themeDir.layoutsDir,
    partials: this.themeDir.includesDir,
    jekyllInclude: true,
    jekyllWhere: true,
    root: process.cwd(),
  };
  private liquid = new Liquid(this.liquidOptions);
  // Data
  private dataCtx = {} as DataContext;
  public async init() {
    // 1. Parse Plugins
    if (this.configPlugins.length > 0) {
      this.plugins = await getPlugins(this.configPlugins);
      for (let plugin of this.plugins) {
        if (typeof plugin === "function") {
          plugin = plugin();
        }
        // parse markdown plugin
        if (plugin.type === "markdown") {
          this.cache.usePlugin(plugin.fun(this.config.configCtx));
        }
        // parse liquid plugin
        if (plugin.type === "liquid") {
          this.liquid.plugin(plugin.fun(this.config.configCtx));
        }
      }
    } // if -> this.configPlugins.length > 0
    if (this.builtInPlugins.length > 0) {
      for (let plugin of this.builtInPlugins) {
        if (typeof plugin === "function") {
          if (plugin.name === "relativeUrl") {
            plugin = plugin((x: string) => this.cache.resolveUrl(x));
          } else {
            plugin = plugin();
          }
        }
        // parse markdown plugin
        if (plugin.type === "markdown") {
          this.cache.usePlugin(plugin.fun(this.config.configCtx));
        }
        // parse liquid plugin
        if (plugin.type === "liquid") {
          this.liquid.plugin(plugin.fun(this.config.configCtx));
        }
      }
    } // if -> this.configPlugins.length > 0
    // 2. check theme dirs
    for (const key of Object.keys(this.themeDir)) {
      const dir = this.themeDir[key as keyof typeof this.themeDir];
      if (!fs.existsSync(dir)) {
        console.error(
          `[${tcolor.magenta("Theme Error")}] : ${dir} dose not exists`,
        );
        process.exit(1);
      }
    }
    // 3. collect layout object
    const liquid_files = (
      await fs.promises.readdir(this.themeDir.layoutsDir, { recursive: true })
    ).filter((f) => path.extname(f) === ".html");
    for (const file of liquid_files) {
      const file_path = path.join(this.themeDir.layoutsDir, file);
      let file_content = await fs.promises.readFile(file_path, "utf8");
      file_content = resolveLiquidLayout(file_content);
      const base_name = path.basename(file);
      const name = base_name.split(".")[0] as string;
      const fn = this.parseLiquid(file_content);
      const obj: LayoutsObject = { name, fn };

      this.layoutObjects.push(obj);
    }
    // this.liquid.plugin(this.relativeUrl((x) => this.cache.resolveUrl(x)));
    // 4. load data
    let localDataDir: string | undefined = undefined;
    if (this.config.dataDir) {
      localDataDir = this.config.rootDir
        ? path.resolve(
            process.cwd(),
            path.join(this.config.rootDir, this.config.dataDir),
          )
        : path.resolve(process.cwd(), this.config.dataDir);
    }
    this.dataCtx = await loadAllData(localDataDir, this.themeDir.dataDir);
  } // method init
  // relativeUrl(fn: (x: string) => string) {
  //   return function (this: Liquid) {
  //     this.registerFilter("relativeUrl", (x) => fn(x));
  //   };
  // }
  private parseLiquid(input: string): LayoutFunction {
    return async (ctx: LayoutsContext) => {
      const html = (await this.liquid.parseAndRender(input, ctx)) as string;
      return html;
    };
  }
  public get pageContexts(): PageContext[] {
    return this.cache.pages().map((obj) => {
      const { extra, ...rest } = obj;
      return { ...rest, ...extra } as PageContext;
    });
  }
  public siteContex() {
    let ctx = { ...this.config.siteCtx } as SiteContext;
    ctx.data = { ...this.dataCtx };
    for (const layout of this.cache.markdownLayouts()) {
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
        config: this.config.configCtx,
      };
      const found = this.layoutObjects.find((p) => p.name === page.layout);
      if (found) {
        const content = await found.fn(ctx);
        await writeFile(page.outFilePath, content);
      }
    }
    for (const assets of this.cache.assets()) {
      if (assets.fileType === "Image") {
        const buffer = Buffer.from(assets.raw, "base64");
        await writeFile(assets.outFilePath, buffer);
      } else {
        await writeFile(assets.outFilePath, assets.raw);
      }
    }
  }
}

export { Bagan };
