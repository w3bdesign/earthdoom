import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ActionButton from "../../components/ui/tables/AdvancedDataTable/ActionButton";
import { createMockPaPlayer } from "../../test-utils/players";
import type { Building } from "../../components/features/Construct/types/types";

jest.mock("../../components/ui/notifications/ToastComponent", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import ToastComponent from "../../components/ui/notifications/ToastComponent";
const mockToast = ToastComponent as jest.Mock;

// --- Shared Fixtures & Helpers ---

const mockMutate = jest.fn();

function createBuilding(overrides: Partial<Building> = {}): Building {
  return {
    buildingId: 1,
    buildingName: "Test Building",
    buildingDescription: "A test building",
    buildingFieldName: "c_crystal",
    buildingETA: 3,
    buildingCost: "100 credits",
    buildingCostCrystal: 100,
    buildingCostTitanium: 50,
    needsFieldName: 0,
    hasInputField: "undefined",
    ...overrides,
  };
}

const defaultPlayer = createMockPaPlayer({ crystal: 5000, metal: 3000 });
const defaultBuilding = createBuilding();

const defaultProps = {
  isLoading: false,
  paPlayer: [defaultPlayer],
  building: defaultBuilding,
  mutate: mockMutate,
  actionText: "Build",
};

function renderInTable(ui: React.ReactElement) {
  return render(
    <table>
      <tbody>
        <tr>{ui}</tr>
      </tbody>
    </table>,
  );
}

// --- Tests ---

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ActionButton - null rendering", () => {
  it("renders null when player is undefined", () => {
    const { container } = renderInTable(
      <ActionButton {...defaultProps} paPlayer={[]} />,
    );
    expect(container.querySelector("td")).toBeNull();
  });

  it("renders null when building is undefined", () => {
    const { container } = renderInTable(
      <ActionButton {...defaultProps} building={undefined} />,
    );
    expect(container.querySelector("td")).toBeNull();
  });
});

describe("ActionButton - button rendering", () => {
  it("renders a Build button when player can afford it", () => {
    renderInTable(<ActionButton {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Build" })).toBeInTheDocument();
  });

  it("uses actionText prop for button label", () => {
    renderInTable(<ActionButton {...defaultProps} actionText="Train" />);
    expect(screen.getByRole("button", { name: "Train" })).toBeInTheDocument();
  });

  it("shows button when needsFieldName is 0 (skip field name check)", () => {
    const building = createBuilding({ needsFieldName: 0 });
    renderInTable(<ActionButton {...defaultProps} building={building} />);
    expect(screen.getByRole("button", { name: "Build" })).toBeInTheDocument();
  });

  it("shows button when building field value is 0 and needsFieldName is set", () => {
    const building = createBuilding({
      needsFieldName: 1,
      buildingFieldName: "c_crystal",
    });
    const player = createMockPaPlayer({
      crystal: 5000,
      metal: 3000,
      c_crystal: 0,
    });
    renderInTable(
      <ActionButton
        {...defaultProps}
        paPlayer={[player]}
        building={building}
      />,
    );
    expect(screen.getByRole("button", { name: "Build" })).toBeInTheDocument();
  });
});

describe("ActionButton - disabled states", () => {
  it("disables button when isLoading is true", () => {
    renderInTable(<ActionButton {...defaultProps} isLoading={true} />);
    expect(screen.getByRole("button", { name: "Build" })).toBeDisabled();
  });

  it("disables button when disabled prop is true", () => {
    renderInTable(<ActionButton {...defaultProps} disabled={true} />);
    expect(screen.getByRole("button", { name: "Build" })).toBeDisabled();
  });

  it("disables button when player cannot afford the building", () => {
    const poorPlayer = createMockPaPlayer({ crystal: 0, metal: 0 });
    renderInTable(<ActionButton {...defaultProps} paPlayer={[poorPlayer]} />);
    expect(screen.getByRole("button", { name: "Build" })).toBeDisabled();
  });
});

describe("ActionButton - click behavior", () => {
  it("calls mutate with correct parameters when clicked", () => {
    const building = createBuilding({
      hasInputField: "undefined",
      needsFieldName: 0,
    });
    renderInTable(<ActionButton {...defaultProps} building={building} />);
    fireEvent.click(screen.getByRole("button", { name: "Build" }));
    expect(mockMutate).toHaveBeenCalledWith({
      buildingFieldName: "c_crystal",
      buildingETA: 3,
      buildingCostCrystal: 100,
      buildingCostTitanium: 50,
      unitAmount: 0,
    });
  });

  it("shows toast error when hasInputField and amount is 0", () => {
    const building = createBuilding({ hasInputField: 1 });
    const inputRef = React.createRef<HTMLInputElement>();
    renderInTable(
      <ActionButton
        {...defaultProps}
        building={building}
        inputAmountRef={inputRef}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Build" }));
    expect(mockToast).toHaveBeenCalledWith({
      message: "Quantity needs to be more than 0",
      type: "error",
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows toast error when player cannot afford the amount requested", () => {
    const limitedPlayer = createMockPaPlayer({ crystal: 500, metal: 300 });
    const building = createBuilding({
      hasInputField: 1,
      buildingCostCrystal: 100,
      buildingCostTitanium: 50,
    });
    const inputRef = {
      current: { value: "10" },
    } as React.RefObject<HTMLInputElement>;
    renderInTable(
      <ActionButton
        {...defaultProps}
        paPlayer={[limitedPlayer]}
        building={building}
        inputAmountRef={inputRef}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Build" }));
    expect(mockToast).toHaveBeenCalledWith({
      message: "You can not afford this",
      type: "error",
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });
});

describe("ActionButton - building progress status", () => {
  it("shows status text when building is in progress", () => {
    const building = createBuilding({
      needsFieldName: 1,
      buildingFieldName: "c_crystal",
    });
    const player = createMockPaPlayer({
      crystal: 5000,
      metal: 3000,
      c_crystal: 5,
    });
    renderInTable(
      <ActionButton
        {...defaultProps}
        paPlayer={[player]}
        building={building}
      />,
    );
    expect(screen.getByText("5 ticks left")).toBeInTheDocument();
  });

  it('shows "Done" when building field value is 1', () => {
    const building = createBuilding({
      needsFieldName: 1,
      buildingFieldName: "c_crystal",
    });
    const player = createMockPaPlayer({
      crystal: 5000,
      metal: 3000,
      c_crystal: 1,
    });
    renderInTable(
      <ActionButton
        {...defaultProps}
        paPlayer={[player]}
        building={building}
      />,
    );
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("hides button when building is already in progress and needsFieldName is set", () => {
    const building = createBuilding({
      needsFieldName: 1,
      buildingFieldName: "c_crystal",
    });
    const player = createMockPaPlayer({
      crystal: 5000,
      metal: 3000,
      c_crystal: 3,
    });
    renderInTable(
      <ActionButton
        {...defaultProps}
        paPlayer={[player]}
        building={building}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Build" }),
    ).not.toBeInTheDocument();
  });
});

describe("ActionButton - tooltip behavior", () => {
  it("renders tooltip when player cannot afford building", () => {
    const poorPlayer = createMockPaPlayer({ crystal: 10, metal: 5 });
    const building = createBuilding({
      buildingCostCrystal: 100,
      buildingCostTitanium: 50,
    });
    const { container } = renderInTable(
      <ActionButton
        {...defaultProps}
        paPlayer={[poorPlayer]}
        building={building}
      />,
    );
    const tooltipDiv = container.querySelector("[title]");
    expect(tooltipDiv).toBeInTheDocument();
    expect(tooltipDiv?.getAttribute("title")).toContain("Need");
  });

  it('renders tooltip with "Action in progress..." when isLoading', () => {
    const { container } = renderInTable(
      <ActionButton {...defaultProps} isLoading={true} />,
    );
    const tooltipDiv = container.querySelector("[title]");
    expect(tooltipDiv?.getAttribute("title")).toBe("Action in progress...");
  });

  it("renders no tooltip when player can afford building and not loading", () => {
    const { container } = renderInTable(<ActionButton {...defaultProps} />);
    const tooltipDiv = container.querySelector("[title]");
    expect(tooltipDiv?.getAttribute("title")).toBeFalsy();
  });
});
