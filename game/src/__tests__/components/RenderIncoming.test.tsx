import React from "react";
import { render, screen } from "@testing-library/react";
import { RenderIncoming } from "../../components/ui/notifications/RenderIncoming";

jest.mock("../../components/common/Loader/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe("RenderIncoming", () => {
  it("renders a loading placeholder instead of news when isLoading is true", () => {
    render(<RenderIncoming isLoading={true} hostiles="Enemy approaching!" />);
    expect(screen.queryByText("Enemy approaching!")).not.toBeInTheDocument();
    expect(screen.queryByText(/No fleets are moving/)).not.toBeInTheDocument();
  });

  it("renders an empty state when not loading and no news", () => {
    render(<RenderIncoming isLoading={false} />);
    expect(
      screen.getByText("No fleets are moving in your continent right now."),
    ).toBeInTheDocument();
  });

  it("renders hostile news when hostiles provided", () => {
    render(<RenderIncoming isLoading={false} hostiles="Enemy approaching!" />);
    expect(screen.getByText("Enemy approaching!")).toBeInTheDocument();
  });

  it("renders friendly news when friendlies provided", () => {
    render(<RenderIncoming isLoading={false} friendlies="Ally defending!" />);
    expect(screen.getByText("Ally defending!")).toBeInTheDocument();
  });

  it("renders both hostile and friendly news when both provided", () => {
    render(
      <RenderIncoming
        isLoading={false}
        hostiles="Enemy attacking"
        friendlies="Ally incoming"
      />,
    );
    expect(screen.getByText("Enemy attacking")).toBeInTheDocument();
    expect(screen.getByText("Ally incoming")).toBeInTheDocument();
  });

  it('does not render "No fleets are moving in your continent right now." when hostiles are present', () => {
    render(<RenderIncoming isLoading={false} hostiles="Hostiles detected" />);
    expect(
      screen.queryByText("No fleets are moving in your continent right now."),
    ).not.toBeInTheDocument();
  });

  it('does not render "No fleets are moving in your continent right now." when friendlies are present', () => {
    render(<RenderIncoming isLoading={false} friendlies="Friends arriving" />);
    expect(
      screen.queryByText("No fleets are moving in your continent right now."),
    ).not.toBeInTheDocument();
  });

  it("marks hostile news as hostile for screen readers", () => {
    render(<RenderIncoming isLoading={false} hostiles="Red alert!" />);
    const row = screen.getByText("Red alert!").closest("li");
    expect(row).toHaveTextContent("Hostile: Red alert!");
  });

  it("marks friendly news as friendly for screen readers", () => {
    render(<RenderIncoming isLoading={false} friendlies="Green signal!" />);
    const row = screen.getByText("Green signal!").closest("li");
    expect(row).toHaveTextContent("Friendly: Green signal!");
  });

  it("renders one row per fleet line", () => {
    render(<RenderIncoming isLoading={false} hostiles={"Fleet A\nFleet B"} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("2 fleets")).toBeInTheDocument();
  });

  it("does not render spinner when isLoading is false", () => {
    render(<RenderIncoming isLoading={false} />);
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });
});
