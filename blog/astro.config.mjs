import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://www.earthdoom.com",
  integrations: [
    mdx(),
    // The blog holds placeholder posts for now, so it stays out of search (see BlogPost/noindex).
    sitemap({ filter: (page) => !page.includes("/blog/") }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  // Archivo is the game's typeface; the width axis lets headings run wide (112–125%)
  // like the game UI. Self-hosted and preloaded by Astro's Fonts API.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Archivo",
      cssVariable: "--font-archivo",
      weights: ["400 800"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      options: {
        experimental: { variableAxis: { wdth: [[100, 125]] } },
      },
    },
  ],
});
