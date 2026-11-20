import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../../components/common/Layout/Footer";

describe("Footer", () => {
  it("renders the footer element", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/© .*killaH · Earth Doom/)).toBeInTheDocument();
  });

  it("renders the current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it("is a footer landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBe(screen.getByTestId("footer"));
  });

  it("is static, not fixed over the content", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer")).not.toHaveClass("fixed");
  });
});
