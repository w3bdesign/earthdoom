---
name: Earth Doom
description: Dark command console for a tick-based browser strategy game
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
  muted: "#9aa9bc"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
  body:
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
    fontSize: "0.875rem"
    fontWeight: 700
    letterSpacing: "0.18em"
    fontVariation: "'wdth' 125"
rounded:
  md: "6px"
  lg: "8px"
  sheet: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.signal-cyan-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.signal-cyan-strong}"
    textColor: "{colors.signal-cyan-ink}"
  button-secondary:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.line}"
  button-danger:
    textColor: "{colors.hostile-coral}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-small:
    padding: "0 12px"
    height: "32px"
  input:
    backgroundColor: "{colors.sunken}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  table-header:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    height: "40px"
  badge:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  action-status:
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
    width: "128px"
  nav-item:
    textColor: "{colors.muted}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
  nav-item-active:
    textColor: "{colors.ink}"
---

# Design System: Earth Doom

## Overview

**Creative North Star: "The Command Console"**

Earth Doom is played in short, frequent visits: check resources, see what's incoming, queue a building, send a fleet, leave. The interface is a calm operations screen built for that glance-act-leave loop. Everything sits on near-black blue surfaces, numbers are tabular and right-aligned, and the page structure repeats on every screen (resource bar, alerts, page header, panels or tables) so a player always knows where to look.

The mood is calm, precise and tactical. Restraint is the default; colour is reserved for meaning. Signal Cyan marks what you can act on, coral marks danger, green marks help or completion, amber marks time in progress, and the three resource colours identify credits, titanium and energy wherever they appear. Nothing is decorative: no gradients, no glows, no illustration. The world's atmosphere comes from the dark navy palette, the slightly wide Archivo headings and the density of the data, not from ornament.

This is an Operate surface. Familiar patterns (sidebar, tab bar, tables, segmented controls) are used deliberately; expression lives in precise details such as the resource dots, the shared action-column width and the tinted status boxes.

**Key Characteristics:**
- Dark, tonal navy surfaces in five steps; depth comes from tone first, shadow second
- One accent (Signal Cyan) for action and current state; semantic colours only for state
- Archivo throughout, with headings widened to 112% and tabular numerals everywhere
- Real tables at every width; on small screens secondary columns fold under the name
- Same page skeleton on every screen: resource bar, alert stack, page header, content

## Colors

A low-light navy palette with one cool accent and a small, strict set of semantic and resource colours.

### Primary
- **Signal Cyan** (`signal-cyan`): primary buttons, the active navigation item's tint and icon, links, the unread-mail badge, focus rings and text selection. It means "this is actionable" or "you are here". Its hover/pressed step is **Signal Cyan Bright** (`signal-cyan-strong`), and text on it is **Deep Signal Ink** (`signal-cyan-ink`).

### Secondary
- **Hostile Coral** (`hostile-coral`): incoming attacks, attack actions, danger buttons, delete, affordability shortfalls ("Need 1,200 more credits"). Always tinted (10% fill, 40% border) behind coral text, never as a solid fill.
- **Friendly Green** (`friendly-green`): defending fleets, defend actions, "Done" status, protection.
- **Caution Amber** (`caution-amber`): time in progress ("5 ticks left", "In progress").

### Tertiary
- **Credits Gold** (`credits-gold`), **Titanium Silver** (`titanium-silver`), **Energy Violet** (`energy-violet`): resource identity. Used as small 8px dots next to resource labels and costs, and as bar colours in the income chart. They are labels, not states.

### Neutral
- **Abyss** (`ground`): page background.
- **Rail Navy** (`rail`): sidebar, mobile header and tab bar.
- **Panel Navy** (`panel`): panels, tables, sheets.
- **Raised Navy** (`raised`): table headers, secondary buttons, segmented control selection, neutral badges.
- **Sunken Navy** (`sunken`): inputs and inset summaries (wells inside a panel).
- **Hairline** (`line`): dividers and panel borders. **Strong Hairline** (`line-strong`): button and badge outlines, scrollbar thumb.
- **Field Edge** (`field-edge`): form-control borders only; 3.8:1 against panel so fields stay visible.
- **Console White** (`ink`): primary text (14.9:1 on panel).
- **Slate Mist** (`muted`): secondary text, labels, table headers (7.3:1 on panel).

### Named Rules
**The Meaning-Only Colour Rule.** Coral, green and amber appear only when they describe state (hostile, friendly/done, in progress). Never use them for decoration or emphasis.

**The One Signal Rule.** Signal Cyan is the only accent. If something needs emphasis and isn't an action or the current location, use weight or Console White, not cyan.

**The Tint, Don't Fill Rule.** Semantic colours sit on a 10% tint of themselves with a 35–40% border. Only Signal Cyan is used as a solid fill.

## Typography

**Display Font:** Archivo (variable, with ui-sans-serif, system-ui fallback), loaded through `next/font` with the `wdth` axis
**Body Font:** Archivo
**Label/Mono Font:** none; numbers use Archivo's tabular figures

**Character:** One family, two widths. Headings are widened to 112% (`font-stretch`), which gives them a squared, instrument-panel feel; body text stays at normal width for density and legibility. Tabular numerals are on for the whole document so resource figures line up.

### Hierarchy
- **Display** (600, 1.5rem mobile / 1.75rem desktop, 112% width): page titles in the page header. One per page.
- **Headline** (600, 1rem, 112% width): panel titles. Often followed by a muted meta count ("648 total").
- **Title** (600, 0.875rem): buttons, primary table cells (item names), list item headings, nav items (500).
- **Body** (400, 0.875rem): descriptions, alert text, table cells, form values. Descriptions are capped at `max-w-prose` (65ch).
- **Label** (500, 0.75rem, Slate Mist): table headers, field hints, resource labels, sub-group headings, badges.
- **Wordmark** (700, 0.875rem, uppercase, 0.18em tracking, 125% width): "EARTH DOOM" in the sidebar and mobile header only.

### Named Rules
**The Tabular Rule.** Every number is set in tabular figures and formatted with thousands separators (`formatNumber`); on phones the resource bar switches to compact notation (`48.3K`) from 10,000 up.

**The Balanced Heading Rule.** Headings use `text-wrap: balance`; paragraphs and list items use `text-wrap: pretty` so no line ends with a single orphaned word.

## Layout

- **Shell:** a fixed left sidebar on desktop (240px, ≥1024px), collapsed to a 64px icon rail on tablet (768–1023px), replaced on phones by a 48px top header plus a 64px bottom tab bar (Overview, Build, Military, Mail, More). "More" opens a bottom sheet with every page in its group.
- **Content:** centred column, max width 72rem (`max-w-6xl`), 16px side padding on phones, 32px from 768px. A sticky resource bar sits at the top of the content; fleet alerts stack directly beneath it.
- **Page rhythm:** page header (title + one-line description + page actions on the right), 24px gap, then content. Panels in a grid separate by 16px.
- **Grids:** Overview uses two columns from 1024px with full-width rows for "In progress" and "Forces". Military uses a main column plus a 22rem side column.
- **Tables:** real `<table>` at every width. Below 640px the Cost column folds under the name, below 768px ETA (and Ranking's score/size) folds under it, below 1024px the description is clamped to two lines under it.
- **Spacing scale:** 4, 8, 12, 16, 24, 32px. Table cells use 12px horizontal padding (16px from 1024px) and 12px vertical.

## Elevation & Depth

Depth is tonal first: Abyss → Rail/Panel → Raised as the content comes forward, with Sunken for wells that sit inside a panel. Shadows are soft and used for two things only: separating panels from the page, and lifting the mobile sheet above everything.

### Shadow Vocabulary
- **Panel** (`box-shadow: 0 1px 0 0 rgb(255 255 255 / 0.03) inset, 0 8px 24px -12px rgb(0 0 0 / 0.6)`): every panel and table wrapper. The faint inset top highlight reads as a bevel on the dark ground.
- **Sheet** (`box-shadow: 0 -12px 32px -8px rgb(0 0 0 / 0.7)`): the mobile "More" sheet, above a 60% black scrim.

### Named Rules
**The Tone Before Shadow Rule.** Separate layers with the surface steps and hairlines before reaching for a shadow. No coloured glows, no zero-blur offset shadows.

## Shapes

Gently rounded, never pill-shaped except for small status labels.
- **Controls** (buttons, inputs, nav items, action statuses): 6px radius.
- **Containers** (panels, tables, alerts, segmented control track): 8px radius, 1px Hairline border.
- **Badges** and the unread count: fully rounded.
- **Mobile sheet:** 16px top corners.
- Borders are always full (all four sides). There are no one-sided accent bars.

## Components

### Buttons
Confident and compact; one primary per area.
- **Shape:** 6px radius, 40px tall (32px small), 16px side padding (12px small), semibold 14px, no wrapping.
- **Primary:** Signal Cyan fill with Deep Signal Ink text; hover/focus brightens to Signal Cyan Bright.
- **Secondary:** Raised Navy with a Strong Hairline border and Console White text; hover darkens to Hairline.
- **Danger:** coral tint (10%) with a coral border (40%) and coral text; hover deepens the tint to 20%. Used for Launch attack, Leave alliance, Delete all.
- **Ghost:** text only in Slate Mist, Raised Navy on hover.
- **Disabled:** 50% opacity and a not-allowed cursor; the reason is shown as text, not only a tooltip.
- **Focus:** 2px Signal Cyan outline with 2px offset (global).

### Action Status
The signature pattern of the build tables: a status shown in place of the action button, at the same size and position.
- **Shape:** same as a medium button (40px tall, 6px radius) with a shared minimum width of 128px, so the Action column lines up whether a row shows a button or a status.
- **Done:** Friendly Green tint with a check icon. **In progress:** Caution Amber tint with an hourglass icon and "N ticks left".
- Not interactive.

### Badges (chips)
- **Style:** fully rounded, 12px medium text, 2px × 8px padding, tinted fill with a matching border (neutral, accent, hostile, friendly, caution tones).
- **Use:** short states next to content ("Home", "New", "Commander", "Online", "3 ticks").

### Cards / Containers (Panels)
- **Corner Style:** 8px.
- **Background:** Panel Navy with a Hairline border and the Panel shadow.
- **Header:** optional title row (Headline + muted meta + actions on the right) separated by a Hairline.
- **Internal Padding:** 16px; `flush` panels drop the padding for edge-to-edge lists and tables.
- Panels never nest inside other panels.

### Tables
- **Wrapper:** Panel styling with overflow hidden.
- **Header:** Raised Navy row, 40px, 12px medium Slate Mist labels.
- **Rows:** Hairline dividers, 12px vertical padding; numbers right-aligned; the item name is the semibold primary cell; the current player's row is highlighted with a 10% Signal Cyan tint.
- **Costs:** a coloured resource dot before each amount; an amount the player can't afford turns coral.

### Inputs / Fields
- **Style:** 40px, Sunken Navy fill, 1px Field Edge border, 6px radius, 12px side padding, Slate Mist placeholder.
- **Focus:** border turns Signal Cyan with a 2px 30% cyan ring.
- **Field:** label above (14px medium, Console White), optional hint below (12px Slate Mist).
- **Number inputs:** spinners hidden; quantity inputs pair with a small "Max" text button in Signal Cyan.

### Alerts
- **Style:** full 1px tinted border, 10% tint fill, 8px radius, leading 20px icon, bold title plus body text, optional action link on the right.
- **Tones:** hostile (shield alert, `role="alert"`), friendly (shield check), caution (triangle), info (circle).

### Navigation
- **Sidebar items:** 40px rows, 6px radius, 18px Lucide icon + 14px medium label in Slate Mist; hover adds a 5% white tint and Console White text; the current page gets a 15% Signal Cyan tint, Console White text and a cyan icon (`aria-current="page"`).
- **Groups:** Empire, Military, Community, then Manual and Log out pinned to the bottom, with 12px Slate Mist group labels.
- **Mobile tab bar:** Rail Navy at 95% with a backdrop blur, icon above a small label, active tab in Signal Cyan, unread mail as a small cyan count.

### Resource Bar
A sticky strip at the top of every signed-in page: Credits, Titanium, Energy, Land and Rank as label-over-value pairs with resource dots, full numbers on desktop and compact numbers on phones, plus a "Protected · N ticks" pill while the player has newbie protection.

## Do's and Don'ts

### Do:
- **Do** start every page with the shared header: title, one-line description, actions on the right.
- **Do** put state colour on a tint with a full border (10% fill, 35–40% border), and pair it with an icon or text so colour is never the only signal.
- **Do** keep every action and status in a table's Action column at the shared 128px minimum width.
- **Do** explain why an action is unavailable in visible text next to the control ("Need 2,500 more credits"), linked with `aria-describedby`.
- **Do** format numbers with `formatNumber` and right-align them in tables.
- **Do** use Lucide icons (`react-icons/lu`) at 16–18px, one stroke weight.
- **Do** keep form-control borders on Field Edge so they stay at least 3:1 against panels.

### Don't:
- **Don't** add a second accent colour or use coral, green or amber for decoration.
- **Don't** use emoji or Unicode glyphs as icons.
- **Don't** use one-sided border bars on panels, alerts or rows.
- **Don't** use gradients, coloured glows or hard offset shadows.
- **Don't** nest panels inside panels, or turn tables into card stacks on mobile; fold columns under the name instead.
- **Don't** show other players' private state (such as newbie protection) on public lists.
- **Don't** use light surfaces (white tables, grey buttons) anywhere in the game UI.
