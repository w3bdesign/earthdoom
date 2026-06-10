import React from "react";
import { render, screen } from "@testing-library/react";
import MilitaryPage from "../../pages/military";

const mockUsePlayerData = jest.fn();
jest.mock("../../utils/usePlayerData", () => ({
  usePlayerData: () => mockUsePlayerData(),
}));

jest.mock("../../components/common/PageShell", () => ({
  __esModule: true,
  default: ({
    isAuthenticated,
    paPlayer,
    children,
  }: {
    isAuthenticated: boolean;
    paPlayer: unknown;
    children: React.ReactNode;
  }) => {
    if (!isAuthenticated) return <div data-testid="not-authenticated" />;
    if (!paPlayer) return <div data-testid="loading" />;
    return <div data-testid="page-shell">{children}</div>;
  },
}));

jest.mock("../../components/features/Military/Military", () => ({
  __esModule: true,
  default: () => <div data-testid="military-component">Military</div>,
}));

jest.mock("../../components/ui/tables/UnitsTable", () => ({
  __esModule: true,
  default: () => <div data-testid="units-table">Units Table</div>,
}));

jest.mock("../../components/ui/tables/FleetTable", () => ({
  __esModule: true,
  default: () => <div data-testid="fleet-table">Fleet Table</div>,
}));

const createPlayer = (overrides = {}) => ({
  id: 1,
  nick: "Test",
  crystal: 5000,
  metal: 3000,
  energy: 1000,
  r_energy: 0,
  ui_roids: 3,
  score: 100,
  size: 10,
  rank: 1,
  tag: "",
  ...overrides,
});

describe("Military page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders not-authenticated when user is not logged in", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: null,
      isAuthenticated: false,
    });
    render(<MilitaryPage />);
    expect(screen.getByTestId("not-authenticated")).toBeInTheDocument();
  });

  it("renders loading when player data is null", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: null,
      isAuthenticated: true,
    });
    render(<MilitaryPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders UnitsTable when player data is loaded", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer(),
      isAuthenticated: true,
    });
    render(<MilitaryPage />);
    expect(screen.getByTestId("units-table")).toBeInTheDocument();
  });

  it("renders FleetTable when player data is loaded", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer(),
      isAuthenticated: true,
    });
    render(<MilitaryPage />);
    expect(screen.getByTestId("fleet-table")).toBeInTheDocument();
  });

  it("renders Military component when player data is loaded", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer(),
      isAuthenticated: true,
    });
    render(<MilitaryPage />);
    expect(screen.getByTestId("military-component")).toBeInTheDocument();
  });

  it("renders within page shell when authenticated with player", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer(),
      isAuthenticated: true,
    });
    render(<MilitaryPage />);
    expect(screen.getByTestId("page-shell")).toBeInTheDocument();
  });
});
