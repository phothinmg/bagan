import path from "node:path";
import fs from "node:fs";
import type { SiteConfig, _SiteConfig } from "./types.js";
import tcolor from "@suseejs/color";
import type { PeisarOptions } from "@bagandev/bagan_cache";

function loadConfigFile() {
  const files = ["bagan.config.ts", "bagan.config.mjs", "bagan.config.cjs"];
  let found: string | undefined = undefined;
  for (const file of files) {
    const file_path = path.resolve(process.cwd(), file);
    if (fs.existsSync(file_path)) {
      found = file_path;
      break;
    }
  }
  if (!found) {
    console.error(
      `[${tcolor.magenta("Config Error")}] : No peisar config file found.`,
    );
    process.exit(1);
  }
  return found;
}

async function loadConfig(): Promise<_SiteConfig> {
  const configFile = loadConfigFile();
  const importedConfig: { default: SiteConfig | undefined } = await import(
    configFile
  );
  if (!importedConfig) {
    console.error(
      `[${tcolor.magenta("Config Error")}] : Error when loading config file`,
    );
    process.exit(1);
  }
  const config = importedConfig.default as SiteConfig;
  const { site, ...config_rest } = config;

  return {
    site,
    ...config_rest,
    options: {
      markdown: {
        fragment: true,
        kramdown: true,
        gfm: true,
      },
      outDir: "docs",
    },
    peisarPlugins: config.peisarPlugins ?? [],
  };
}

export { loadConfig };
