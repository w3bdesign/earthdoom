import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import News from "../../pages/news";
import { createMockPaPlayer } from "../../test-utils/players";

const mockUseUser = jest.fn();

jest.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
}));

let capturedOnSuccess: (() => Promise<void>) | undefined;
let capturedOnError: (() => void) | undefined;
const mockDeleteAllNews = jest.fn();
const mockInvalidate = jest.fn().mockResolvedValue(undefined);
const mockRefetch = jest.fn().mockResolvedValue(undefined);
const mockGetAllNewsByUserId = jest.fn();
const mockGetPlayerByNick = jest.fn();

jest.mock("../../utils/api", () => ({
  api: {
    useContext: () => ({
      paNews: {
        getAllNewsByUserId: {
          invalidate: mockInvalidate,
          refetch: mockRefetch,
        },
      },
    }),
    paNews: {
      getAllNewsByUserId: {
        useQuery: () => mockGetAllNewsByUserId(),
      },
      deleteAllNews: {
        useMutation: (opts: {
          onSuccess?: () => Promise<void>;
          onError?: () => void;
        }) => {
          capturedOnSuccess = opts.onSuccess;
          capturedOnError = opts.onError;
          return { mutate: mockDeleteAllNews, isLoading: false };
        },
      },
    },
    paUsers: {
      getPlayerByNick: {
        useQuery: () => mockGetPlayerByNick(),
      },
    },
  },
}));

jest.mock("../../components/common/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock("../../components/common/Loader/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock("../../components/ui", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  ToastComponent: jest.fn(),
}));

jest.mock("../../components/features/News/NewsTable", () => ({
  __esModule: true,
  default: () => <div data-testid="news-table">News Table</div>,
}));

jest.mock("../../components/features/News", () => ({
  CombatReport: ({ title }: { title: string }) => (
    <div data-testid="combat-report">{title}</div>
  ),
}));

jest.mock("../../utils/functions", () => ({
  isJSON: (str: string) => {
    try {
      const val = JSON.parse(str);
      return typeof val === "object" && val !== null;
    } catch {
      return false;
    }
  },
}));

/** Set up mocks for an authenticated user with news data */
function setupWithNews(newsData: unknown) {
  mockUseUser.mockReturnValue({
    user: { username: "TestUser" },
    isSignedIn: true,
  });
  mockGetAllNewsByUserId.mockReturnValue({ data: newsData, isLoading: false });
  mockGetPlayerByNick.mockReturnValue({ data: createMockPaPlayer() });
}

/** Set up mocks for an unauthenticated/loading scenario */
function setupUnauthenticated(
  user: unknown,
  newsReturn: { data: unknown; isLoading: boolean },
) {
  mockUseUser.mockReturnValue(user);
  mockGetAllNewsByUserId.mockReturnValue(newsReturn);
  mockGetPlayerByNick.mockReturnValue({ data: null });
}

describe("News page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns null when not signed in", () => {
    setupUnauthenticated(
      { user: null, isSignedIn: false },
      { data: null, isLoading: false },
    );
    const { container } = render(<News />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when signed in but no username", () => {
    setupUnauthenticated(
      { user: { username: null }, isSignedIn: true },
      { data: null, isLoading: false },
    );
    const { container } = render(<News />);
    expect(container.innerHTML).toBe("");
  });

  it("renders loading spinner when data not available", () => {
    setupUnauthenticated(
      { user: { username: "TestUser" }, isSignedIn: true },
      { data: null, isLoading: true },
    );
    render(<News />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it('renders "No news to report" when news array is empty', () => {
    setupWithNews({ news: [] });
    render(<News />);
    expect(screen.getByText("No news to report")).toBeInTheDocument();
  });

  it("renders news table when news exist", () => {
    setupWithNews({
      news: [{ id: 1, news: "Test news", time: 1000000, userId: 1, seen: 0 }],
    });
    render(<News />);
    expect(screen.getByTestId("news-table")).toBeInTheDocument();
  });

  it("renders Delete All button when news exist", () => {
    setupWithNews({
      news: [{ id: 1, news: "Test news", time: 1000000, userId: 1, seen: 0 }],
    });
    render(<News />);
    expect(screen.getByText("Delete All")).toBeInTheDocument();
  });

  it("calls deleteAllNews when Delete All is clicked", () => {
    setupWithNews({
      news: [{ id: 1, news: "Test news", time: 1000000, userId: 1, seen: 0 }],
    });
    render(<News />);
    fireEvent.click(screen.getByText("Delete All"));
    expect(mockDeleteAllNews).toHaveBeenCalledWith({ nick: "TestUser" });
  });

  it("calls ToastComponent with success on mutation success", async () => {
    const { ToastComponent } = jest.requireMock("../../components/ui");
    setupWithNews({
      news: [{ id: 1, news: "Test news", time: 1000000, userId: 1, seen: 0 }],
    });
    render(<News />);

    await act(async () => {
      await capturedOnSuccess?.();
    });

    expect(ToastComponent).toHaveBeenCalledWith({
      message: "News deleted",
      type: "success",
    });
  });

  it("calls ToastComponent with error on mutation error", () => {
    const { ToastComponent } = jest.requireMock("../../components/ui");
    setupWithNews({
      news: [{ id: 1, news: "Test news", time: 1000000, userId: 1, seen: 0 }],
    });
    render(<News />);
    capturedOnError?.();

    expect(ToastComponent).toHaveBeenCalledWith({
      message: "Database error",
      type: "error",
    });
  });

  it("renders combat reports for valid JSON combat news", () => {
    const combatReport = JSON.stringify({
      title: "Combat report",
      defenders: { infantry: { total: 10, lost: "3" } },
      attackers: { ships: { total: 5, lost: "2" } },
      yours: { result: "win" },
      land: { gained: 3 },
    });

    setupWithNews({
      news: [{ id: 1, news: combatReport, time: 1000000, userId: 1, seen: 0 }],
    });
    render(<News />);
    expect(screen.getByTestId("combat-report")).toBeInTheDocument();
  });
});
