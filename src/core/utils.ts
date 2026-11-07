import fs from "node:fs";
import path from "node:path";
import { frontmatter } from "@bagandev/bagan_cache";

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

const writeFile = async (
  filePath: string,
  content:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>,
) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
  await fs.promises.writeFile(filePath, content);
};

const isPlainObject = (input: any) =>
  typeof input === "object" &&
  !Array.isArray(input) &&
  Object.keys(input).length === 0;

export { resolveLiquidLayout, writeFile, isPlainObject };
