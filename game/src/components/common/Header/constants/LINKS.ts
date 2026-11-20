import type { IconType } from "react-icons";
import {
  LuLayoutDashboard,
  LuPickaxe,
  LuHammer,
  LuFlaskConical,
  LuZap,
  LuFactory,
  LuSwords,
  LuRadar,
  LuNewspaper,
  LuMail,
  LuTrophy,
  LuUsers,
  LuBookOpen,
  LuLogOut,
} from "react-icons/lu";

export type LinkGroup = "empire" | "military" | "community" | "account";

export interface ILinks {
  id: number;
  href: string;
  text: string;
  group: LinkGroup;
  icon: IconType;
  target?: string;
}

export const LINK_GROUPS: { id: LinkGroup; label: string }[] = [
  { id: "empire", label: "Empire" },
  { id: "military", label: "Military" },
  { id: "community", label: "Community" },
];

export const LINKS: ILinks[] = [
  {
    id: 0,
    href: "/",
    text: "Overview",
    group: "empire",
    icon: LuLayoutDashboard,
  },
  {
    id: 9,
    href: "/resources",
    text: "Resources",
    group: "empire",
    icon: LuPickaxe,
  },
  {
    id: 6,
    href: "/construct",
    text: "Construct",
    group: "empire",
    icon: LuHammer,
  },
  {
    id: 7,
    href: "/research",
    text: "Research",
    group: "empire",
    icon: LuFlaskConical,
  },
  { id: 8, href: "/energy", text: "Energy", group: "empire", icon: LuZap },
  {
    id: 5,
    href: "/production",
    text: "Production",
    group: "military",
    icon: LuFactory,
  },
  {
    id: 10,
    href: "/military",
    text: "Military",
    group: "military",
    icon: LuSwords,
  },
  { id: 11, href: "/spying", text: "Spying", group: "military", icon: LuRadar },
  { id: 2, href: "/news", text: "News", group: "community", icon: LuNewspaper },
  { id: 4, href: "/mail", text: "Mail", group: "community", icon: LuMail },
  {
    id: 12,
    href: "/ranking",
    text: "Ranking",
    group: "community",
    icon: LuTrophy,
  },
  {
    id: 13,
    href: "/alliance",
    text: "Alliance",
    group: "community",
    icon: LuUsers,
  },
  // Hidden until implemented: 3 /contnews "Continent News", 14 /country "Country"
  {
    id: 1,
    href: "https://earthdoom.com/manual",
    text: "Manual",
    group: "account",
    icon: LuBookOpen,
    target: "_blank",
  },
  {
    id: 15,
    href: "/logout",
    text: "Log out",
    group: "account",
    icon: LuLogOut,
  },
];

/** The links shown in the mobile tab bar, in order. Everything else is under "More". */
export const TAB_BAR_HREFS = ["/", "/construct", "/military", "/mail"];

/** Short labels for the mobile tab bar. */
export const TAB_BAR_LABELS: Record<string, string> = {
  "/": "Overview",
  "/construct": "Build",
  "/military": "Military",
  "/mail": "Mail",
};
