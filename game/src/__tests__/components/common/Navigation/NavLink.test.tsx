import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LuMail } from "react-icons/lu";

import NavLink from "../../../../components/common/Navigation/NavLink";
import type { ILinks } from "../../../../components/common/Header/constants/LINKS";

const mail: ILinks = {
  id: 1,
  href: "/mail",
  text: "Mail",
  group: "community",
  icon: LuMail,
};

describe("NavLink", () => {
  it("renders a link with its text", () => {
    render(<NavLink link={mail} active={false} />);
    const link = screen.getByRole("link", { name: "Mail" });
    expect(link).toHaveAttribute("href", "/mail");
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("marks the current page", () => {
    render(<NavLink link={mail} active />);
    expect(screen.getByRole("link", { name: "Mail" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("shows an unread count", () => {
    render(<NavLink link={mail} active={false} count={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("names a collapsible link with its unread count", () => {
    render(<NavLink link={mail} active={false} count={2} collapsible />);
    const link = screen.getByRole("link", { name: "Mail, 2 unread" });
    expect(link).toHaveAttribute("title", "Mail");
  });

  it("opens external links in a new tab safely", () => {
    const manual: ILinks = {
      ...mail,
      href: "https://earthdoom.com/manual",
      text: "Manual",
      target: "_blank",
    };
    render(<NavLink link={manual} active={false} />);
    const link = screen.getByRole("link", { name: "Manual" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("calls onNavigate when clicked", () => {
    const onNavigate = jest.fn();
    render(<NavLink link={mail} active={false} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("link", { name: "Mail" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
