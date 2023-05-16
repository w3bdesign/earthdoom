interface ILinks {
  id: number;
  href: string;
  text: string;
  target?: string;
}
export const LINKS: ILinks[] = [
  {
    id: 0,
    href: "/",
    text: "Main",
  },
  {
    id: 1,
    href: "https://earthdoom.com/manual",
    text: "Manual",
    target: "_new",
  },
  {
    id: 2,
    href: "/news",
    text: "News",
  },
  /*{
    id: 3,
    href: "/contnews",
    text: "Continent News",
  },*/

  /*
  {
    id: 4,
    href: "/mail",
    text: "Mail",
  },*/

  {
    id: 5,
    href: "/production",
    text: "Production",
  },
  {
    id: 6,
    href: "/construct",
    text: "Construct",
  },
  {
    id: 7,
    href: "/research",
    text: "Research",
  },
  {
    id: 8,
    href: "/energy",
    text: "Energy",
  },
  {
    id: 9,
    href: "/resources",
    text: "Resources",
  },
  {
    id: 10,
    href: "/military",
    text: "Military",
  },
  {
    id: 11,
    href: "/spying",
    text: "Spying",
  },
  {
    id: 12,
    href: "/ranking",
    text: "Ranking",
  },
  {
    id: 13,
    href: "/alliance",
    text: "Alliance",
  },
  /*{
    id: 14,
    href: "/country",
    text: "Country",
  },*/
  {
    id: 15,
    href: "/logout",
    text: "Logout",
  },
];
