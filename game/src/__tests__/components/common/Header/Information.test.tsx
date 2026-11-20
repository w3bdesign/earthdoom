import React from "react";
import { render, screen } from "@testing-library/react";
import Information from "../../../../components/common/Header/Information";
import { createMockPaPlayer } from "../../../../test-utils/players";

// Mock @clerk/nextjs
const mockUseUser = jest.fn();
jest.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
}));

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({
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
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock the api utility
const mockGetHostilesUseQuery = jest.fn();
const mockGetFriendliesUseQuery = jest.fn();
const mockGetUnseenMailUseQuery = jest.fn();

jest.mock("@/utils/api", () => ({
  api: {
    paUsers: {
      getHostiles: {
        useQuery: (...args: unknown[]) => mockGetHostilesUseQuery(...args),
      },
      getFriendlies: {
        useQuery: (...args: unknown[]) => mockGetFriendliesUseQuery(...args),
      },
    },
    paMail: {
      getUnseenMailByUserId: {
        useQuery: (...args: unknown[]) => mockGetUnseenMailUseQuery(...args),
      },
    },
  },
}));

describe("Information component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUser.mockReturnValue({ user: { username: "TestPlayer" } });
    mockGetHostilesUseQuery.mockReturnValue({ data: null, isLoading: false });
    mockGetFriendliesUseQuery.mockReturnValue({ data: null });
    mockGetUnseenMailUseQuery.mockReturnValue({ data: null });
  });

  it("renders null when user has no username", () => {
    mockUseUser.mockReturnValue({ user: { username: null } });
    const player = createMockPaPlayer();
    const { container } = render(<Information paPlayer={player} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders null when user is undefined", () => {
    mockUseUser.mockReturnValue({ user: undefined });
    const player = createMockPaPlayer();
    const { container } = render(<Information paPlayer={player} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders null when paPlayer is undefined", () => {
    const { container } = render(<Information />);
    expect(container.innerHTML).toBe("");
  });

  it("renders the resource bar when player data is available", () => {
    const player = createMockPaPlayer({ nick: "TestPlayer" });
    render(<Information paPlayer={player} />);
    expect(
      screen.getByLabelText("Resources for TestPlayer"),
    ).toBeInTheDocument();
    expect(screen.getByText("Credits")).toBeInTheDocument();
  });

  it("shows no fleet alerts while hostiles data is loading", () => {
    mockGetHostilesUseQuery.mockReturnValue({ data: null, isLoading: true });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders hostile alert banner when hostiles are present", () => {
    mockGetHostilesUseQuery.mockReturnValue({
      data: {
        hostiles: "5 Infinitys from EnemyPlayer\n3 Wraiths from EnemyPlayer",
      },
      isLoading: false,
    });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    const hostileAlert = screen.getByRole("alert");
    expect(hostileAlert).toHaveTextContent("2 hostile fleets incoming");
    expect(screen.getByRole("link", { name: "Military" })).toHaveAttribute(
      "href",
      "/military",
    );
    expect(
      screen.getByText("5 Infinitys from EnemyPlayer"),
    ).toBeInTheDocument();
    expect(screen.getByText("3 Wraiths from EnemyPlayer")).toBeInTheDocument();
  });

  it("renders friendly alert banner when friendlies are present", () => {
    mockGetFriendliesUseQuery.mockReturnValue({
      data: { defenders: "10 Destroyers from AllyPlayer" },
    });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    const statuses = screen.getAllByRole("status");
    expect(
      statuses.some((el) =>
        el.textContent?.includes("Friendly fleet incoming"),
      ),
    ).toBe(true);
    expect(
      screen.getByText("10 Destroyers from AllyPlayer"),
    ).toBeInTheDocument();
  });

  it("leaves unread mail to the navigation badge", () => {
    mockGetUnseenMailUseQuery.mockReturnValue({
      data: { email: [{ id: 1 }] },
    });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    expect(screen.queryByText(/unread/i)).not.toBeInTheDocument();
  });

  it("renders newbie protection alert when player has newbie ticks", () => {
    const player = createMockPaPlayer({ newbie: 50 });
    render(<Information paPlayer={player} />);
    expect(
      screen.getByText("You are under protection for 50 more ticks"),
    ).toBeInTheDocument();
  });

  it("does not render newbie protection alert when newbie is 0", () => {
    const player = createMockPaPlayer({ newbie: 0 });
    render(<Information paPlayer={player} />);
    expect(screen.queryByText(/under protection/)).not.toBeInTheDocument();
  });

  it("does not render newbie protection alert when newbie is null", () => {
    const player = createMockPaPlayer({ newbie: null as unknown as number });
    render(<Information paPlayer={player} />);
    expect(screen.queryByText(/under protection/)).not.toBeInTheDocument();
  });

  it("does not render newbie protection alert when newbie is undefined", () => {
    const player = createMockPaPlayer({
      newbie: undefined as unknown as number,
    });
    render(<Information paPlayer={player} />);
    expect(screen.queryByText(/under protection/)).not.toBeInTheDocument();
  });

  it("renders multiple alerts simultaneously", () => {
    mockGetHostilesUseQuery.mockReturnValue({
      data: { hostiles: "Incoming attack!" },
      isLoading: false,
    });
    mockGetFriendliesUseQuery.mockReturnValue({
      data: { defenders: "Defenders arriving!" },
    });
    mockGetUnseenMailUseQuery.mockReturnValue({
      data: { email: [{ id: 1 }] },
    });
    const player = createMockPaPlayer({ newbie: 25 });
    render(<Information paPlayer={player} />);

    expect(screen.getByText("Incoming attack!")).toBeInTheDocument();
    expect(screen.getByText("Defenders arriving!")).toBeInTheDocument();
    expect(
      screen.getByText("You are under protection for 25 more ticks"),
    ).toBeInTheDocument();
  });

  it("hostile alert lines are split by newlines", () => {
    mockGetHostilesUseQuery.mockReturnValue({
      data: { hostiles: "Line 1\nLine 2\nLine 3" },
      isLoading: false,
    });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    expect(screen.getByText("Line 1")).toBeInTheDocument();
    expect(screen.getByText("Line 2")).toBeInTheDocument();
    expect(screen.getByText("Line 3")).toBeInTheDocument();
  });

  it("passes nick to API queries", () => {
    mockUseUser.mockReturnValue({ user: { username: "SpecialUser" } });
    const player = createMockPaPlayer();
    render(<Information paPlayer={player} />);
    expect(mockGetHostilesUseQuery).toHaveBeenCalledWith(
      { nick: "SpecialUser" },
      { enabled: true },
    );
    expect(mockGetFriendliesUseQuery).toHaveBeenCalledWith(
      { nick: "SpecialUser" },
      { enabled: true },
    );
  });
});
