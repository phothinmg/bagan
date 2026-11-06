import fs from "node:fs";
import path from "node:path";

const writeFile = async (filePath: string, content: string) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
  await fs.promises.writeFile(filePath, content);
};

export { writeFile };
