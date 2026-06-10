import React from "react";
import { render, screen } from "@testing-library/react";
import { DataTable } from "../../components/ui/tables/DataTable";
import { createMockPaPlayer } from "../../test-utils/players";

describe("DataTable", () => {
  const defaultColumns = [
    { label: "Crystal", accessor: "crystal" },
    { label: "Titanium", accessor: "metal" },
    { label: "Energy", accessor: "energy" },
  ];

  it("renders the caption", () => {
    const player = createMockPaPlayer();
    render(
      <DataTable
        columns={defaultColumns}
        data={[player]}
        caption="Test Caption"
      />,
    );
    expect(screen.getByText("Test Caption")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    const player = createMockPaPlayer();
    render(
      <DataTable columns={defaultColumns} data={[player]} caption="Overview" />,
    );
    expect(screen.getByText("Crystal")).toBeInTheDocument();
    expect(screen.getByText("Titanium")).toBeInTheDocument();
    expect(screen.getByText("Energy")).toBeInTheDocument();
  });

  it("renders player data values in cells", () => {
    const player = createMockPaPlayer({
      crystal: 9999,
      metal: 4444,
      energy: 2222,
    });
    render(
      <DataTable
        columns={defaultColumns}
        data={[player]}
        caption="Resources"
      />,
    );
    expect(screen.getByText("9999")).toBeInTheDocument();
    expect(screen.getByText("4444")).toBeInTheDocument();
    expect(screen.getByText("2222")).toBeInTheDocument();
  });

  it("renders multiple rows when multiple data entries provided", () => {
    const player1 = createMockPaPlayer({ nick: "Player1", crystal: 100 });
    const player2 = createMockPaPlayer({ nick: "Player2", crystal: 200 });
    const columns = [{ label: "Crystal", accessor: "crystal" }];
    render(
      <DataTable columns={columns} data={[player1, player2]} caption="Multi" />,
    );
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("renders a table element with correct structure", () => {
    const player = createMockPaPlayer();
    const { container } = render(
      <DataTable
        columns={defaultColumns}
        data={[player]}
        caption="Structure"
      />,
    );
    expect(container.querySelector("table")).toBeInTheDocument();
    expect(container.querySelector("thead")).toBeInTheDocument();
    expect(container.querySelector("tbody")).toBeInTheDocument();
    expect(container.querySelector("caption")).toBeInTheDocument();
  });

  it("renders empty table body when no data provided", () => {
    const { container } = render(
      <DataTable columns={defaultColumns} data={[]} caption="Empty" />,
    );
    const tbody = container.querySelector("tbody");
    expect(tbody).toBeInTheDocument();
    expect(tbody?.children.length).toBe(0);
  });

  it("renders data-th attributes on td elements for responsive labels", () => {
    const player = createMockPaPlayer();
    const { container } = render(
      <DataTable
        columns={defaultColumns}
        data={[player]}
        caption="Responsive"
      />,
    );
    const tds = container.querySelectorAll("td");
    expect(tds[0]).toHaveAttribute("data-th", "Crystal");
    expect(tds[1]).toHaveAttribute("data-th", "Titanium");
    expect(tds[2]).toHaveAttribute("data-th", "Energy");
  });

  it("renders string values correctly", () => {
    const player = createMockPaPlayer({ nick: "TestNick" });
    const columns = [{ label: "Nick", accessor: "nick" }];
    render(
      <DataTable columns={columns} data={[player]} caption="Nick Table" />,
    );
    expect(screen.getByText("TestNick")).toBeInTheDocument();
  });
});
