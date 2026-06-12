import { render, screen, fireEvent } from "@testing-library/react";
import Alliance from "../../components/features/Alliance/Alliance";
import { createMockPaPlayer } from "../../test-utils/players";
import type { PaUsers, PaTag } from "@prisma/client";

// Mock the ToastComponent
jest.mock("../../components/ui/notifications/ToastComponent", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the ConfirmationToast
const mockShowConfirmationToast = jest.fn();
jest.mock("../../components/ui/notifications/ConfirmationToast", () => ({
  __esModule: true,
  showConfirmationToast: (props: any) => mockShowConfirmationToast(props),
  default: (props: any) => mockShowConfirmationToast(props),
}));

// Mock the API
const mockCreateAlliance = jest.fn();
const mockJoinAlliance = jest.fn();
const mockLeaveAlliance = jest.fn();
const mockInvalidate = jest.fn();
const mockRefetch = jest.fn();

jest.mock("../../utils/api", () => ({
  api: {
    useContext: () => ({
      paTag: {
        getAll: {
          invalidate: mockInvalidate,
          refetch: mockRefetch,
        },
      },
      paUsers: {
        getPlayerByNick: {
          invalidate: mockInvalidate,
          refetch: mockRefetch,
        },
      },
    }),
    paTag: {
      createAlliance: {
        useMutation: (options: any) => ({
          mutate: mockCreateAlliance,
          isPending: false,
        }),
      },
      joinAlliance: {
        useMutation: (options: any) => ({
          mutate: mockJoinAlliance,
          isPending: false,
        }),
      },
      leaveAlliance: {
        useMutation: (options: any) => ({
          mutate: mockLeaveAlliance,
          isPending: false,
        }),
      },
    },
  },
}));

describe("Alliance Component", () => {
  const mockPlayer: PaUsers = createMockPaPlayer();
  const mockTags: PaTag[] = [
    { id: 1, tag: "TEST", leader: "testuser", password: "password123" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders alliance creation form when player has no tag", () => {
    const playerWithoutTag = { ...mockPlayer, tag: "" };
    render(<Alliance paPlayer={playerWithoutTag} paTag={mockTags} />);

    expect(screen.getByText("Alliance")).toBeInTheDocument();
    expect(screen.getByText("Create alliance")).toBeInTheDocument();
    expect(screen.getByText("Join alliance")).toBeInTheDocument();
  });

  it("shows password when player is alliance leader", () => {
    const playerAsLeader = { ...mockPlayer, tag: "TEST", nick: "testuser" };
    render(<Alliance paPlayer={playerAsLeader} paTag={mockTags} />);

    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByText("password123")).toBeInTheDocument();
  });

  it("does not show password when player is not the leader", () => {
    const playerAsMember = { ...mockPlayer, tag: "TEST", nick: "othername" };
    render(<Alliance paPlayer={playerAsMember} paTag={mockTags} />);

    expect(screen.queryByText("Password:")).not.toBeInTheDocument();
  });

  it("hides join alliance form when player is in an alliance", () => {
    const playerWithTag = { ...mockPlayer, tag: "TEST" };
    render(<Alliance paPlayer={playerWithTag} paTag={mockTags} />);

    expect(screen.queryByText("Join alliance")).not.toBeInTheDocument();
    expect(screen.getByText("Leave")).toBeInTheDocument();
  });

  it("shows both create and join forms when player has no tag", () => {
    const playerWithoutTag = { ...mockPlayer, tag: "" };
    render(<Alliance paPlayer={playerWithoutTag} paTag={mockTags} />);

    expect(screen.getByText("Create alliance")).toBeInTheDocument();
    expect(screen.getByText("Join alliance")).toBeInTheDocument();
  });

  it("calls showConfirmationToast when leave button is clicked", () => {
    const playerWithTag = { ...mockPlayer, tag: "TEST" };
    render(<Alliance paPlayer={playerWithTag} paTag={mockTags} />);

    const leaveButton = screen.getByText("Leave");
    fireEvent.click(leaveButton);

    expect(mockShowConfirmationToast).toHaveBeenCalledWith({
      message: "Are you sure you want to leave your alliance?",
      onConfirm: expect.any(Function),
      confirmText: "Leave",
      cancelText: "Cancel",
    });
  });

  it("displays leader status when player is alliance leader", () => {
    const playerAsLeader = { ...mockPlayer, tag: "TEST", nick: "testuser" };
    render(<Alliance paPlayer={playerAsLeader} paTag={mockTags} />);

    expect(screen.getByText(/leader of TEST/)).toBeInTheDocument();
  });

  it("displays member status when player is not the leader", () => {
    const playerAsMember = { ...mockPlayer, tag: "TEST", nick: "othername" };
    render(<Alliance paPlayer={playerAsMember} paTag={mockTags} />);

    expect(screen.getByText(/member of TEST/)).toBeInTheDocument();
  });

  it("has input fields with correct attributes", () => {
    const playerWithoutTag = { ...mockPlayer, tag: "" };
    render(<Alliance paPlayer={playerWithoutTag} paTag={mockTags} />);

    const createInput = screen.getByLabelText("Create alliance");
    expect(createInput).toHaveAttribute("pattern", "[A-Za-z]+");
    expect(createInput).toHaveAttribute("title", "Please enter letters only");

    const joinInput = screen.getByLabelText("Join alliance");
    expect(joinInput).toHaveAttribute("pattern", "[A-Za-z]+");
    expect(joinInput).toHaveAttribute("title", "Please enter letters only");
  });
});
