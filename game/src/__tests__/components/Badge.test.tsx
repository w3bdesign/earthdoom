import React from "react";
import { render, screen } from "@testing-library/react";

import Badge from "../../components/ui/Badge";

describe("Badge", () => {
  it("uses the neutral tone by default", () => {
    render(<Badge>Home</Badge>);
    expect(screen.getByText("Home")).toHaveClass("text-muted");
  });

  it("applies the given tone and extra classes", () => {
    render(
      <Badge tone="hostile" className="ml-2">
        Under attack
      </Badge>,
    );
    const badge = screen.getByText("Under attack");
    expect(badge).toHaveClass("text-hostile", "ml-2");
  });
});
