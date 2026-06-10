import type { PaUsers, PaConstruct } from "@prisma/client";
import type { PaPlayer } from "@/types/player";

/**
 * Creates a complete mock PaUsers object with sensible defaults.
 * Use overrides to customize specific fields for your test case.
 */
export const createMockPaUser = (
  overrides: Partial<PaUsers> = {},
): PaUsers => ({
  id: 1,
  nick: "TestPlayer",
  crystal: 5000,
  metal: 3000,
  energy: 1000,
  r_energy: 0,
  sats: 0,
  infinitys: 0,
  wraiths: 0,
  warfrigs: 0,
  destroyers: 0,
  scorpions: 0,
  astropods: 0,
  cobras: 0,
  infinitys_base: 0,
  wraiths_base: 0,
  warfrigs_base: 0,
  destroyers_base: 0,
  scorpions_base: 0,
  astropods_base: 0,
  cobras_base: 0,
  p_scorpions: 0,
  p_scorpions_eta: 0,
  p_cobras: 0,
  p_cobras_eta: 0,
  missiles: 0,
  score: 100,
  asteroids: 10,
  asteroid_crystal: 5,
  asteroid_metal: 5,
  ui_roids: 3,
  war: 0,
  def: 0,
  wareta: 0,
  defeta: 0,
  r_imcrystal: 0,
  r_immetal: 0,
  r_iafs: 0,
  r_aaircraft: 0,
  r_tbeam: 0,
  r_uscan: 0,
  r_oscan: 0,
  p_infinitys: 0,
  p_infinitys_eta: 0,
  p_wraiths: 0,
  p_wraiths_eta: 0,
  p_warfrigs: 0,
  p_warfrigs_eta: 0,
  p_destroyers: 0,
  p_destroyers_eta: 0,
  p_missiles: 0,
  p_missiles_eta: 0,
  timer: 0,
  size: 10,
  p_astropods: 0,
  p_astropods_eta: 0,
  tag: "",
  rank: 1,
  rcannons: 0,
  p_rcannons: 0,
  p_rcannons_eta: 0,
  avengers: 0,
  p_avengers: 0,
  p_avengers_eta: 0,
  lstalkers: 0,
  p_lstalkers: 0,
  p_lstalkers_eta: 0,
  r_odg: 0,
  sleep: 0,
  lastsleep: 0,
  closed: 0,
  x: 1,
  y: 1,
  commander: 0,
  galname: "No name",
  galpic: "125x125earthdoom1.gif",
  motd: 0,
  vote: "",
  civilians: 1000,
  tax: 20,
  credits: 5000,
  newbie: 100,
  paConstructId: null,
  ...overrides,
});

/**
 * Creates a complete mock PaConstruct object with all fields zeroed.
 * Use overrides to customize specific fields for your test case.
 */
export const createMockConstruct = (
  overrides: Partial<PaConstruct> = {},
): PaConstruct => ({
  id: 1,
  c_crystal: 0,
  c_metal: 0,
  c_airport: 0,
  c_abase: 0,
  c_wstation: 0,
  c_amp1: 0,
  c_amp2: 0,
  c_warfactory: 0,
  c_destfact: 0,
  c_scorpfact: 0,
  c_energy: 0,
  c_odg: 0,
  ...overrides,
});

/**
 * Creates a mock PaUsers with an attached construction object.
 * Useful for tests that need the full player-with-construction shape.
 */
export const createMockPlayerWithConstruction = (
  userOverrides: Partial<PaUsers> = {},
  constructOverrides: Partial<PaConstruct> = {},
): PaUsers & { construction: PaConstruct } => ({
  ...createMockPaUser(userOverrides),
  construction: createMockConstruct(constructOverrides),
});

/**
 * Creates a complete mock PaPlayer object (PaUsers + PaConstruct fields).
 * Use for components that require the full PaPlayer/PaUserWithConstruct type.
 */
export const createMockPaPlayer = (
  overrides: Partial<PaPlayer> = {},
): PaPlayer => ({
  ...createMockPaUser(),
  c_crystal: 0,
  c_metal: 0,
  c_airport: 0,
  c_abase: 0,
  c_wstation: 0,
  c_amp1: 0,
  c_amp2: 0,
  c_warfactory: 0,
  c_destfact: 0,
  c_scorpfact: 0,
  c_energy: 0,
  c_odg: 0,
  ...overrides,
});
