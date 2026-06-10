import React from "react";
import { render, screen, act } from "@testing-library/react";
import ResearchPage from "../../pages/research";

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
    paUsers: {
      researchBuilding: {
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

jest.mock("../../components/features/Research/constants/RESEARCH", () => ({
  BUILDINGS: [],
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
  r_imcrystal: 0,
  r_immetal: 0,
  ...overrides,
});

describe("Research page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders not-authenticated when user is not logged in", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: null,
      isAuthenticated: false,
    });
    render(<ResearchPage />);
    expect(screen.getByTestId("not-authenticated")).toBeInTheDocument();
  });

  it("renders loading when player data is null", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: null,
      isAuthenticated: true,
    });
    render(<ResearchPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders AdvancedDataTable when player data is loaded", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer(),
      isAuthenticated: true,
    });
    render(<ResearchPage />);
    expect(screen.getByTestId("data-table")).toHaveTextContent("Research");
  });

  it("calls invalidate and refetch on mutation success", async () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer(),
      isAuthenticated: true,
    });
    render(<ResearchPage />);

    await act(async () => {
      await capturedOnSuccess?.();
    });

    expect(mockInvalidate).toHaveBeenCalled();
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("shows success toast on mutation success", async () => {
    const { ToastComponent } = jest.requireMock("../../components/ui");
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer(),
      isAuthenticated: true,
    });
    render(<ResearchPage />);

    await act(async () => {
      await capturedOnSuccess?.();
    });

    expect(ToastComponent).toHaveBeenCalledWith({
      message: "Research started",
      type: "success",
    });
  });

  it("shows error toast on mutation error", () => {
    const { ToastComponent } = jest.requireMock("../../components/ui");
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer(),
      isAuthenticated: true,
    });
    render(<ResearchPage />);

    capturedOnError?.();

    expect(ToastComponent).toHaveBeenCalledWith({
      message: "Database error",
      type: "error",
    });
  });
});
