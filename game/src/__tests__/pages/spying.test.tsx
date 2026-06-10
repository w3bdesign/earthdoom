import React from "react";
import { render, screen, act } from "@testing-library/react";
import Spying from "../../pages/spying";

const mockUsePlayerData = jest.fn();
jest.mock("../../utils/usePlayerData", () => ({
  usePlayerData: () => mockUsePlayerData(),
}));

let capturedOnSuccess:
  | ((data: { ui_roids: number }) => Promise<void>)
  | undefined;
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
          onSuccess?: (data: { ui_roids: number }) => Promise<void>;
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

jest.mock("../../components/features/Spying/constants/SPYING", () => ({
  SPYING: [],
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
  ...overrides,
});

describe("Spying page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders not-authenticated when user is not logged in", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: null,
      isAuthenticated: false,
      isLoaded: true,
    });
    render(<Spying />);
    expect(screen.getByTestId("not-authenticated")).toBeInTheDocument();
  });

  it("renders loading when player data is null", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: null,
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Spying />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders AdvancedDataTable when player data is loaded", () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer(),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Spying />);
    expect(screen.getByTestId("data-table")).toHaveTextContent("Spying");
  });

  it("calls invalidate and refetch on mutation success", async () => {
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ ui_roids: 3 }),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Spying />);

    await act(async () => {
      await capturedOnSuccess?.({ ui_roids: 5 });
    });

    expect(mockInvalidate).toHaveBeenCalled();
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("shows success toast with land found count on mutation success", async () => {
    const { ToastComponent } = jest.requireMock("../../components/ui");
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer({ ui_roids: 3 }),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Spying />);

    await act(async () => {
      await capturedOnSuccess?.({ ui_roids: 5 });
    });

    expect(ToastComponent).toHaveBeenCalledWith({
      message: "Spying complete - found 2 land",
      type: "success",
    });
  });

  it("shows error toast on mutation error", () => {
    const { ToastComponent } = jest.requireMock("../../components/ui");
    mockUsePlayerData.mockReturnValue({
      paPlayer: createPlayer(),
      isAuthenticated: true,
      isLoaded: true,
    });
    render(<Spying />);

    capturedOnError?.();

    expect(ToastComponent).toHaveBeenCalledWith({
      message: "Database error",
      type: "error",
    });
  });
});
