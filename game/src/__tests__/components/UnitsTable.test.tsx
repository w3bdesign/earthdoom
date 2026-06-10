import React from "react";
import { render, screen } from "@testing-library/react";
import UnitsTable from "../../components/ui/tables/UnitsTable";
import { createMockPaPlayer } from "../../test-utils/players";

describe("UnitsTable", () => {
  it("renders the caption with total ship count", () => {
    const player = createMockPaPlayer({
      astropods: 10,
      infinitys: 5,
      wraiths: 3,
      warfrigs: 2,
      destroyers: 1,
      scorpions: 4,
    });
    render(<UnitsTable paPlayer={player} />);
    expect(screen.getByText("Units (25 total)")).toBeInTheDocument();
  });

  it("renders caption with 0 total when no ships", () => {
    const player = createMockPaPlayer({
      astropods: 0,
      infinitys: 0,
      wraiths: 0,
      warfrigs: 0,
      destroyers: 0,
      scorpions: 0,
    });
    render(<UnitsTable paPlayer={player} />);
    expect(screen.getByText("Units (0 total)")).toBeInTheDocument();
  });

  it("renders all unit column headers", () => {
    const player = createMockPaPlayer();
    render(<UnitsTable paPlayer={player} />);
    expect(screen.getByText("Astropods")).toBeInTheDocument();
    expect(screen.getByText("Infinitys")).toBeInTheDocument();
    expect(screen.getByText("Wraiths")).toBeInTheDocument();
    expect(screen.getByText("Warfrigs")).toBeInTheDocument();
    expect(screen.getByText("Destroyers")).toBeInTheDocument();
    expect(screen.getByText("Scorpions")).toBeInTheDocument();
  });

  it("renders unit count values", () => {
    const player = createMockPaPlayer({
      astropods: 15,
      infinitys: 8,
      wraiths: 6,
      warfrigs: 4,
      destroyers: 2,
      scorpions: 9,
    });
    render(<UnitsTable paPlayer={player} />);
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("renders a table element", () => {
    const player = createMockPaPlayer();
    const { container } = render(<UnitsTable paPlayer={player} />);
    expect(container.querySelector("table")).toBeInTheDocument();
  });
});
