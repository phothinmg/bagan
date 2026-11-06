import {
  type PageObject,
  type PeisarOptions,
  type Plugin,
  type BaganCacheJsOptions,
} from "@bagandev/bagan_cache";

export type DataContext = Record<string, unknown>;

export type SiteContext = {
  title: string;
  url?: string | undefined;
  baseUrl?: string | undefined;
  description?: string | undefined;
  favicon?: string | undefined;
  keywords?: string[] | undefined;
  logo?:
    | string
    | {
        light: string;
        dark: string;
      }
    | undefined;
} & Record<string, any>;

export type PageContext = Record<string, any>;

export interface LayoutsContext {
  site: SiteContext;
  page: PageContext;
}
export type LayoutFunction = (ctx: LayoutsContext) => Promise<string>;

export type LayoutsObject = { name: string; fn: LayoutFunction };
export type LayoutsObjects = LayoutsObject[];

export type SiteConfig = {
  site: SiteContext;
  rootDir?: string | null | undefined;
  assetsDir?: string | null | undefined;
  dataDir?: string | null | undefined;
  peisarPlugins?: Plugin[];
};

export type _SiteConfig = {
  site: SiteContext;
  rootDir?: string | null | undefined;
  assetsDir?: string | null | undefined;
  dataDir?: string | null | undefined;
  options: BaganCacheJsOptions;
  peisarPlugins: Plugin[];
};
