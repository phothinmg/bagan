import type { SiteConfig } from "./src/config/types.js";

const config: SiteConfig = {
  site: {
    title: "Bagan Minima Site",
    tagline: "Thoughts on code, design, and simplicity.",
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
  outDir: "docs",
  hosting: {
    provider: "GithubPages",
    repo: "bagan",
  },
};

export default config;
