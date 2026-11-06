import { Liquid } from "liquidjs";
import type { ResolveUrl } from "../config/types.js";

function relativeUrl(fn: ResolveUrl) {
  return function (this: Liquid) {
    this.registerFilter("relativeUrl", (x) => fn(x));
  };
}

function parseJson(this: Liquid) {
  this.registerFilter("parse_json", (value: unknown) => {
    if (typeof value !== "string") {
      return value;
    }

    return JSON.parse(value);
  });
}

export { relativeUrl, parseJson };
