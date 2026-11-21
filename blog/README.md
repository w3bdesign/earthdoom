# Earth Doom website

The marketing site for [earthdoom.com](https://earthdoom.com): home page, game manual, about page and blog. It is a static site built with [Astro](https://astro.build/), and its look follows the game's own design system (`../game/DESIGN.md`).

## Tech stack

- **Framework:** Astro 7 (static output, Content Layer for blog posts, Fonts API, `astro:assets` image optimisation, CSS view transitions)
- **Styling:** Tailwind CSS 4, with the design tokens in `src/styles/global.css` (`@theme`)
- **Content:** Markdown / MDX blog posts in `src/content/blog/`
- **Icons:** Lucide (`@lucide/astro`)
- **Font:** Archivo (self-hosted at build time by the Astro Fonts API)

## Getting started

### Prerequisites

- Node.js 22.23.4 or newer
- npm

### Install and run

```sh
npm install
npm run dev
```

The site is served at `http://localhost:4321/`.

## Commands

| Command           | Action                                              |
| :---------------- | :-------------------------------------------------- |
| `npm install`     | Install dependencies                                |
| `npm run dev`     | Start the dev server at `localhost:4321`            |
| `npm run build`   | Build the production site to `./dist/`              |
| `npm run preview` | Preview the built site locally                      |
| `npm run check`   | Type-check the project (`astro check`)              |

## Deploying

The site is fully static. Run `npm run build` and upload the **contents** of `dist/` to the web root. Files in `dist/_astro/` have hashed names, so files from earlier builds can be deleted from the server.

## Project structure

```text
/
├── public/                 # Favicons, manifest, files copied as-is
├── src/
│   ├── assets/             # Logo and spaceship artwork (optimised at build time)
│   ├── components/
│   │   ├── common/         # Button
│   │   ├── Header/         # BaseHead (meta tags), Header, Wordmark, HeaderLink
│   │   ├── Footer/
│   │   ├── Index/          # Home page sections: Hero, GameLoop, ManualIndex, FinalCall
│   │   └── Manual/         # Manual text (ManualSections.js), section ids, damage table
│   ├── content/blog/       # Blog posts (Markdown / MDX)
│   ├── data/game.ts        # Game facts quoted on the home page (costs, ETAs, attack timing)
│   ├── layouts/            # BaseLayout (every page) and BlogPost
│   ├── pages/              # Routes: /, /manual, /about, /blog, /404, /rss.xml
│   ├── styles/global.css   # Design tokens and shared styles
│   └── consts.ts           # Site title, description, Play URL, nav links
├── PRODUCT.md              # Product and audience notes used for design work
├── DESIGN.md               # The site's design system
└── astro.config.mjs
```

## Content notes

- Game numbers on the home page come from `src/data/game.ts`. Keep them in step with the game and the manual.
- The manual text lives in `src/components/Manual/ManualSections.js`; section anchors (`/manual/#getting-started`) are generated from the titles.
- The blog is not linked from the navigation yet, and its posts are still placeholders.

## Design checks

The design was built with [impeccable](https://impeccable.style/). With it installed, run its detector from this folder:

```sh
~/.claude/skills/impeccable/scripts/impeccable detect src
```

## License

Distributed under the MIT License.
