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

  const noTroops = createMockPaPlayer({
    astropods: 0,
    infinitys: 0,
    wraiths: 0,
    warfrigs: 0,
    destroyers: 0,
    scorpions: 0,
  });

  it('shows "You" instead of actions for the current user', () => {
    render(<RankingActions {...defaultProps} playerNick="CurrentUser" />);
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders mail button for other players", () => {
    render(<RankingActions {...defaultProps} />);
    const mailButton = screen.getByRole("button", { name: "Mail OtherPlayer" });
    expect(mailButton).toHaveTextContent("Mail");
  });

  it("navigates to mail page when mail button is clicked", () => {
    render(<RankingActions {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Mail OtherPlayer" }));
    expect(mockPush).toHaveBeenCalledWith("/mail?nick=OtherPlayer");
  });

  it("renders attack and defend buttons when player has troops", () => {
    render(<RankingActions {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Attack OtherPlayer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Defend OtherPlayer" }),
    ).toBeInTheDocument();
  });

  it("does not render attack and defend buttons when player has no troops", () => {
    render(<RankingActions {...defaultProps} currentPlayer={noTroops} />);
    expect(screen.queryByRole("button", { name: /^Attack/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /^Defend/ })).toBeNull();
  });

  it("navigates to military attack page when attack button is clicked", () => {
    render(<RankingActions {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Attack OtherPlayer" }));
    expect(mockPush).toHaveBeenCalledWith(
      "/military?target=OtherPlayer&action=attack",
    );
  });

  it("navigates to military defend page when defend button is clicked", () => {
    render(<RankingActions {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Defend OtherPlayer" }));
    expect(mockPush).toHaveBeenCalledWith(
      "/military?target=OtherPlayer&action=defend",
    );
  });

  it("uses icons, not emoji, for the actions", () => {
    render(<RankingActions {...defaultProps} />);
    screen.getAllByRole("button").forEach((button) => {
      expect(button.querySelector("svg")).toBeInTheDocument();
      expect(button.textContent).not.toMatch(/\p{Extended_Pictographic}/u);
    });
  });

  it("still shows mail button even with no troops", () => {
    render(<RankingActions {...defaultProps} currentPlayer={noTroops} />);
    expect(
      screen.getByRole("button", { name: "Mail OtherPlayer" }),
    ).toBeInTheDocument();
  });

  it("gives every action a tooltip that matches its name", () => {
    render(<RankingActions {...defaultProps} />);
    screen.getAllByRole("button").forEach((button) => {
      expect(button).toHaveAttribute(
        "title",
        button.getAttribute("aria-label"),
      );
    });
  });

  it("attack button is not disabled when newbie protection is off (ENABLE_NEWBIE_PROTECTION = false)", () => {
    render(<RankingActions {...defaultProps} newbie={50} />);
    expect(
      screen.getByRole("button", { name: "Attack OtherPlayer" }),
    ).not.toBeDisabled();
  });
});
