# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: prospective players.** Strategy and browser-game players, often people who played Planetarion or similar tick-based games, deciding whether Earth Doom is worth signing up for. Their job on this site: understand what the game is and how it plays in a minute, then press "Play now".
- **Secondary: current players.** People already playing who come back for the manual (how ticks, land, units and combat work, the damage table) and to follow development through the blog.

## Product Purpose

earthdoom.com is the public front door of Earth Doom, a free, tick-based browser strategy game. The site explains the game, holds the player manual, and publishes development posts. Success is a visitor who understands the loop (build, research, scout, develop land, attack) and signs up at `https://game.earthdoom.com/login`, and a player who finds a rules answer in the manual without hunting.

## Positioning

A Planetarion-style, tick-based strategy game you play in short visits: every tick (about sixty seconds) resources arrive and queued production counts down, so the game rewards planning over reflexes. It is free to play, open for sign-ups now, and built and run by one developer. Site copy does not mention the developer; it sells the game.

## Operating Context

- The game itself lives at `game.earthdoom.com` (Next.js app with its own design system in `../game/DESIGN.md`). This site hands visitors over to it.
- Gameplay loop, from the manual and game source: tax collectors → credits; titanium extractor → titanium; scouts find land; land is developed into houses (credits) or mines (titanium); research unlocks buildings and units; units are produced over a number of ticks; grabbers are the only unit that captures land in combat; spying finds targets; fleets take several ticks to arrive.
- Game terms to keep consistent: tick, ETA (in ticks), credits, titanium, energy, land (houses / mines / undeveloped), score, rank, alliance, fleet, scouts, grabbers.
- Unit names as shown in the game's production screen: Light infantry, Shadow, Heavy Infantry, Goliaths, Grabber, Hellspawn, Ares, Medusa, Reaper, Avengers, Lucius (see `../game/src/components/features/Production/constants/PRODUCTION.tsx`).

## Capabilities and Constraints

- Static Astro 7 site (`output: "static"`), Tailwind 4, MDX blog posts, RSS and sitemap. Deployed by copying the built files; no server runtime.
- Pages: home, manual, blog index, blog posts, about.
- The game is in active development. Saying so is allowed but not required; the old "I run the ticker manually" note is optional, not a commitment.
- Open-source status is **not** to be promoted on the site (not confirmed as a public message).

## Brand Commitments

- Name: **Earth Doom** (two words in prose; "EARTH DOOM" wordmark in the game UI).
- Keep the round "E" logo (`public/images/logo.png`) and the spaceship artwork (`public/images/new-spaceship.jpg`, 3072×2048).
- The game UI's "Command Console" design system (`../game/DESIGN.md`) is the parent identity the site must stay recognisably related to.

## Evidence on Hand

- Real: the manual text (`src/components/Manual/ManualSections.js`), the unit damage table (`src/components/Manual/Stats.astro`), the game screenshot `../docs/screenshots/overview.png`, game constants for buildings, research and units.
- Absent, must never be fabricated: player counts, testimonials, reviews, press, ratings, round dates, prizes.

## Product Principles

1. **Get them to the first tick.** Every page has a clear route to "Play now"; explanation serves the decision, not the other way round.
2. **The manual is a tool.** Rules content is scannable, linkable by section, and exact; numbers are shown as numbers, never rounded into adjectives.
3. **Honest, and selling the game.** Say what exists, never inflate it; copy makes people want to play (raids, rivals, land) rather than describing who made it.
4. **Same world as the game.** A visitor who clicks "Play now" should feel they arrived in the place the site promised.

## Accessibility & Inclusion

No product-specific requirement established beyond WCAG 2.2 AA as the default; the game's own system already targets AA contrast and full `prefers-reduced-motion` support, and the site should match.
