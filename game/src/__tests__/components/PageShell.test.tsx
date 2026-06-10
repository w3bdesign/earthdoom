import React from "react";
import { render, screen } from "@testing-library/react";
import PageShell from "../../components/common/PageShell";
import { createMockPaPlayer } from "../../test-utils/players";

jest.mock("../../components/common/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock("../../components/common/Loader/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe("PageShell", () => {
  it("renders null when not authenticated and showSpinnerOnUnauthenticated is false", () => {
    const { container } = render(
      <PageShell isAuthenticated={false} paPlayer={null}>
        <div>Content</div>
      </PageShell>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders spinner when not authenticated and showSpinnerOnUnauthenticated is true", () => {
    render(
      <PageShell
        isAuthenticated={false}
        paPlayer={null}
        showSpinnerOnUnauthenticated
      >
        <div>Content</div>
      </PageShell>,
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders loading spinner when authenticated but no player data", () => {
    render(
      <PageShell isAuthenticated={true} paPlayer={null}>
        <div>Content</div>
      </PageShell>,
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  it("renders children inside Layout when authenticated with player data", () => {
    render(
      <PageShell isAuthenticated={true} paPlayer={createMockPaPlayer()}>
        <div data-testid="child-content">Hello</div>
      </PageShell>,
    );
    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
