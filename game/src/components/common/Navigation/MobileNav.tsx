import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuEllipsis, LuX } from "react-icons/lu";

import {
  LINKS,
  LINK_GROUPS,
  TAB_BAR_HREFS,
  TAB_BAR_LABELS,
} from "../Header/constants/LINKS";
import NavLink from "./NavLink";
import { isActive } from "./isActive";

/** Phone navigation: a bottom tab bar plus a "More" sheet with every page. */
const MobileNav = ({ unreadMail = 0 }: { unreadMail?: number }) => {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);

  const tabs = TAB_BAR_HREFS.map((href) =>
    LINKS.find((link) => link.href === href),
  ).filter((link) => link !== undefined);
  const moreActive =
    !open && !TAB_BAR_HREFS.some((href) => isActive(href, pathname));

  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    moreRef.current?.focus();
  };

  const tabClass = (active: boolean) =>
    `relative flex flex-1 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium ${
      active ? "text-accent" : "text-muted"
    }`;

  return (
    <div className="md:hidden">
      {open && (
        <>
          <div
            aria-hidden
            className="fixed inset-0 z-40 bg-black/60"
            onClick={close}
          />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="All pages"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-line-strong bg-panel px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-sheet"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold">All pages</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-md text-muted hover:bg-white/5 hover:text-ink"
              >
                <LuX aria-hidden className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="All pages" className="flex flex-col gap-4">
              {[
                ...LINK_GROUPS,
                { id: "account" as const, label: "Account" },
              ].map((group) => (
                <div key={group.id}>
                  <h3 className="mb-1 px-3 text-xs font-medium text-muted">
                    {group.label}
                  </h3>
                  <ul className="grid grid-cols-2 gap-1">
                    {LINKS.filter((link) => link.group === group.id).map(
                      (link) => (
                        <li key={link.id}>
                          <NavLink
                            link={link}
                            active={isActive(link.href, pathname)}
                            count={link.href === "/mail" ? unreadMail : 0}
                            onNavigate={() => setOpen(false)}
                          />
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </>
      )}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 flex h-16 border-t border-line bg-rail/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm"
      >
        {tabs.map((link) => {
          const active = isActive(link.href, pathname);
          const Icon = link.icon;
          const count = link.href === "/mail" ? unreadMail : 0;
          return (
            <Link
              key={link.id}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={tabClass(active)}
            >
              <span className="relative">
                <Icon aria-hidden className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4.5 rounded-full bg-accent px-1 text-center text-[0.625rem] leading-4.5 font-bold text-accent-ink">
                    {count}
                    <span className="sr-only"> unread</span>
                  </span>
                )}
              </span>
              {TAB_BAR_LABELS[link.href]}
            </Link>
          );
        })}
        <button
          ref={moreRef}
          type="button"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((value) => !value)}
          className={tabClass(open || moreActive)}
        >
          <LuEllipsis aria-hidden className="h-5 w-5" />
          More
        </button>
      </nav>
    </div>
  );
};

export default MobileNav;
