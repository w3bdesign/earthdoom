import { isActive } from "../../../../components/common/Navigation/isActive";

describe("isActive", () => {
  it("matches the home link only on the home page", () => {
    expect(isActive("/", "/")).toBe(true);
    expect(isActive("/", "/mail")).toBe(false);
  });

  it("matches other links on their own page and sub-pages", () => {
    expect(isActive("/mail", "/mail")).toBe(true);
    expect(isActive("/mail", "/mail/123")).toBe(true);
    expect(isActive("/mail", "/military")).toBe(false);
  });

  it("is false when the path is unknown", () => {
    expect(isActive("/mail", undefined)).toBe(false);
  });
});
