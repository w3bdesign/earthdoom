/** True when the link points at the current page. */
export const isActive = (href: string, pathname: string | undefined) =>
  href === "/" ? pathname === "/" : !!pathname?.startsWith(href);
