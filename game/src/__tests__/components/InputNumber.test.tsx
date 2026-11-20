import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import InputNumber from "../../components/ui/tables/AdvancedDataTable/InputNumber";

describe("InputNumber", () => {
  it("renders an input element with type number", () => {
    render(<InputNumber />);
    const input = screen.getByRole("spinbutton");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
  });

  it("has default value of 0", () => {
    render(<InputNumber />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("value", "0");
  });

  it("has min attribute set to 0", () => {
    render(<InputNumber />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("min", "0");
  });

  it("has aria-label for accessibility", () => {
    render(<InputNumber />);
    const input = screen.getByLabelText("Amount");
    expect(input).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<InputNumber ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("uses the given label as accessible name", () => {
    render(<InputNumber label="Amount of Houses" />);
    expect(screen.getByLabelText("Amount of Houses")).toBeInTheDocument();
  });

  it("has no Max button without a max", () => {
    render(<InputNumber />);
    expect(screen.queryByRole("button", { name: /max/i })).toBeNull();
  });

  it("fills in the maximum when Max is clicked", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<InputNumber ref={ref} max={12} />);
    fireEvent.click(screen.getByRole("button", { name: /max/i }));
    expect(ref.current?.value).toBe("12");
    expect(screen.getByRole("spinbutton")).toHaveAttribute("max", "12");
  });
});
