// Site-wide constants.

export const SITE_TITLE = "Earth Doom";
export const SITE_DESCRIPTION =
  "Earth Doom is an epic war game that plunges you into a relentless fight for survival and dominance. Gain critical resources, research powerful technologies, and conquer enemy lands - all while defending against those who would conquer you.";

/** Where "Play now" goes. */
export const PLAY_URL = "https://game.earthdoom.com/login";

/** Seconds between game ticks (the manual says "every sixty seconds or so"). */
export const TICK_SECONDS = 60;

/** Main navigation. The blog is reachable but not promoted while it has no posts in use. */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/manual/", label: "Manual" },
] as const;
