import React from "react";
import { render, screen } from "@testing-library/react";
import {
  calculateLand,
  renderMessage,
  isJSON,
  Stringifier,
  maximumToTrain,
  canAffordToTrain,
  renderIncomeData,
  getShipCount,
} from "../../utils/functions";
import type { PaPlayerBase } from "../../types/player";
import type { IProduction } from "../../components/features/Production/types/types";
import { createMockPaUser } from "../../test-utils/players";

const createMockPlayer = (
  overrides: Partial<PaPlayerBase> = {},
): PaPlayerBase =>
  createMockPaUser({
    nick: "Test",
    sats: 10,
    infinitys: 5,
    wraiths: 3,
    warfrigs: 2,
    destroyers: 1,
    scorpions: 4,
    astropods: 6,
    ...overrides,
  }) as PaPlayerBase;

describe("calculateLand", () => {
  it("returns 0 for 0 search attempts", () => {
    expect(calculateLand(0)).toBe(0);
  });

  it("returns a non-negative number for positive search attempts", () => {
    const result = calculateLand(100);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it("returns a number for large search attempts", () => {
    const result = calculateLand(1000);
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

describe("renderMessage", () => {
  it("renders title and message", () => {
    const { container } = render(
      <>
        {renderMessage({ title: "Test Title", message: "Test message body" })}
      </>,
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test message body")).toBeInTheDocument();
    expect(container).not.toBeEmptyDOMElement();
  });
});

describe("isJSON", () => {
  it("returns true for valid JSON object", () => {
    expect(isJSON('{"key": "value"}')).toBe(true);
  });

  it("returns true for valid JSON array", () => {
    expect(isJSON("[1, 2, 3]")).toBe(true);
  });

  it("returns false for plain string", () => {
    expect(isJSON("hello")).toBe(false);
  });

  it("returns false for number string", () => {
    expect(isJSON("123")).toBe(false);
  });

  it("returns false for null string", () => {
    expect(isJSON("null")).toBe(false);
  });

  it("returns false for invalid JSON", () => {
    expect(isJSON("{invalid}")).toBe(false);
  });
});

describe("Stringifier", () => {
  it("renders string value", () => {
    render(<Stringifier value="hello" />);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders number value as string", () => {
    render(<Stringifier value={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders empty string for undefined", () => {
    const { container } = render(<Stringifier value={undefined} />);
    expect(container.querySelector("span")).toHaveTextContent("");
  });

  it("renders empty string for null", () => {
    const { container } = render(<Stringifier value={null} />);
    expect(container.querySelector("span")).toHaveTextContent("");
  });

  it("renders empty string for object", () => {
    const { container } = render(<Stringifier value={{ key: "value" }} />);
    expect(container.querySelector("span")).toHaveTextContent("");
  });
});

describe("maximumToTrain", () => {
  const mockProduction: IProduction = {
    buildingId: 1,
    buildingName: "Unit",
    buildingDescription: "A unit",
    buildingCost: "100 credits",
    buildingCostCrystal: 100,
    buildingCostTitanium: 50,
    buildingETA: 1,
    buildingFieldName: "infinitys",
    buildingFieldNameETA: "p_infinitys_eta",
    buildingRequirement: "c_airport",
  };

  it("returns correct max based on crystal and titanium", () => {
    const player = createMockPlayer({ crystal: 500, metal: 200 });
    const result = maximumToTrain(player, mockProduction);
    // 500/100 = 5, 200/50 = 4, min = 4
    expect(result).toBe(4);
  });

  it("returns max based on crystal when titanium cost is 0", () => {
    const prodNoCost = { ...mockProduction, buildingCostTitanium: 0 };
    const player = createMockPlayer({ crystal: 300, metal: 0 });
    const result = maximumToTrain(player, prodNoCost);
    expect(result).toBe(3);
  });

  it("returns 0 when player cannot afford any", () => {
    const player = createMockPlayer({ crystal: 50, metal: 25 });
    const result = maximumToTrain(player, mockProduction);
    expect(result).toBe(0);
  });
});

describe("canAffordToTrain", () => {
  it("returns true when player can afford", () => {
    const player = createMockPlayer({ crystal: 500, metal: 300 });
    expect(canAffordToTrain([player], 100, 50, 2)).toBe(true);
  });

  it("returns false when player cannot afford crystal cost", () => {
    const player = createMockPlayer({ crystal: 50, metal: 300 });
    expect(canAffordToTrain([player], 100, 50, 1)).toBe(false);
  });

  it("returns false when player cannot afford titanium cost", () => {
    const player = createMockPlayer({ crystal: 500, metal: 10 });
    expect(canAffordToTrain([player], 100, 50, 1)).toBe(false);
  });

  it("returns false when empty player array", () => {
    expect(canAffordToTrain([], 100, 50, 1)).toBe(false);
  });

  it("returns true when crystal cost is 0", () => {
    const player = createMockPlayer({ crystal: 0, metal: 300 });
    expect(canAffordToTrain([player], 0, 50, 1)).toBe(true);
  });

  it("returns true when titanium cost is 0", () => {
    const player = createMockPlayer({ crystal: 500, metal: 0 });
    expect(canAffordToTrain([player], 100, 0, 1)).toBe(true);
  });

  it("considers land when considerLand is true", () => {
    const player = createMockPlayer({
      crystal: 5000,
      metal: 3000,
      ui_roids: 2,
    });
    expect(canAffordToTrain([player], 100, 50, 5, true)).toBe(false);
  });

  it("allows training within land limit when considerLand is true", () => {
    const player = createMockPlayer({
      crystal: 5000,
      metal: 3000,
      ui_roids: 10,
    });
    expect(canAffordToTrain([player], 100, 50, 5, true)).toBe(true);
  });

  it("defaults unitAmount to 1 when 0 is passed", () => {
    const player = createMockPlayer({ crystal: 500, metal: 300 });
    expect(canAffordToTrain([player], 100, 50, 0)).toBe(true);
  });
});

describe("renderIncomeData", () => {
  it("returns chart data with correct labels", () => {
    const player = createMockPlayer({
      asteroid_metal: 5,
      civilians: 2000,
      sats: 10,
      r_immetal: 0,
      r_imcrystal: 0,
    });
    // Need to cast since renderIncomeData needs PaUserWithConstruct
    const result = renderIncomeData(
      player as Parameters<typeof renderIncomeData>[0],
    );
    expect(result.labels).toEqual(["Titanium", "Credits", "Energy"]);
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0]!.data).toHaveLength(3);
  });

  it("calculates titanium income from asteroid_metal", () => {
    const player = createMockPlayer({
      asteroid_metal: 10,
      civilians: 1000,
      sats: 0,
      r_immetal: 0,
      r_imcrystal: 0,
    });
    const result = renderIncomeData(
      player as Parameters<typeof renderIncomeData>[0],
    );
    // 10 * 60 = 600
    expect(result.datasets[0]!.data[0]).toBe(600);
  });

  it("adds 10% titanium bonus when r_immetal is set", () => {
    const player = createMockPlayer({
      asteroid_metal: 10,
      civilians: 1000,
      sats: 0,
      r_immetal: 1,
      r_imcrystal: 0,
    });
    const result = renderIncomeData(
      player as Parameters<typeof renderIncomeData>[0],
    );
    // 10 * 60 + floor(10 * 0.1) = 600 + 1 = 601
    expect(result.datasets[0]!.data[0]).toBe(601);
  });

  it("calculates energy income from sats", () => {
    const player = createMockPlayer({
      asteroid_metal: 0,
      civilians: 1000,
      sats: 5,
      r_immetal: 0,
      r_imcrystal: 0,
    });
    const result = renderIncomeData(
      player as Parameters<typeof renderIncomeData>[0],
    );
    // 5 * 45 = 225
    expect(result.datasets[0]!.data[2]).toBe(225);
  });
});

describe("getShipCount", () => {
  it("returns total ship count", () => {
    const player = createMockPlayer({
      astropods: 6,
      infinitys: 5,
      wraiths: 3,
      warfrigs: 2,
      destroyers: 1,
      scorpions: 4,
    });
    expect(getShipCount(player)).toBe(21);
  });

  it("returns 0 when no ships", () => {
    const player = createMockPlayer({
      astropods: 0,
      infinitys: 0,
      wraiths: 0,
      warfrigs: 0,
      destroyers: 0,
      scorpions: 0,
    });
    expect(getShipCount(player)).toBe(0);
  });
});
