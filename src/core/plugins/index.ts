import type { BaganPlugin } from "@bagandev/types";
import { getPlugins } from "./get.js";

const relativeUrl: BaganPlugin = (fn: (path: string) => string) => {
  return {
    name: "bagan-relative-url",
    version: "0.1.0",
    type: "liquid",
    fun() {
      return function (this) {
        this.registerFilter("relativeUrl", (x) => fn(x));
      };
    },
  };
};
const parseJson: BaganPlugin = {
  name: "bagan-parse-json",
  version: "0.1.0",
  type: "liquid",
  fun() {
    return function (this) {
      this.registerFilter("parse_json", (value: unknown) => {
        if (typeof value !== "string") {
          return value;
        }

        return JSON.parse(value);
      });
    };
  },
};

export { getPlugins, parseJson, relativeUrl };
