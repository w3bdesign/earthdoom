import React from "react";
import { render, screen, within } from "@testing-library/react";

import Sidebar from "../../../../components/common/Navigation/Sidebar";

const mockPathname = { current: "/construct" };
jest.mock("next/router", () => ({
  useRouter: () => ({ pathname: mockPathname.current }),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    mockPathname.current = "/construct";
  });

  it("renders the grouped main navigation", () => {
    render(<Sidebar />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(
      within(nav).getByRole("group", { name: "Empire" }),
    ).toBeInTheDocument();
    expect(
      within(nav).getByRole("group", { name: "Military" }),
    ).toBeInTheDocument();
    expect(
      within(nav).getByRole("group", { name: "Community" }),
    ).toBeInTheDocument();
  });

  it("links the wordmark to the overview", () => {
    render(<Sidebar />);
    expect(screen.getByRole("link", { name: /Earth Doom/ })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("marks the current page", () => {
    render(<Sidebar />);
    expect(screen.getByRole("link", { name: "Construct" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows unread mail on the Mail link", () => {
    render(<Sidebar unreadMail={4} />);
    expect(
      screen.getByRole("link", { name: "Mail, 4 unread" }),
    ).toBeInTheDocument();
  });

  it("puts Manual and Log out at the bottom", () => {
    render(<Sidebar />);
    expect(screen.getByRole("link", { name: "Manual" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log out" })).toHaveAttribute(
      "href",
      "/logout",
    );
  });
});
