import type { BaganHostingProvider, PageObject } from "@bagandev/bagan_cache";
import { Liquid } from "liquidjs";

// Notes :
// null is falsy in liquid.js

export type DataContext = Record<string, unknown>;

export interface Site {
  /**
   * Title of site - default: Bagan Static Site
   *
   * Stability: 2 - Stable
   *
   * Group - SiteContext
   *
   * Liquid call - site.title
   *
   * Load from config file - true
   */
  title?: string;
  /**
   * Description of site - default: null
   *
   * Stability: 2 - Stable
   *
   * Group - SiteContext
   *
   * Liquid call - site.description
   *
   * Load from config file - true
   */
  description?: string | undefined | null;
  /**
   * Favicon for site - default: null
   *
   * Stability: 2 - Stable
   *
   * Group - SiteContext
   *
   * Liquid call - site.favicon
   *
   * Load from config file - true
   */
  favicon?: string | undefined | null;
  /**
   * Keywords of site - default: null
   *
   * Stability: 2 - Stable
   *
   * Group - SiteContext
   *
   * Liquid call - site.keywords
   *
   * Load from config file - true
   */
  keywords?: string[] | undefined | null;
  /**
   * Author of site - default: null
   *
   * Stability: 2 - Stable
   *
   * Group - SiteContext
   *
   * Liquid call - site.author
   *
   * Load from config file - true
   */
  author?: string | undefined | null;
  tagline?: string | undefined | null;
}

export interface NoneContext {
  /**
   * Root of site - default: "."(cwd)
   *
   * Stability: 2 - Stable
   *
   * Group - BaganCache(first parameter)
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  root_dir?: string;

  /**
   * The directory where local plugins(.mjs) files are located - default: "root_dir/_plugins"
   *
   * Stability: 1 - Experimental
   *
   * Group - Local
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  plugins_dir?: string;
  /**
   * The directory to bagan cache - default: "root_dir/.bagan_cache"
   *
   * Stability: 2 - Stable
   *
   * Group - Local
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  cache_dir?: string;
  /**
   * The directory to build output - default: "root_dir/.bagan"
   *
   * Stability: 2 - Stable
   *
   * Group - Local
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  out_dir?: string;
  /**
   * Name of theme - default: null
   *
   * Stability: 1 - Experimental
   *
   * Group - Theme
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  theme?: string | undefined | null;
  /**
   * List of Bagan plugins names - default: []
   *
   * Stability: 1 - Experimental
   *
   * Group - Plugin
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  plugins?: string[];
}

export interface HostingContext {
  /**
   * Hosting provider - default: "GithubPages"
   *
   * Stability: 2 - Stable
   *
   * Group - Hosting
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  hosting_provider?: BaganHostingProvider;
  /**
   * GitHub repository name for project pages (`/<repo>/` prefix) - default: undefined
   *
   * Stability: 2 - Stable
   *
   * Group - Hosting
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  repo?: string | undefined;
  /**
   * Custom site URL (overrides provider defaults when set) - default: undefined
   *
   * Stability: 2 - Stable
   *
   * Group - Hosting
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  site_url?: string | undefined;
  /**
   * Extra path prefix (e.g. `"subpath"` for `example.com/subpath/`) - default: undefined
   *
   * Stability: 2 - Stable
   *
   * Group - Hosting
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  path_prefix?: string | undefined;
}

export interface MarkdownContext {
  /**
   * Enable Github Flavored Markdown (GFM) - default: true
   *
   * Stability: 2 - Stable
   *
   * Group - Markdown
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  gfm?: boolean;
  /**
   * Enable Kramdown-style block attributes (`{:#id .class key="val"}`) - default: true
   *
   * Stability: 2 - Stable
   *
   * Group - Markdown
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  kramdown?: boolean;
}

export interface LocalThemeContext {
  /**
   * The directory where assets files are located - default: "root_dir/_assets"
   *
   * Stability: 2 - Stable
   *
   * Group - BaganCache(second parameter) and Local
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  assets_dir?: string;
  /**
   * The directory where liquid template files are located - default: "root_dir/_layouts"
   *
   * Stability: 2 - Stable
   *
   * Group - Local
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  layouts_dir?: string;
  /**
   * The directory where liquid includes files are located - default: "root_dir/_includes"
   *
   * Stability: 2 - Stable
   *
   * Group - Local
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  includes_dir?: string;
  /**
   * The directory where data yaml(.yml or .yaml) files are located - default: "root_dir/_data"
   *
   * Stability: 2 - Stable
   *
   * Group - Local
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  data_dir?: string;
}

export interface ArchiveContext {
  /**
   * Pending-content threshold (bytes) that triggers writing a new shard
   *
   * default: 8 * 1024 * 1024(8 MiB) , `0` disables size-based flushing (interval/drop only)
   *
   * Stability: 1 - Experimental
   *
   * Group - Local
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  shard_bytes?: number;
  /**
   * Maximum time (ms) pending entries may sit in the worker buffer before being flushed
   *
   * default: 2_000(2 seconds) , `0` disables the timer
   *
   * Stability: 1 - Experimental
   *
   * Group - Local
   *
   * Liquid call - None
   *
   * Load from config file - true
   */
  flush_interval_Ms?: number;
}

export type BaganConfig = Site &
  NoneContext &
  LocalThemeContext &
  MarkdownContext &
  HostingContext &
  ArchiveContext &
  Record<string, unknown>;

/**
 * Site context these are add by Bagan Class (by layouts)
 *
 */
export type SiteContext = Record<string, unknown> & Site;

type PageObj = Omit<PageObject, "extra">;
type ExtraPage = Pick<PageObject, "extra">;

export type PageContext = PageObj & ExtraPage & Record<string, unknown>;

export interface LayoutsContext {
  site: SiteContext;
  page: PageContext;
  config: Record<string, unknown>;
}
export type LayoutFunction = (ctx: LayoutsContext) => Promise<string>;

export type LayoutsObject = { name: string; fn: LayoutFunction };
export type LayoutsObjects = LayoutsObject[];
