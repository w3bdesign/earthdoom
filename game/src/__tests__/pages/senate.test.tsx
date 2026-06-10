import React from "react";
import { render, screen } from "@testing-library/react";
import Senate from "../../pages/senate";

jest.mock("../../components/common/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

describe("Senate page", () => {
  it("renders the senate page with layout", () => {
    render(<Senate />);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const { container } = render(<Senate />);
    expect(container).not.toBeEmptyDOMElement();
  });
});
