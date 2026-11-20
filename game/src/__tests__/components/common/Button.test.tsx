import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button, {
  Button as NamedButton,
} from "../../../components/common/Button";

describe("Button component", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-accent", "h-10");
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toBeDisabled();
  });

  it("renders primary variant correctly", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole("button", { name: /primary/i });
    expect(button).toHaveClass("bg-accent", "text-accent-ink");
  });

  it("renders secondary variant correctly", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button", { name: /secondary/i });
    expect(button).toHaveClass("bg-raised", "text-ink");
  });

  it("renders danger variant correctly", () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole("button", { name: /danger/i });
    expect(button).toHaveClass("text-hostile");
  });

  it("renders the small size", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button", { name: /small/i })).toHaveClass("h-8");
  });

  it("applies disabled state correctly", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });

  it("applies extra classes correctly", () => {
    const extraClasses = "test-class another-class";
    render(<Button extraClasses={extraClasses}>Extra Classes</Button>);
    const button = screen.getByRole("button", { name: /extra classes/i });
    expect(button.className).toContain("test-class");
    expect(button.className).toContain("another-class");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Handler</Button>);
    fireEvent.click(screen.getByRole("button", { name: /click handler/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not trigger click handler when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Click
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: /disabled click/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies hover and focus styles", () => {
    render(<Button>Style Test</Button>);
    const { className } = screen.getByRole("button", { name: /style test/i });
    expect(className).toContain("hover:bg-accent-strong");
    expect(className).toContain("focus-visible:bg-accent-strong");
  });

  it("spreads additional props to button element", () => {
    render(
      <Button data-testid="test-button" aria-label="test button">
        Props Spread
      </Button>,
    );
    expect(screen.getByTestId("test-button")).toHaveAttribute(
      "aria-label",
      "test button",
    );
  });

  it("keeps long text on one line", () => {
    render(
      <Button>
        This is a very long button text that should still maintain proper
        styling
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("whitespace-nowrap");
  });

  it("combines all style classes correctly", () => {
    render(
      <Button variant="primary" extraClasses="custom-class">
        Test
      </Button>,
    );
    const { className } = screen.getByRole("button");
    expect(className).toContain("inline-flex");
    expect(className).toContain("rounded-md");
    expect(className).toContain("bg-accent");
    expect(className).toContain("custom-class");
    expect(className).toContain("disabled:opacity-50");
  });

  it("named export renders the same as default export", () => {
    render(<NamedButton>Named Export</NamedButton>);
    const button = screen.getByRole("button", { name: /named export/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-accent");
  });

  it("danger variant applies a hover class", () => {
    render(<Button variant="danger">Danger Hover</Button>);
    const { className } = screen.getByRole("button", { name: /danger hover/i });
    expect(className).toContain("hover:bg-hostile/20");
  });
});
