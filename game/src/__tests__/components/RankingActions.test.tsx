import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RankingActions from "../../components/ui/tables/RankingActions";
import { createMockPaPlayer } from "../../test-utils/players";

const mockPush = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { username: "CurrentUser" },
  }),
}));

describe("RankingActions", () => {
  const defaultPlayer = createMockPaPlayer({
    astropods: 10,
    infinitys: 5,
    wraiths: 3,
    warfrigs: 2,
    destroyers: 1,
    scorpions: 1,
  });

  const defaultProps = {
    playerNick: "OtherPlayer",
    newbie: 0,
    currentPlayer: defaultPlayer,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders null when playerNick matches current user", () => {
    const { container } = render(
      <RankingActions {...defaultProps} playerNick="CurrentUser" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders mail button for other players", () => {
    render(<RankingActions {...defaultProps} />);
    const mailButton = screen.getByTitle("Send Mail");
    expect(mailButton).toBeInTheDocument();
    expect(mailButton).toHaveTextContent("📧");
  });

  it("navigates to mail page when mail button is clicked", () => {
    render(<RankingActions {...defaultProps} />);
    const mailButton = screen.getByTitle("Send Mail");
    fireEvent.click(mailButton);
    expect(mockPush).toHaveBeenCalledWith("/mail?nick=OtherPlayer");
  });

  it("renders attack and defend buttons when player has troops", () => {
    render(<RankingActions {...defaultProps} />);
    const attackButton = screen.getByTitle("Attack");
    const defendButton = screen.getByTitle("Defend");
    expect(attackButton).toBeInTheDocument();
    expect(defendButton).toBeInTheDocument();
  });

  it("does not render attack and defend buttons when player has no troops", () => {
    const noTroopsPlayer = createMockPaPlayer({
      astropods: 0,
      infinitys: 0,
      wraiths: 0,
      warfrigs: 0,
      destroyers: 0,
      scorpions: 0,
    });
    render(<RankingActions {...defaultProps} currentPlayer={noTroopsPlayer} />);
    expect(screen.queryByTitle("Attack")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Defend")).not.toBeInTheDocument();
  });

  it("navigates to military attack page when attack button is clicked", () => {
    render(<RankingActions {...defaultProps} />);
    const attackButton = screen.getByTitle("Attack");
    fireEvent.click(attackButton);
    expect(mockPush).toHaveBeenCalledWith(
      "/military?target=OtherPlayer&action=attack",
    );
  });

  it("navigates to military defend page when defend button is clicked", () => {
    render(<RankingActions {...defaultProps} />);
    const defendButton = screen.getByTitle("Defend");
    fireEvent.click(defendButton);
    expect(mockPush).toHaveBeenCalledWith(
      "/military?target=OtherPlayer&action=defend",
    );
  });

  it("renders attack button with correct emoji", () => {
    render(<RankingActions {...defaultProps} />);
    const attackButton = screen.getByTitle("Attack");
    expect(attackButton).toHaveTextContent("⚔️");
  });

  it("renders defend button with correct emoji", () => {
    render(<RankingActions {...defaultProps} />);
    const defendButton = screen.getByTitle("Defend");
    expect(defendButton).toHaveTextContent("🛡️");
  });

  it("still shows mail button even with no troops", () => {
    const noTroopsPlayer = createMockPaPlayer({
      astropods: 0,
      infinitys: 0,
      wraiths: 0,
      warfrigs: 0,
      destroyers: 0,
      scorpions: 0,
    });
    render(<RankingActions {...defaultProps} currentPlayer={noTroopsPlayer} />);
    expect(screen.getByTitle("Send Mail")).toBeInTheDocument();
  });

  it("renders action buttons in a flex container", () => {
    const { container } = render(<RankingActions {...defaultProps} />);
    const flexDiv = container.firstChild as HTMLElement;
    expect(flexDiv).toHaveClass("flex");
    expect(flexDiv).toHaveClass("items-center");
    expect(flexDiv).toHaveClass("justify-center");
    expect(flexDiv).toHaveClass("gap-2");
  });

  it("shows tooltip text in span elements", () => {
    render(<RankingActions {...defaultProps} />);
    expect(screen.getByText("Send a mail")).toBeInTheDocument();
    expect(
      screen.getByText("Send your troops to attack this player"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Send your troops to defend this player"),
    ).toBeInTheDocument();
  });

  it("attack button is not disabled when newbie protection is off (ENABLE_NEWBIE_PROTECTION = false)", () => {
    render(<RankingActions {...defaultProps} newbie={50} />);
    const attackButton = screen.getByTitle("Attack");
    // Since ENABLE_NEWBIE_PROTECTION is false, button should not be disabled
    expect(attackButton).not.toBeDisabled();
  });
});
