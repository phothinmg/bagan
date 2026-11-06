import {
  type Plugin,
  type HostingConfig,
  type PeisarOptions,
  type ArchiveConfig,
  type BaganThemeConfig,
} from "@bagandev/bagan_cache";
import { Liquid } from "liquidjs";

export type DataContext = Record<string, unknown>;

export type Site = {
  title: string;
  description?: string | undefined;
  favicon?: string | undefined;
  keywords?: string[] | undefined;
  rootDir?: string | null | undefined;
  assetsDir?: string | null | undefined;
  dataDir?: string | null | undefined;
  layoutsDir?: string | null | undefined;
  includesDir?: string | null | undefined;
  theme?: string | undefined | null;
};

export type SiteContext = Site & Record<string, any>;

export type PageContext = Record<string, any>;

export interface LayoutsContext {
  site: SiteContext;
  page: PageContext;
}
export type LayoutFunction = (ctx: LayoutsContext) => Promise<string>;

export type LayoutsObject = { name: string; fn: LayoutFunction };
export type LayoutsObjects = LayoutsObject[];

export type ResolveUrl = (path: string) => string;
export type BaganLiquidPlugin = (this: Liquid) => void;
export type BaganLiquidPluginFactory = (
  ...args: any[]
) => (this: Liquid) => void;

export type SiteConfig = {
  site: SiteContext;
  peisarPlugins?: Plugin[];
  markdown?: Pick<PeisarOptions, "gfm" | "kramdown" | "fileName">;
  /** Disk-archive thresholds (shard size / flush interval). */
  archive?: ArchiveConfig | undefined;
  /** Static-hosting baseUrl resolution. */
  hosting?: HostingConfig | undefined;
  /** Build output directory. */
  outDir?: string | undefined;
  /** Disk-archive directory. */
  cacheDir?: string | undefined;
  themeConfig?: BaganThemeConfig;
};
export type _SiteConfig = {
  site: SiteContext;
  peisarPlugins: Plugin[];
  markdown?: PeisarOptions;
  /** Disk-archive thresholds (shard size / flush interval). */
  archive?: ArchiveConfig | undefined;
  /** Static-hosting baseUrl resolution. */
  hosting?: HostingConfig | undefined;
  /** Build output directory. */
  outDir?: string | undefined;
  /** Disk-archive directory. */
  cacheDir?: string | undefined;
  themeConfig?: BaganThemeConfig;
};
