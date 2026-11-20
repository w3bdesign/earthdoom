import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";

import MobileNav from "../../../../components/common/Navigation/MobileNav";

const mockPathname = { current: "/" };
jest.mock("next/router", () => ({
  useRouter: () => ({ pathname: mockPathname.current }),
}));

const tabBar = () => screen.getByRole("navigation", { name: "Primary" });
const more = () => screen.getByRole("button", { name: "More" });

describe("MobileNav", () => {
  beforeEach(() => {
    mockPathname.current = "/";
  });

  it("renders the four tabs and a More button", () => {
    render(<MobileNav />);
    const links = within(tabBar()).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Overview",
      "Build",
      "Military",
      "Mail",
    ]);
    expect(more()).toHaveAttribute("aria-expanded", "false");
  });

  it("marks the current tab", () => {
    mockPathname.current = "/military";
    render(<MobileNav />);
    expect(
      within(tabBar()).getByRole("link", { name: "Military" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("highlights More on pages that have no tab", () => {
    mockPathname.current = "/ranking";
    render(<MobileNav />);
    expect(more().className).toContain("text-accent");
  });

  it("shows unread mail on the Mail tab", () => {
    render(<MobileNav unreadMail={2} />);
    expect(
      within(tabBar()).getByRole("link", { name: /Mail/ }),
    ).toHaveTextContent("2 unread");
  });

  it("opens a sheet with every page and focuses it", () => {
    render(<MobileNav />);
    fireEvent.click(more());
    const sheet = screen.getByRole("dialog", { name: "All pages" });
    expect(more()).toHaveAttribute("aria-expanded", "true");
    expect(within(sheet).getByText("Account")).toBeInTheDocument();
    expect(
      within(sheet).getByRole("link", { name: "Ranking" }),
    ).toBeInTheDocument();
    expect(sheet.contains(document.activeElement)).toBe(true);
  });

  it("closes with the Close button and returns focus to More", () => {
    render(<MobileNav />);
    fireEvent.click(more());
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(more()).toHaveFocus();
  });

  it("closes with Escape", () => {
    render(<MobileNav />);
    fireEvent.click(more());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when the backdrop is clicked", () => {
    const { container } = render(<MobileNav />);
    fireEvent.click(more());
    const backdrop = container.querySelector(".bg-black\\/60");
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop as Element);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes after choosing a page", () => {
    render(<MobileNav />);
    fireEvent.click(more());
    const sheet = screen.getByRole("dialog", { name: "All pages" });
    fireEvent.click(within(sheet).getByRole("link", { name: "Ranking" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ignores other keys while open", () => {
    render(<MobileNav />);
    fireEvent.click(more());
    fireEvent.keyDown(document, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
