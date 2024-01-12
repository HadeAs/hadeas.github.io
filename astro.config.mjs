import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import { SITE_METADATA } from "./src/consts.ts";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  trailingSlash: "never",
  build: {
    format: "file",
  },
  site: SITE_METADATA.siteUrl,
  integrations: [mdx(), sitemap(), tailwind()],
});
