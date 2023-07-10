import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";


// https://astro.build/config
export default defineConfig({
  site: 'https://www.earthdoom.com',
<<<<<<< HEAD
  integrations: [mdx(), sitemap(), tailwind()],
  output: "hybrid",
  adapter: vercel()
=======
  integrations: [mdx(), sitemap(), tailwind()],  
  output: "static" 
>>>>>>> parent of 776d563 (Update astro.config.mjs)
});