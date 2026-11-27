---
name: Earth Doom (site)
description: Marketing and manual site for Earth Doom, in the game's Command Console system with a spaceship-art front door
colors:
  signal-cyan: "#4cc3f2"
  signal-cyan-strong: "#86d8f8"
  signal-cyan-ink: "#05131d"
  hostile-coral: "#f68a8a"
  hostile-coral-strong: "#ef5f5f"
  friendly-green: "#5fd68f"
  caution-amber: "#f2c45a"
  credits-gold: "#f2c45a"
  titanium-silver: "#b9c6d6"
  energy-violet: "#a99cf6"
  ground: "#0a0f16"
  rail: "#0c1726"
  panel: "#111a26"
  raised: "#172231"
  sunken: "#0c131c"
  line: "#223044"
  line-strong: "#31435b"
  field-edge: "#66778d"
  ink: "#e7edf5"
  soft: "#c5d0dd"
  muted: "#9aa9bc"
typography:
  hero-display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.4rem + 4.6vw, 5rem)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 118"
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.5rem + 2vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 116"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.3rem + 0.8vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.15
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem)"
    fontWeight: 650
    lineHeight: 1.2
    fontVariation: "'wdth' 112"
  lede:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.6
  body-long:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "'tnum'"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum'"
  data:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    fontFeature: "'tnum'"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
  wordmark:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    letterSpacing: "0.18em"
    fontVariation: "'wdth' 125"
rounded:
  tick: "2px"
  md: "6px"
  lg: "8px"
  full: "9999px"
spacing:
  gutter: "16px"
  gutter-md: "32px"
  panel: "24px"
  step: "clamp(3.5rem, 3rem + 3vw, 6rem)"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.signal-cyan-ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.signal-cyan-strong}"
    textColor: "{colors.signal-cyan-ink}"
  button-primary-lg:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.signal-cyan-ink}"
    rounded: "{rounded.md}"
    padding: "0 28px"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.line}"
  button-ghost:
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.data}"
    padding: "0 12px"
    height: "40px"
  nav-link-active:
    textColor: "{colors.ink}"
    underline: "2px {colors.signal-cyan}"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  table-header:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    padding: "0 16px"
    height: "40px"
  badge:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  toc-link:
    textColor: "{colors.muted}"
    typography: "{typography.data}"
    padding: "6px 0 6px 16px"
  toc-link-active:
    textColor: "{colors.ink}"
---

# Design System: Earth Doom (site)

This file records the marketing register of earthdoom.com. It is an extension of the game's system in [`../game/DESIGN.md`](../game/DESIGN.md) ("The Command Console"), which stays the parent identity: the colour tokens, Archivo, the 6px/8px radii, the panel shadow, tinted state badges, resource dots and the table spec are the game's, carried over unchanged in `src/styles/global.css`. Read the parent for those rules; this file restates them only where the site applies them differently, and documents what the site adds.

**Styling convention.** Tailwind utilities in markup, nothing else. Components have no `<style>` blocks. `global.css` holds only the `@theme` tokens, a few base rules, the two scroll-timeline utilities (`arrive`, `tick-on`), view transitions and `.prose` (for HTML we don't write ourselves: markdown and manual content). When a class list repeats inside a component, store it in a frontmatter constant; when it repeats across components, make an Astro component.

## Overview

**Creative North Star: "The Console, Seen From Orbit"**

The site is the game's own console, opened up for someone who has not played yet. The same abyss-navy ground, hairlines, panel surfaces and Signal Cyan carry over, so a visitor who presses Play now lands somewhere that already looks familiar. What the marketing register adds is scale and one image: the spaceship artwork as a full-bleed hero, wide display headlines (116–118% width, up to 80px), and long-form reading measures for the manual and blog.

Persuasion is done with the game's real material, not with ornament. The home page explains the loop through miniatures of game screens built from real numbers: a building table with resource dots, a land-income bar set, a unit table, and a tick strip that shows an attack's travel and battle ticks. The hero is static on load; motion is quiet scroll-driven arrivals on those artefacts and the mobile menu, and nothing at all under reduced motion.

Density is lower than the game's: wider section rhythm, 17px reading text, larger buttons for the primary call to action. The tone is still calm and precise; excitement comes from the artwork and the copy (raids, rivals, taking land), never from glows, gradients on UI or decorative colour.

**Key Characteristics:**
- The game's tokens, unchanged; Signal Cyan is still the only accent and the only solid fill
- One raster world: the spaceship artwork, used for the hero and the closing call, always under a navy scrim or mask
- Display type set wide (Archivo `wdth` 116–125) with tight negative tracking at large sizes
- Real game data as the illustration: tables, land bars, tick strip
- No load animation; scroll arrivals on artefacts only; fully static under `prefers-reduced-motion`

## Colors

The game's palette, extended by one reading tone (Soft) for long-form and lede text.

### Primary
- **Signal Cyan** (`signal-cyan`): every Play now button, inline links in prose, the active nav underline, the active manual TOC rule, focus rings, text selection (30% tint) and the travel segments of the tick strip. Hover moves to **Signal Cyan Strong**; text on a cyan fill is **Signal Cyan Ink**.

### Secondary
- **Hostile Coral** (`hostile-coral`): state only. On the site it marks battle only (the battle badge and battle segments of the tick strip).
- **Friendly Green** (`friendly-green`): state only; the check icons beside the hero's three facts.
- **Caution Amber** (`caution-amber`): available as a tinted badge; unused on current pages.

### Tertiary
- **Credits Gold**, **Titanium Silver**, **Energy Violet**: resource identity only, as 8px dots before amounts and as the fills of the land-income bars. Energy is defined but not yet shown.

### Neutral
- **Abyss** (`ground`): page background, hero scrim colour, header (86% with blur).
- **Rail** (`rail`): footer band, mobile menu panel, and the header while the mobile menu is open.
- **Panel** (`panel`): panels, table wrappers, the closing-call card, the mobile TOC box, sticky row headers of the damage table.
- **Raised** (`raised`): table header rows, secondary buttons, ghost/hover fills, damage-table row hover, inline code.
- **Sunken** (`sunken`): wells inside panels (land-bar tracks, table legend strip, code blocks).
- **Line / Line Strong** (`line`, `line-strong`): hairlines everywhere; Line Strong for secondary-button borders, badge borders and the undeveloped-land bar.
- **Field Edge** (`field-edge`): resting arrow icons in the manual index, empty damage-table cells, secondary-button hover border.
- **Console White** (`ink`): headings, names, emphasis.
- **Soft** (`soft`): site addition. Ledes, step paragraphs, prose body and fact rows: one step below ink so long text is comfortable on the dark ground.
- **Muted** (`muted`): metadata, dates, captions, table headers, nav links at rest, the first line of the hero headline.

### Named Rules
**The One Signal Rule (inherited).** Signal Cyan is the only accent and the only solid fill. Emphasis that is not an action or the current location uses weight or Console White.

**The Tint, Don't Fill Rule (inherited).** Coral, green and amber appear only as state, on a 10% tint with a 40% border; tick-strip segments use the same tinted fill plus an inset hairline.

**The Two-Tone Headline Rule.** Large headlines may split into a Muted setup line and an Ink payoff line ("Build an army." / "Take their land."). Contrast between the lines comes from tone, never from cyan or a second hue.

## Typography

**Display Font:** Archivo (variable, weights 400–800, width axis 100–125, self-hosted through Astro's Fonts API; fallback `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Archivo
**Label/Mono Font:** Archivo; numbers use tabular figures site-wide (`font-variant-numeric: tabular-nums` on body)

**Character:** One family doing everything, as in the game. The width axis is the voice: headings run at 112% by default, marketing display at 116–118%, the wordmark at 125% with 0.18em tracking.

### Hierarchy
- **Hero Display** (750, `clamp(2.75rem → 5rem)`, line-height 1, -0.02em, width 118%): the home hero headline only, capped at 15ch.
- **Display** (700, `clamp(2rem → 3rem)`, 1.08, -0.015em, width 116%): page titles and home section titles ("How a game plays", "The manual", post titles, 404).
- **Headline** (700, `clamp(1.5rem → 2rem)`, 1.15): manual section headings.
- **Title** (650, `clamp(1.375rem → 1.75rem)`, 1.2): the step headings in the game-loop walkthrough.
- **Lede** (400, `clamp(1.0625rem → 1.25rem)`, 1.6, Soft, max 34rem): the hero paragraph; section intros use 18px (1.125rem) Soft.
- **Body Long** (400, 17px, 1.7, Soft, max 68ch): manual and blog prose, with prose H2 at 26px/650 and H3 at 20px/600.
- **Body** (400, 16px, 1.55): base text.
- **Data** (400, 14px): table cells, nav links, TOC links, figure captions.
- **Label** (500, 12px, sentence case): table headers, badges, legends, the TOC summary.
- **Wordmark** (700, 15px, 0.18em, width 125%, uppercase as typed: "EARTH DOOM"): the header and footer lockup beside the round E logo, never used for other text.

### Named Rules
**The Wide Heading Rule.** Every H1–H3 gets `font-stretch` 112% or wider and `text-wrap: balance`; paragraphs, list items and definitions get `text-wrap: pretty`.

**The Sentence-Case Label Rule.** Labels, table headers and badges are sentence case at 12px/500. There are no uppercase tracked labels and no small text set above headings.

**The Tabular Rule (inherited).** Numbers are tabular and shown as numbers (1,000, 30 ticks), right-aligned in tables.

## Layout

One container: `max-width` 80rem (1280px), side gutters 16px, 32px from 768px. Reading pages (blog index, posts, about, 404) use a 48rem (768px) column inside the same gutters; prose itself is capped at 68ch.

Vertical rhythm is generous and fluid: home sections are separated by 112px (`pt-28`), the game-loop section starts at `clamp(5rem → 8rem)`, and each loop step sits `clamp(3.5rem → 6rem)` below the last. Panels pad at 24px; the closing call pads at `clamp(2rem → 4.5rem)`.

- **Game-loop steps:** a two-column grid from 900px (copy 5fr, artefact 7fr, 4rem gap, vertically centred); stacked below with a 1.75rem gap. Copy never exceeds 34rem.
- **Manual:** a 15rem sticky TOC column plus the article from 1024px (4rem gap, TOC sticky at 6rem from the top). Below 1024px the TOC becomes a collapsible panel that starts closed on small screens.
- **Manual index (home):** a hairline-ruled list, one column, two from 640px, three from 1024px, 60px rows.
- **Hero:** height `min(100svh − 4rem, 52rem)`, copy vertically centred and left-aligned. Below 768px the copy drops to the bottom with 14rem of art showing above it.
- **Anchors:** `scroll-padding-top` and section `scroll-margin-top` of 5.5rem clear the 64px sticky header.

## Elevation & Depth

Tonal first, as in the parent: Abyss → Rail/Panel → Raised, with Sunken wells inside panels. The panel shadow (`--shadow-panel`) sits on every panel and table wrapper. The sticky header is the one translucent layer: 86% Abyss with a 12px blur, turning solid Rail while the mobile menu is open so page text never shows through. The mobile menu opens below the header with the parent's sheet shadow pointed downwards (`0 12px 32px -8px rgb(0 0 0 / 0.7)`) over a 60% black overlay that covers the page below the header.

The marketing register adds one depth device: **artwork behind a scrim**. The hero places the spaceship art under a navy gradient (94% → 86% → 35% → 10% from the copy side, plus a bottom fade into Abyss; on phones the gradient runs bottom-up). The closing call places the same art at 55% opacity inside a panel with a horizontal mask (30% and vertical on phones). This is the only place gradients appear.

### Shadow Vocabulary
- **Panel** (`--shadow-panel`, inherited): panels, table wrappers.
- **Sheet** (`0 12px 32px -8px rgb(0 0 0 / 0.7)`): the mobile menu only.

`--shadow-lift` is defined in the stylesheet but unused.

### Named Rules
**The Scrim Rule.** Text never sits directly on the artwork. Every use of the spaceship image has a solid-navy scrim or mask on the copy side strong enough for AA contrast, and the art stays a background layer (`z-index: -1/-2`, `alt=""` when decorative).

**The Tone Before Shadow Rule (inherited).** No coloured glows, no zero-blur offset shadows; gradients are limited to scrims and masks over artwork.

## Shapes

The parent's corners: 6px (`md`) for buttons, the menu toggle and the skip link; 8px (`lg`) for panels, the closing-call card, blockquotes, code blocks, post images and the mobile TOC box; full pills for badges and land bars; 2px for tick-strip segments; 4px for inline code. Hairline (1px Line) borders define every container and rule every list. The 8px resource dot is the only circle.

## Components

### Buttons
Character: the game's buttons, with one larger size for marketing calls to action.
- **Shape:** gently squared (6px), semibold, label and optional icon with an 8px gap.
- **Primary:** Signal Cyan fill, Signal Cyan Ink text; hover to Signal Cyan Strong. One per area.
- **Sizes:** `md` 40px tall, 16px padding, 14px text (header, manual TOC); `lg` 52px tall, 28px padding, 16px text (hero, closing call, about, 404, mobile menu).
- **Secondary:** Raised fill, Line Strong border, Ink text; hover to Line fill and Field Edge border. Pairs with a primary ("Read the manual").
- **Ghost:** Muted text, no fill; hover Raised fill and Ink text ("How to start" beside the closing Play now).
- **Motion:** 150ms colour transitions; pressed state moves down 1px.

### Badges (chips)
The parent's pill: Raised fill, Line Strong border, Muted 12px/500 text, 2px × 10px padding. Tinted variants for hostile, friendly, caution and accent. Used as legend keys (Travel, Battle); never as a label above a heading.

### Cards / Containers
- **Panel:** Panel fill, 1px Line border, 8px radius, panel shadow, 24px padding (or flush when wrapping a table). Every game-loop artefact and the damage table sits in one.
- **Closing call card:** a panel with the spaceship art masked in from the right and a Display headline plus primary and ghost buttons.

### Tables
The parent's table spec (`.data-table`): 40px Raised header row with 12px Muted labels, 12px × 16px cells, Line rules between rows, Ink semibold names with a 12px Muted note underneath, right-aligned tabular numbers. Amounts carry a resource dot; a Sunken legend strip under the table names the dots. The damage table adds sticky header row and sticky first column, Raised row hover, an en dash in Field Edge for empty cells, and sideways scrolling inside a focusable region.

### Navigation
- **Header:** sticky, 64px, translucent Abyss with blur and a Line bottom rule. Logo + wordmark left; nav links and a `md` Play now right. The home page leaves out the desktop nav links and Play now (the hero carries the call to action) but keeps the mobile menu, so the header is the same on every page on phones.
- **Nav links:** plain text, not buttons. 40px, 12px padding, 14px/500 Muted. Hover turns the text Ink and draws a 2px Ink underline that grows from the left (240ms, ease-out-expo). The current page is Ink at 600 with a full-width 2px Signal Cyan underline; on desktop that underline slides to the new link on page change (cross-document view transition, 320ms). Play now stays the only button in the header.
- **Mobile:** a 44px menu toggle opens a panel on Rail below the header, with 48px links and a full-width `lg` Play now. The header stays in place and the toggle's hamburger rotates into an X. Opening (280ms, ease-out-expo): the overlay fades in, the header turns solid, the panel unrolls down from the header edge, and the links rise 8px into place 30ms apart. Closing plays it in reverse: links leave last-first, then the panel rolls up and the overlay fades (about 300ms); the menu is hidden only once that finishes. It closes from the toggle, Esc (focus returns to the toggle), or a tap on the overlay, and closes instantly on page change or when the window widens to desktop. Animated with Motion via `createToggle()` in `src/scripts/animation.ts`.
- **Footer:** Rail band, wordmark with a one-line description, Muted links and a cyan text Play now; copyright in a hairline-separated strip.

### Spaceship Hero (signature)
Full-bleed `<picture>` (AVIF/WebP, 768–2560w) of the spaceship artwork, object-position 62% (40% on phones), under the navy scrim described in Elevation. Left-aligned copy column: Hero Display two-tone headline, lede, `lg` primary + secondary buttons, then a row of three plain facts, each with a 16px green check icon. Below 1024px the copy sits at the bottom of the band over a vertical solid scrim, so text never crosses the bright parts of the art. No entrance animation: art and copy are in place at first paint.

### Game-Loop Artefacts (signature)
Miniatures of game screens built from real game constants (`src/data/game.ts`), never invented values:
- **Building/unit tables** in the table spec.
- **Land bars:** 10px pill tracks in Sunken with an inset Line ring, filled in Line Strong (undeveloped), Titanium Silver and Credits Gold, with a label column and a 12px Muted note.
- **Tick strip:** one 2px-radius segment per tick (35 columns, 3px gap; 2px gap and 32px tall under 520px), cyan-tinted for travel and coral-tinted for battle, with badge legends and tick counts. When scroll timelines are supported, segments fill in one by one as the panel scrolls through view (each offset 0.8% of the range, all complete by about the middle of the viewport, from 15% opacity and 40% height). The strip's panel has no `.arrive` of its own, so only one effect runs on it.

### Manual TOC with Scroll-Spy (signature)
A left-ruled ordered list (1px Line rail). Links are 14px Muted with a 2px transparent left border; the section being read (IntersectionObserver, root margin −20% / −70%) gets `aria-current`, an Ink 600 label and a Signal Cyan left border. Sticky on desktop with a `md` Play now beneath; a collapsible panel on smaller screens.

### Manual Index (home)
Hairline-ruled list of manual sections, 60px rows of Ink 500 text with a Field Edge arrow; on hover the text turns Signal Cyan Strong and the arrow turns cyan and slides 4px right (200ms ease-out-expo).

### Motion
- Easing: `--ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`) for the mobile menu, nav underlines and view transitions (`EASE_OUT_EXPO` in `src/scripts/animation.ts` mirrors it for Motion); 150ms ease-out for hover colour.
- **Mobile menu:** animated with Motion (JavaScript), not CSS, so the close animation always finishes before the menu is hidden. See Navigation.
- **Scroll arrivals** (`.arrive`): artefacts only (the economy, land and unit panels and the manual index) fade up 18px from a 6px blur over the first 55% of their entry, driven by `animation-timeline: view()`. Content is visible by default; browsers without scroll timelines show it static.
- **Page changes:** cross-document view transitions cross-fade in 220ms.
- **Reduced motion:** every CSS animation and transition collapses to 0.01ms and view transitions are switched off. The mobile menu opens and closes instantly (`createToggle()` uses zero duration).

## Do's and Don'ts

### Do:
- **Do** take every colour, radius, shadow and table rule from the parent tokens in `global.css`; add a site token only when the game has no equivalent (as with Soft).
- **Do** use the spaceship artwork (`src/assets/spaceship.jpg`, existing project art carried over from the old site) as the only photographic/illustrative raster, always under a navy scrim or mask.
- **Do** illustrate the game with real game data in game-styled panels: tables with resource dots, land bars, the tick strip.
- **Do** set headings wide (112%+, 116–118% for display) with balanced wrapping, and keep labels sentence case at 12px/500.
- **Do** give every page a clear route to Play now (`https://game.earthdoom.com/login`) in Signal Cyan, one primary per area.
- **Do** keep motion to scroll arrivals on artefacts and the mobile menu (no load animation on the hero), and keep everything readable and static under reduced motion.
- **Do** write copy that sells the game: raids, rivals, taking land from real players.

### Don't:
- **Don't** introduce a second accent, colour glows or gradients on UI; gradients exist only as scrims and masks over the artwork.
- **Don't** put small uppercase or tracked labels (kickers, eyebrows) above headings.
- **Don't** lead marketing copy with tick timing; explain ticks inside the loop walkthrough and manual.
- **Don't** mention the developer in site copy.
- **Don't** show fabricated stats, player counts, ratings, testimonials, press or round dates; sample data is labelled as a sample.
- **Don't** use coral, green or amber for anything but state, or resource colours for anything but resources.
- **Don't** replace the round E logo (`src/assets/logo.png`, existing project art) or set the EARTH DOOM wordmark in anything but Archivo 700 at 125% width.
