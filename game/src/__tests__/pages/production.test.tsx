import React from "react";
import { render, screen } from "@testing-library/react";
import ProductionPage from "../../pages/production";

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

jest.mock("../../components/features/Production/Production", () => ({
  __esModule: true,
  default: () => <div data-testid="production-component">Production</div>,
}));

jest.mock("../../utils/functions", () => ({
  renderMessage: ({ title, message }: { title: string; message: string }) => (
    <div data-testid="render-message">
      {title}: {message}
    </div>
  ),
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
  c_airport: 0,
  c_crystal: 0,
  c_metal: 0,
  c_abase: 0,
  c_wstation: 0,
  c_amp1: 0,
  c_amp2: 0,
  c_warfactory: 0,
  c_destfact: 0,
  c_scorpfact: 0,
  c_energy: 0,
  c_odg: 0,
  ...overrides,
});

describe("Production page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders not-authenticated when user is not logged in", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: null,
      isAuthenticated: false,
    });
    render(<ProductionPage />);
    expect(screen.getByTestId("not-authenticated")).toBeInTheDocument();
  });

  it("renders loading when player data is null", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: null,
      isAuthenticated: true,
    });
    render(<ProductionPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders barracks message when c_airport is 0", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ c_airport: 0 }),
      isAuthenticated: true,
    });
    render(<ProductionPage />);
    expect(screen.getByTestId("render-message")).toBeInTheDocument();
    expect(screen.getByTestId("render-message")).toHaveTextContent(
      "Production",
    );
  });

  it("renders barracks message when c_airport > 1", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ c_airport: 2 }),
      isAuthenticated: true,
    });
    render(<ProductionPage />);
    expect(screen.getByTestId("render-message")).toBeInTheDocument();
  });

  it("renders Production component when c_airport is 1", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ c_airport: 1 }),
      isAuthenticated: true,
    });
    render(<ProductionPage />);
    expect(screen.getByTestId("production-component")).toBeInTheDocument();
  });

  it('renders "Production" heading when c_airport is 1', () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ c_airport: 1 }),
      isAuthenticated: true,
    });
    render(<ProductionPage />);
    expect(
      screen.getByRole("heading", { name: "Production" }),
    ).toBeInTheDocument();
  });

  it("does not render Production component when c_airport is 0", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ c_airport: 0 }),
      isAuthenticated: true,
    });
    render(<ProductionPage />);
    expect(
      screen.queryByTestId("production-component"),
    ).not.toBeInTheDocument();
  });
});
