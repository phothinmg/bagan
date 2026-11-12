import { baganMinima } from "@bagandev/minima";

/** @type {import("./src/index").BaganConfig} */
const config = {
  site: {
    title: "Bagan Minima Site",
    tagline: "Thoughts on code, design, and simplicity.",
  },
  hostingProvider: "GithubPages",
  baseUrl: "bagan",
  theme: {
    type: "module",
    theme: baganMinima,
  },
  outDir: "docs",
  bagan_minima: {
    nav: [
      {
        link: "/",
        text: "Home",
      },
      {
        link: "/about",
        text: "About",
      },
    ],
  },
};

export default config;
