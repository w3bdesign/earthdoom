// Site-wide constants.

export const SITE_TITLE = "Earth Doom";
export const SITE_DESCRIPTION =
  "Earth Doom is a free strategy game of raids and rivals, played in your browser. Build an economy, raise an army and take land from real players.";

/** Where "Play now" goes. */
export const PLAY_URL = "https://game.earthdoom.com/login";

/** Seconds between game ticks (the manual says "every sixty seconds or so"). */
export const TICK_SECONDS = 60;

/** Main navigation. The blog is reachable but not promoted while it has no posts in use. */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/manual/", label: "Manual" },
] as const;
