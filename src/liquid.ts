import fs from "node:fs";
import path from "node:path";
import { Liquid, type LiquidOptions } from "liquidjs";
import type {
  LayoutsObject,
  LayoutsObjects,
  LayoutFunction,
  LayoutsContext,
} from "./config/types.js";
import { frontmatter } from "@bagandev/bagan_cache";

type ResolveUrl = (path: string) => string;

const resolveLiquidLayout = (input: string) => {
  const fmt = frontmatter(input);
  let result = fmt.cleanContent;
  if (fmt.yamlData?.layout) {
    const lou = fmt.yamlData?.layout;
    const louText = `{% layout ${lou}.html %}`;
    result = `${louText}\n${fmt.cleanContent}`;
  }
  return result;
};
// Liquid Js Plugins
function relativeUrl(fn: ResolveUrl) {
  return function (this: Liquid) {
    this.registerFilter("relativeUrl", (x) => fn(x));
  };
}

function parseJson(this: Liquid) {
  this.registerFilter("parse_json", (value: unknown) => {
    if (typeof value !== "string") {
      return value;
    }

    return JSON.parse(value);
  });
}

class BaganLiquid {
  private _liquidOptions: LiquidOptions;
  private _layoutDir: string;
  private _engine: Liquid;
  private _layoutNames: string[];
  private _layoutObjects: LayoutsObjects;

  constructor(layoutsDir: string, includesDir: string, urlFn: ResolveUrl) {
    this._liquidOptions = {
      extname: ".html",
      cache: true,
      layouts: layoutsDir,
      partials: includesDir,
      jekyllInclude: true,
      jekyllWhere: true,
      root: process.cwd(),
    };
    this._layoutDir = layoutsDir;
    this._engine = new Liquid(this._liquidOptions);
    this._layoutNames = [];
    this._layoutObjects = [];
    this._engine.plugin(relativeUrl(urlFn));
    this._engine.plugin(parseJson);
  }
  private parseLiquid(input: string): LayoutFunction {
    return async (ctx: LayoutsContext) => {
      const html = (await this._engine.parseAndRender(input, ctx)) as string;
      return html;
    };
  }
  public async init(): Promise<void> {
    const liquid_files = (
      await fs.promises.readdir(this._layoutDir, { recursive: true })
    ).filter((f) => path.extname(f) === ".html");
    for (const file of liquid_files) {
      const file_path = path.join(this._layoutDir, file);
      let file_content = await fs.promises.readFile(file_path, "utf8");
      file_content = resolveLiquidLayout(file_content);
      const base_name = path.basename(file);
      const name = base_name.split(".")[0] as string;
      const fn = this.parseLiquid(file_content);
      const obj: LayoutsObject = { name, fn };
      this._layoutNames.push(name);
      this._layoutObjects.push(obj);
    }
  }
  public get layouts(): LayoutsObjects {
    return this._layoutObjects;
  }
  public get layoutNames(): string[] {
    return this._layoutNames;
  }
}

export { BaganLiquid };
