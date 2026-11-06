import type { SiteConfig } from "./src/types.js";

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
};

export default config;
