import React from "react";
import { render, screen } from "@testing-library/react";
import ContNews from "../../pages/contnews";
import { createMockPaPlayer } from "../../test-utils/players";

const mockUseUser = jest.fn();

jest.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
}));

const mockGetPlayerByNick = jest.fn();
const mockGetContinentIncoming = jest.fn();

jest.mock("../../utils/api", () => ({
  api: {
    paUsers: {
      getPlayerByNick: {
        useQuery: () => mockGetPlayerByNick(),
      },
      getContinentIncoming: {
        useQuery: () => mockGetContinentIncoming(),
      },
    },
  },
}));

jest.mock("../../components/common/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock("../../components/ui", () => ({
  RenderIncoming: ({
    isLoading,
    hostiles,
    friendlies,
  }: {
    isLoading: boolean;
    hostiles?: string;
    friendlies?: string;
  }) => (
    <div data-testid="render-incoming">
      {isLoading && <span>Loading</span>}
      {hostiles && <span>{hostiles}</span>}
      {friendlies && <span>{friendlies}</span>}
      {!isLoading && !hostiles && !friendlies && <span>No data</span>}
    </div>
  ),
}));

/** Set up mocks for authenticated user with player data */
function setupAuthenticatedUser(incomingData: {
  data: unknown;
  isLoading: boolean;
}) {
  mockUseUser.mockReturnValue({
    user: { username: "TestUser" },
    isSignedIn: true,
  });
  mockGetPlayerByNick.mockReturnValue({ data: createMockPaPlayer() });
  mockGetContinentIncoming.mockReturnValue(incomingData);
}

/** Set up mocks for unauthenticated or missing data scenarios */
function setupUnauthenticated(user: unknown) {
  mockUseUser.mockReturnValue(user);
  mockGetPlayerByNick.mockReturnValue({ data: null });
  mockGetContinentIncoming.mockReturnValue({ data: null, isLoading: false });
}

describe("ContNews page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns null when not signed in", () => {
    setupUnauthenticated({ user: null, isSignedIn: false });
    const { container } = render(<ContNews />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when signed in but no username", () => {
    setupUnauthenticated({ user: { username: null }, isSignedIn: true });
    const { container } = render(<ContNews />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when player data not loaded", () => {
    mockUseUser.mockReturnValue({
      user: { username: "TestUser" },
      isSignedIn: true,
    });
    mockGetPlayerByNick.mockReturnValue({ data: null });
    mockGetContinentIncoming.mockReturnValue({ data: null, isLoading: false });
    const { container } = render(<ContNews />);
    expect(container.innerHTML).toBe("");
  });

  it("renders RenderIncoming with no data when news is empty", () => {
    setupAuthenticatedUser({ data: null, isLoading: false });
    render(<ContNews />);
    expect(screen.getByTestId("render-incoming")).toBeInTheDocument();
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders RenderIncoming with hostile data", () => {
    setupAuthenticatedUser({
      data: { hostiles: "Enemy incoming!", friendly: null },
      isLoading: false,
    });
    render(<ContNews />);
    expect(screen.getByText("Enemy incoming!")).toBeInTheDocument();
  });

  it("renders RenderIncoming with friendly data", () => {
    setupAuthenticatedUser({
      data: { hostiles: null, friendly: "Ally defending!" },
      isLoading: false,
    });
    render(<ContNews />);
    expect(screen.getByText("Ally defending!")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    setupAuthenticatedUser({ data: null, isLoading: true });
    render(<ContNews />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });
});
