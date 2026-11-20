import React from "react";
import { render, screen } from "@testing-library/react";

import Layout from "../../../../components/common/Layout/Layout";
import { createMockPaPlayer } from "../../../../test-utils/players";

const mockUseUser = jest.fn();
jest.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
  SignedIn: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signed-in">{children}</div>
  ),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({ pathname: "/" }),
}));

jest.mock("next/head", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockUnseenMail = jest.fn();
jest.mock("@/utils/api", () => ({
  api: {
    paMail: {
      getUnseenMailByUserId: {
        useQuery: (...args: unknown[]) => mockUnseenMail(...args),
      },
    },
  },
}));

jest.mock("../../../../components/common/Header/Information", () => ({
  __esModule: true,
  default: ({ paPlayer }: { paPlayer?: { nick: string } }) => (
    <div data-testid="information">{paPlayer?.nick}</div>
  ),
}));

describe("Layout", () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({ user: { username: "TestPlayer" } });
    mockUnseenMail.mockReturnValue({ data: { email: [] } });
  });

  it("renders the page content in the main landmark", () => {
    render(
      <Layout>
        <p>Page content</p>
      </Layout>,
    );
    expect(screen.getByRole("main")).toHaveTextContent("Page content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });

  it("has a skip link to the content", () => {
    render(<Layout>content</Layout>);
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main");
  });

  it("renders both navigations and the footer", () => {
    render(<Layout>content</Layout>);
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("shows the player's tag and nick in the mobile header", () => {
    const player = createMockPaPlayer({ nick: "TestPlayer", tag: "VOID" });
    render(<Layout paPlayer={player}>content</Layout>);
    expect(screen.getByText("[VOID] TestPlayer")).toBeInTheDocument();
    expect(screen.getByTestId("information")).toHaveTextContent("TestPlayer");
  });

  it("shows the nick without brackets when the player has no tag", () => {
    const player = createMockPaPlayer({ nick: "Loner", tag: "" });
    render(<Layout paPlayer={player}>content</Layout>);
    const header = screen.getByRole("banner");
    expect(header).toHaveTextContent("Loner");
    expect(header).not.toHaveTextContent("[");
  });

  it("passes the unread mail count to the navigation", () => {
    mockUnseenMail.mockReturnValue({ data: { email: [{ id: 1 }, { id: 2 }] } });
    render(<Layout>content</Layout>);
    expect(
      screen.getByRole("link", { name: "Mail, 2 unread" }),
    ).toBeInTheDocument();
    expect(mockUnseenMail).toHaveBeenCalledWith(
      { nick: "TestPlayer" },
      { enabled: true },
    );
  });

  it("does not query mail without a username", () => {
    mockUseUser.mockReturnValue({ user: null });
    mockUnseenMail.mockReturnValue({ data: undefined });
    render(<Layout>content</Layout>);
    expect(mockUnseenMail).toHaveBeenCalledWith(
      { nick: "" },
      { enabled: false },
    );
    expect(
      screen.getAllByRole("link", { name: "Mail" }).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/unread/)).not.toBeInTheDocument();
  });
});
