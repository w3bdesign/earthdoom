import React from "react";
import { render, screen, act } from "@testing-library/react";
import Energy from "../../pages/energy";

const mockUsePlayerData = jest.fn();
jest.mock("../../utils/usePlayerData", () => ({
  usePlayerData: () => mockUsePlayerData(),
}));

let capturedOnSuccess: (() => Promise<void>) | undefined;
let capturedOnError: (() => void) | undefined;
const mockMutate = jest.fn();
const mockInvalidate = jest.fn().mockResolvedValue(undefined);
const mockRefetch = jest.fn().mockResolvedValue(undefined);

jest.mock("../../utils/api", () => ({
  api: {
    useContext: () => ({
      paUsers: {
        getPlayerByNick: { invalidate: mockInvalidate, refetch: mockRefetch },
      },
    }),
    paSpying: {
      spyingInitiate: {
        useMutation: (opts: {
          onSuccess?: () => Promise<void>;
          onError?: () => void;
        }) => {
          capturedOnSuccess = opts.onSuccess;
          capturedOnError = opts.onError;
          return { mutate: mockMutate, isLoading: false };
        },
      },
    },
  },
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

jest.mock("../../components/ui", () => ({
  Button: () => <button>Button</button>,
  AdvancedDataTable: ({ caption }: { caption: string }) => (
    <div data-testid="data-table">{caption}</div>
  ),
  ToastComponent: jest.fn(),
}));

jest.mock("../../utils/functions", () => ({
  renderMessage: ({ title, message }: { title: string; message: string }) => (
    <div data-testid="render-message">
      {title}: {message}
    </div>
  ),
}));

jest.mock("../../components/features/Energy/constants/ENERGY", () => ({
  ENERGY: [],
}));

const createPlayer = (overrides = {}) => ({
  id: 1,
  nick: "Test",
  crystal: 5000,
  metal: 3000,
  energy: 1000,
  r_energy: 0,
  ui_roids: 3,
  asteroid_crystal: 5,
  asteroid_metal: 5,
  sats: 0,
  war: 0,
  def: 0,
  wareta: 0,
  defeta: 0,
  score: 100,
  size: 10,
  rank: 1,
  tag: "",
  civilians: 1000,
  tax: 20,
  credits: 5000,
  c_crystal: 0,
  c_metal: 0,
  c_airport: 0,
  c_abase: 0,
  c_wstation: 0,
  c_amp1: 0,
  c_amp2: 0,
  c_warfactory: 0,
  c_destfact: 0,
  c_scorpfact: 0,
  c_energy: 0,
  c_odg: 0,
  r_imcrystal: 0,
  r_immetal: 0,
  ...overrides,
});

describe("Energy page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders not-authenticated when user is not logged in", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: null,
      isAuthenticated: false,
      isLoaded: true,
    });
    render(<Energy />);
    expect(screen.getByTestId("not-authenticated")).toBeInTheDocument();
  });

  it("renders loading when player data is null", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: null,
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Energy />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders energy message when r_energy is 0", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ r_energy: 0 }),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Energy />);
    expect(screen.getByTestId("render-message")).toHaveTextContent("Energy");
  });

  it("renders energy message when r_energy > 1", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ r_energy: 2 }),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Energy />);
    expect(screen.getByTestId("render-message")).toBeInTheDocument();
  });

  it("renders AdvancedDataTable when r_energy is 1", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ r_energy: 1 }),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Energy />);
    expect(screen.getByTestId("data-table")).toHaveTextContent("Energy");
  });

  it("does not render AdvancedDataTable when r_energy is 0", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ r_energy: 0 }),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Energy />);
    expect(screen.queryByTestId("data-table")).not.toBeInTheDocument();
  });

  it("calls invalidate and refetch on mutation success", async () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ r_energy: 1 }),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Energy />);

    await act(async () => {
      await capturedOnSuccess?.();
    });

    expect(mockInvalidate).toHaveBeenCalled();
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("shows success toast on mutation success", async () => {
    const { ToastComponent } = jest.requireMock("../../components/ui");
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ r_energy: 1 }),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Energy />);

    await act(async () => {
      await capturedOnSuccess?.();
    });

    expect(ToastComponent).toHaveBeenCalledWith({
      message: "Construction started",
      type: "success",
    });
  });

  it("shows error toast on mutation error", () => {
    const { ToastComponent } = jest.requireMock("../../components/ui");
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ r_energy: 1 }),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Energy />);

    capturedOnError?.();

    expect(ToastComponent).toHaveBeenCalledWith({
      message: "Database error",
      type: "error",
    });
  });
});
