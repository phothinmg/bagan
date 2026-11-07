import fs from "node:fs";
import path from "node:path";
import type { BaganCacheJsOptions } from "@bagandev/bagan_cache";
import { loadYaml } from "@bagandev/bagan_cache";
import tcolor from "@suseejs/color";
import type {
  BaganConfig,
  DataContext,
  LayoutFunction,
  LayoutsContext,
  LayoutsObject,
  LayoutsObjects,
  SiteContext,
  PageContext,
} from "./types.js";

function loadConfigFile(): string {
  const files = ["bagan.config.yml", "bagan.config.yaml"];
  let found: string | undefined;
  for (const file of files) {
    const file_path = path.resolve(process.cwd(), file);
    if (fs.existsSync(file_path)) {
      found = file_path;
      break;
    }
  }
  if (!found) {
    console.error(
      `[${tcolor.magenta("Config Error")}] : No config file found.`,
    );
    process.exit(1);
  }
  return found;
}

function loadConfig() {
  const configFile = loadConfigFile();
  try {
    return loadYaml(configFile) as BaganConfig;
  } catch (error) {
    console.error`[${tcolor.magenta("Config Error")}] : ${(error as Error).message}`;
    process.exit(1);
  }
}

type GetBaganConfig = {
  rootDir: string | null;
  assetsDir: string | null;
  dataDir: string | null;
  baganCacheOpts: BaganCacheJsOptions;
  siteCtx: SiteContext;
  plugins: string[];
  configCtx: {
    [x: string]: unknown;
    plugins_dir?: string;
  };
};

function baganConfig() {
  const {
    root_dir,
    plugins,
    title,
    description,
    favicon,
    keywords,
    author,
    tagline,
    theme,
    layouts_dir,
    assets_dir,
    data_dir,
    includes_dir,
    cache_dir,
    out_dir,
    shard_bytes,
    flush_interval_Ms,
    gfm,
    kramdown,
    hosting_provider,
    repo,
    site_url,
    path_prefix,
    ...rest
  } = loadConfig();
  const archive_obj = {
    ...(shard_bytes || flush_interval_Ms
      ? {
          archive: {
            ...(shard_bytes ? { shardBytes: shard_bytes } : {}),
            ...(flush_interval_Ms
              ? { flushIntervalMs: flush_interval_Ms }
              : {}),
          },
        }
      : {}),
  };
  const hosting_object = {
    ...(hosting_provider || repo || site_url || path_prefix
      ? {
          hosting: {
            ...(hosting_provider ? { provider: hosting_provider } : {}),
            ...(repo ? { repo: repo } : {}),
            ...(site_url ? { siteUrl: site_url } : {}),
            ...(path_prefix ? { pathPrefix: path_prefix } : {}),
          },
        }
      : {}),
  };
  // cache optons
  const baganCacheOpts: BaganCacheJsOptions = {
    ...(theme ? { theme: theme } : {}),
    ...(layouts_dir ? { themeLayoutsDir: layouts_dir } : {}),
    ...(assets_dir ? { themeAssetsDir: assets_dir } : {}),
    ...(data_dir ? { themeDataDir: data_dir } : {}),
    ...(includes_dir ? { themeIncludesDir: assets_dir } : {}),
    markdown: {
      fragment: true,
      gfm: gfm ?? true,
      kramdown: kramdown ?? true,
    },
    ...archive_obj,
    ...hosting_object,
    ...(out_dir ? { outDir: out_dir } : {}),
    ...(cache_dir ? { cacheDir: cache_dir } : {}),
  };
  const siteCtx: SiteContext = {
    title: title ?? "Bagan Static Site",
    description: description ?? null,
    favicon: favicon ?? null,
    keywords: keywords ?? null,
    author: author ?? null,
    tagline: tagline ?? null,
  };
  return {
    rootDir: root_dir ?? null,
    assetsDir: assets_dir ?? null,
    dataDir: data_dir ?? null,
    baganCacheOpts,
    siteCtx,
    plugins: plugins ?? [],
    configCtx: { ...rest },
  };
}

export type {
  DataContext,
  GetBaganConfig,
  LayoutFunction,
  LayoutsContext,
  LayoutsObject,
  LayoutsObjects,
  PageContext,
  SiteContext,
};
export { baganConfig };
