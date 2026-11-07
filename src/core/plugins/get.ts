import fs from "node:fs";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";
import type { BaganPlugin } from "@bagandev/types";
import tcolor from "@suseejs/color";

async function askForExist() {
	const rl = readline.createInterface({ input, output });
	let ans = "";
	try {
		ans = await rl.question(
			`Do you want to exist and check ${tcolor.dim("(y/N)")} : `,
			{ signal: AbortSignal.timeout(5000) },
		);
	} catch (err) {
		if ((err as Error).name === "AbortError") {
			ans = "N";
		}
	} finally {
		rl.close();
	}
	return ans;
}

async function resolvePlugin(plugin: string) {
	const pluginPath = path.resolve(
		process.cwd(),
		path.join("node_modules", plugin),
	);

	if (fs.existsSync(pluginPath)) {
		const pkg = await import(plugin);
		if (pkg.default) {
			return pkg.default as BaganPlugin;
		} else {
			console.error(
				`[${tcolor.magenta("Plugin Error")}] : Plugin ${tcolor.cyan(`${plugin}`)} has not default export.`,
			);
			const ans = await askForExist();
			if (ans === "y" || ans === "Y" || ans === "yes") {
				process.exit(1);
			} else {
				return null;
			}
		}
	} else {
		console.error(
			`[${tcolor.magenta("Plugin Error")}] : Plugin ${tcolor.cyan(`${plugin}`)} dose not installed`,
		);
		const ans = await askForExist();
		if (ans === "y" || ans === "Y" || ans === "yes") {
			process.exit(1);
		} else {
			return null;
		}
	}
}
async function getPlugins(plugins: string[]) {
	const result: BaganPlugin[] = [];
	for (const plugin of plugins) {
		const resolvedPlugin = await resolvePlugin(plugin);
		if (resolvedPlugin !== null) {
			result.push(resolvedPlugin);
		}
	}
	return result;
}

export { getPlugins };
