import fs from "node:fs";
import path from "node:path";
import tcolor from "@suseejs/color";
import { yamlParser } from "@bagandev/bagan_cache";
import type { DataContext } from "./config/types.js";

function isDataContext(value: unknown): value is DataContext {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDataContext(
  existing: DataContext,
  incoming: DataContext,
): DataContext {
  for (const [key, value] of Object.entries(incoming)) {
    const existingValue = existing[key];
    if (isDataContext(existingValue) && isDataContext(value)) {
      mergeDataContext(existingValue, value);
    } else if (existingValue === undefined) {
      existing[key] = value;
    }
  }
  return existing;
}

type LoadedData = {
  data: DataContext;
  /** Maps each top-level data key to the data files (relative to the data directory) that define it. */
  origins: Map<string, string[]>;
};

async function loadData(
  dataDir?: string | undefined,
): Promise<LoadedData | null> {
  if (dataDir) {
    const obj: DataContext = {};
    const origins = new Map<string, string[]>();
    if (!fs.existsSync(dataDir)) {
      console.error(
        `Data directory ${dataDir} does not exist or is not under the root directory.`,
      );
      process.exit(1);
    }
    const files = (
      await fs.promises.readdir(dataDir, { recursive: true })
    ).filter((f) => path.extname(f) === ".yml" || path.extname(f) === ".yaml");
    for (const file of files) {
      const file_path = path.join(dataDir, file);
      const parts = file.split(path.sep);
      const file_name = path.basename(file, path.extname(file));
      const top_level_key =
        parts.length > 1 ? (parts[0] ?? file_name) : file_name;
      const file_content = await fs.promises.readFile(file_path, "utf8");
      const data = yamlParser(file_content);
      let current = obj;

      for (const part of parts.slice(0, -1)) {
        const existing = current[part];
        if (existing === undefined) {
          const next: DataContext = {};
          current[part] = next;
          current = next;
        } else if (isDataContext(existing)) {
          current = existing;
        } else {
          throw new TypeError(
            `Cannot create nested data under "${part}" because it is not an object.`,
          );
        }
      }

      const existing = current[file_name];
      if (isDataContext(existing) && isDataContext(data)) {
        mergeDataContext(existing, data);
      } else if (existing === undefined) {
        current[file_name] = data;
      } else {
        throw new TypeError(
          `Conflicting data files resolve to "${file_name}".`,
        );
      }
      const key_files = origins.get(top_level_key);
      if (key_files) {
        key_files.push(file);
      } else {
        origins.set(top_level_key, [file]);
      }
    }
    return { data: obj, origins };
  } else {
    return null;
  }
}

function reportDuplicateKeys(
  local: LoadedData,
  theme: LoadedData,
  localDataDir: string,
  themeDataDir: string,
): void {
  const duplicates = [...local.origins.keys()]
    .filter((key) => theme.origins.has(key))
    .sort();
  if (duplicates.length === 0) {
    return;
  }
  console.error(
    `[${tcolor.yellow("Data Warning")}] : duplicate top-level data keys found, the "theme" data values override the "local" ones:`,
  );
  for (const key of duplicates) {
    console.error(`  data key "${key}" is defined in:`);
    console.error(`    local (${localDataDir}):`);
    for (const file of [...(local.origins.get(key) ?? [])].sort()) {
      console.error(`      ${file}`);
    }
    console.error(`    theme (${themeDataDir}):`);
    for (const file of [...(theme.origins.get(key) ?? [])].sort()) {
      console.error(`      ${file}`);
    }
  }
}

async function loadAllData(
  localDataDir?: string | undefined,
  themeDataDir?: string | undefined,
) {
  const local = await loadData(localDataDir);
  const theme = await loadData(themeDataDir);
  if (
    local &&
    theme &&
    localDataDir &&
    themeDataDir &&
    localDataDir !== themeDataDir
  ) {
    reportDuplicateKeys(local, theme, localDataDir, themeDataDir);
  }
  return { ...local?.data, ...theme?.data } as DataContext;
}

export { loadAllData, loadData };
