import Link from "next/link";

import type { ILinks } from "../Header/constants/LINKS";

interface NavLinkProps {
  link: ILinks;
  active: boolean;
  /** Unread count shown as a badge */
  count?: number;
  /** Icon-only on medium screens (collapsed sidebar) */
  collapsible?: boolean;
  onNavigate?: () => void;
}

/** A sidebar or sheet link with an icon, the current-page state and an optional count. */
const NavLink = ({
  link,
  active,
  count = 0,
  collapsible = false,
  onNavigate,
}: NavLinkProps) => {
  const { href, text, target, icon: Icon } = link;
  const label = count > 0 ? `${text}, ${count} unread` : text;
  const hide = collapsible ? "md:sr-only lg:not-sr-only" : "";

  return (
    <Link
      href={href}
      target={target}
      rel={target ? "noopener noreferrer" : undefined}
      aria-current={active ? "page" : undefined}
      aria-label={collapsible ? label : undefined}
      title={collapsible ? text : undefined}
      onClick={onNavigate}
      className={`group relative flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${
        collapsible ? "md:justify-center md:px-0 lg:justify-start lg:px-3" : ""
      } ${
        active
          ? "bg-accent/15 text-ink"
          : "text-muted hover:bg-white/5 hover:text-ink"
      }`}
    >
      <Icon
        aria-hidden
        className={`h-4.5 w-4.5 shrink-0 ${active ? "text-accent" : ""}`}
      />
      <span className={`flex-1 truncate ${hide}`}>{text}</span>
      {count > 0 && (
        <span
          aria-hidden={collapsible || undefined}
          className={`rounded-full bg-accent px-1.5 text-xs leading-5 font-semibold text-accent-ink ${
            collapsible
              ? "md:absolute md:top-1 md:right-1.5 md:h-2 md:w-2 md:p-0 md:text-[0] lg:static lg:h-auto lg:w-auto lg:px-1.5 lg:text-xs"
              : ""
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
};

export default NavLink;
