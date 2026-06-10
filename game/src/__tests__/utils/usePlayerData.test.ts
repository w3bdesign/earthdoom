import { renderHook } from "@testing-library/react";
import { usePlayerData } from "../../utils/usePlayerData";

const mockUseUser = jest.fn();
const mockUseQuery = jest.fn();

jest.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
}));

jest.mock("../../utils/api", () => ({
  api: {
    paUsers: {
      getPlayerByNick: {
        useQuery: (...args: unknown[]) => mockUseQuery(...args),
      },
    },
  },
}));

describe("usePlayerData", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns isAuthenticated false when not signed in", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isSignedIn: false,
      isLoaded: true,
    });
    mockUseQuery.mockReturnValue({ data: undefined });

    const { result } = renderHook(() => usePlayerData());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.paPlayer).toBeUndefined();
  });

  it("returns isAuthenticated false when signed in but no username", () => {
    mockUseUser.mockReturnValue({
      user: { username: null },
      isSignedIn: true,
      isLoaded: true,
    });
    mockUseQuery.mockReturnValue({ data: undefined });

    const { result } = renderHook(() => usePlayerData());

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("returns isAuthenticated true when signed in with username", () => {
    mockUseUser.mockReturnValue({
      user: { username: "TestUser" },
      isSignedIn: true,
      isLoaded: true,
    });
    mockUseQuery.mockReturnValue({ data: { id: 1, nick: "TestUser" } });

    const { result } = renderHook(() => usePlayerData());

    expect(result.current.isAuthenticated).toBe(true);
  });

  it("returns player data from query", () => {
    const mockPlayer = { id: 1, nick: "TestUser", crystal: 5000 };
    mockUseUser.mockReturnValue({
      user: { username: "TestUser" },
      isSignedIn: true,
      isLoaded: true,
    });
    mockUseQuery.mockReturnValue({ data: mockPlayer });

    const { result } = renderHook(() => usePlayerData());

    expect(result.current.paPlayer).toEqual(mockPlayer);
  });

  it("passes correct query parameters", () => {
    mockUseUser.mockReturnValue({
      user: { username: "TestUser" },
      isSignedIn: true,
      isLoaded: true,
    });
    mockUseQuery.mockReturnValue({ data: undefined });

    renderHook(() => usePlayerData());

    expect(mockUseQuery).toHaveBeenCalledWith(
      { nick: "TestUser" },
      { enabled: true },
    );
  });

  it("disables query when not signed in", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isSignedIn: false,
      isLoaded: true,
    });
    mockUseQuery.mockReturnValue({ data: undefined });

    renderHook(() => usePlayerData());

    expect(mockUseQuery).toHaveBeenCalledWith({ nick: "" }, { enabled: false });
  });

  it("returns user from clerk", () => {
    const mockUser = { username: "TestUser" };
    mockUseUser.mockReturnValue({
      user: mockUser,
      isSignedIn: true,
      isLoaded: true,
    });
    mockUseQuery.mockReturnValue({ data: undefined });

    const { result } = renderHook(() => usePlayerData());

    expect(result.current.user).toEqual(mockUser);
  });

  it("returns isLoaded from clerk", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isSignedIn: false,
      isLoaded: false,
    });
    mockUseQuery.mockReturnValue({ data: undefined });

    const { result } = renderHook(() => usePlayerData());

    expect(result.current.isLoaded).toBe(false);
  });
});
