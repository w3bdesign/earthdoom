import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Country from "../../pages/country";

const mockGetAll = jest.fn();

jest.mock("../../utils/api", () => ({
  api: {
    paUsers: {
      getAll: {
        useQuery: () => mockGetAll(),
      },
    },
  },
}));

jest.mock("../../components/common/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const player = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  nick: "Player1",
  y: 2,
  tag: "",
  score: 1000,
  commander: 0,
  timer: 0,
  ...overrides,
});

describe("Country page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the layout", () => {
    mockGetAll.mockReturnValue({ data: null });
    render(<Country />);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    mockGetAll.mockReturnValue({ data: null });
    render(<Country />);
    expect(
      screen.getByRole("button", { name: "Previous continent" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next continent" }),
    ).toBeInTheDocument();
  });

  it("moves between continents with Previous and Next", () => {
    mockGetAll.mockReturnValue({ data: null });
    render(<Country />);
    const input = screen.getByLabelText("Continent number");
    fireEvent.click(screen.getByRole("button", { name: "Next continent" }));
    expect(input).toHaveValue("2");
    fireEvent.click(screen.getByRole("button", { name: "Previous continent" }));
    expect(input).toHaveValue("1");
  });

  it("renders table headers", () => {
    mockGetAll.mockReturnValue({ data: null });
    render(<Country />);
    const headers = screen
      .getAllByRole("columnheader")
      .map((h) => h.textContent);
    expect(headers).toEqual(["Location", "Player", "Score", "Actions"]);
  });

  it("renders player data in the table", () => {
    mockGetAll.mockReturnValue({
      data: [player({ tag: "TAG1", score: 5000 })],
    });
    render(<Country />);
    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("[TAG1]")).toBeInTheDocument();
    // Score column, plus a copy under the name for small screens
    expect(screen.getByText("5,000")).toBeInTheDocument();
  });

  it("renders input field with initial value 1", () => {
    mockGetAll.mockReturnValue({ data: null });
    render(<Country />);
    expect(screen.getByLabelText("Continent number")).toHaveValue("1");
  });

  it("marks commander players with a badge", () => {
    mockGetAll.mockReturnValue({
      data: [player({ nick: "Commander1", commander: 1 })],
    });
    render(<Country />);
    expect(screen.getByText("Commander1")).toBeInTheDocument();
    expect(screen.getByText("Commander")).toBeInTheDocument();
  });

  it("shows ONLINE status for recently active players", () => {
    mockGetAll.mockReturnValue({
      data: [player({ nick: "ActivePlayer", timer: Date.now() })],
    });
    render(<Country />);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("renders spying and mail links for each player", () => {
    mockGetAll.mockReturnValue({ data: [player({ id: 42 })] });
    render(<Country />);
    expect(
      screen.getByRole("link", { name: "Spy on Player1" }),
    ).toHaveAttribute("href", "/spy?id=42");
    expect(screen.getByRole("link", { name: "Mail Player1" })).toHaveAttribute(
      "href",
      "/mail?id=42",
    );
  });
});
