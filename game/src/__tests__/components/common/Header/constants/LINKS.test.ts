import { LINKS } from "../../../../../components/common/Header/constants/LINKS";

describe("LINKS constant", () => {
  it("is an array of link objects", () => {
    expect(Array.isArray(LINKS)).toBe(true);
    expect(LINKS.length).toBeGreaterThan(0);
  });

  it("each link has required properties", () => {
    LINKS.forEach((link) => {
      expect(link).toHaveProperty("id");
      expect(link).toHaveProperty("href");
      expect(link).toHaveProperty("text");
      expect(typeof link.id).toBe("number");
      expect(typeof link.href).toBe("string");
      expect(typeof link.text).toBe("string");
    });
  });

  it("contains the Main link pointing to /", () => {
    const mainLink = LINKS.find((l) => l.text === "Main");
    expect(mainLink).toBeDefined();
    expect(mainLink?.href).toBe("/");
  });

  it("contains the Manual link with external target", () => {
    const manualLink = LINKS.find((l) => l.text === "Manual");
    expect(manualLink).toBeDefined();
    expect(manualLink?.href).toBe("https://earthdoom.com/manual");
    expect(manualLink?.target).toBe("_new");
  });

  it("contains all expected navigation links", () => {
    const expectedTexts = [
      "Main",
      "Manual",
      "News",
      "Mail",
      "Production",
      "Construct",
      "Research",
      "Energy",
      "Resources",
      "Military",
      "Spying",
      "Ranking",
      "Alliance",
      "Logout",
    ];
    const linkTexts = LINKS.map((l) => l.text);
    expectedTexts.forEach((text) => {
      expect(linkTexts).toContain(text);
    });
  });

  it("has unique ids for each link", () => {
    const ids = LINKS.map((l) => l.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("has the Logout link as the last item", () => {
    const lastLink = LINKS[LINKS.length - 1];
    expect(lastLink?.text).toBe("Logout");
    expect(lastLink?.href).toBe("/logout");
  });

  it("internal links start with /", () => {
    const internalLinks = LINKS.filter((l) => !l.href.startsWith("http"));
    internalLinks.forEach((link) => {
      expect(link.href).toMatch(/^\//);
    });
  });

  it("only the Manual link has a target property", () => {
    const linksWithTarget = LINKS.filter((l) => l.target !== undefined);
    expect(linksWithTarget).toHaveLength(1);
    expect(linksWithTarget[0]?.text).toBe("Manual");
  });
});
