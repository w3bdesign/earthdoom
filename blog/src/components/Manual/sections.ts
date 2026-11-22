import { MANUAL_SECTIONS } from "./ManualSections";

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Manual sections with stable anchor ids (used by /manual and the home page). */
export const SECTIONS = MANUAL_SECTIONS.map((section) => ({
  ...section,
  id: slugify(section.title),
}));
