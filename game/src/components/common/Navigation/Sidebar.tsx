import Link from "next/link";
import { useRouter } from "next/router";

import { LINKS, LINK_GROUPS } from "../Header/constants/LINKS";
import NavLink from "./NavLink";
import { isActive } from "./isActive";

/** Desktop navigation: a full sidebar from 1024px, an icon rail from 768px. */
const Sidebar = ({ unreadMail = 0 }: { unreadMail?: number }) => {
  const { pathname } = useRouter();
  const account = LINKS.filter((link) => link.group === "account");

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col border-r border-line bg-rail md:flex lg:w-60">
      <Link
        href="/"
        className="flex h-14 items-center gap-2 border-b border-line px-4 md:justify-center lg:justify-start"
      >
        <span
          aria-hidden
          className="grid h-7 w-7 place-items-center rounded-sm bg-accent text-sm font-bold text-accent-ink"
        >
          E
        </span>
        <span className="text-sm font-bold tracking-[0.18em] text-ink uppercase font-stretch-125% md:sr-only lg:not-sr-only">
          Earth Doom
        </span>
      </Link>
      <nav
        aria-label="Main"
        className="flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-4 lg:px-3"
      >
        {LINK_GROUPS.map((group) => (
          <div key={group.id} role="group" aria-labelledby={`nav-${group.id}`}>
            <h2
              id={`nav-${group.id}`}
              className="mb-1 px-3 text-xs font-medium text-muted md:sr-only lg:not-sr-only"
            >
              {group.label}
            </h2>
            <ul className="flex flex-col gap-0.5">
              {LINKS.filter((link) => link.group === group.id).map((link) => (
                <li key={link.id}>
                  <NavLink
                    link={link}
                    active={isActive(link.href, pathname)}
                    count={link.href === "/mail" ? unreadMail : 0}
                    collapsible
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <ul className="mt-auto flex flex-col gap-0.5 border-t border-line pt-3">
          {account.map((link) => (
            <li key={link.id}>
              <NavLink
                link={link}
                active={isActive(link.href, pathname)}
                collapsible
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
