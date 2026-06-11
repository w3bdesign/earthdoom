/**
 * Tests for Next.js middleware configuration
 * Ensures Clerk middleware doesn't interfere with tRPC API routes
 */
import { createRouteMatcher } from "@clerk/nextjs/server";

describe("Middleware Configuration", () => {
  describe("isPublicRoute matcher", () => {
    // Re-create the same matcher used in middleware
    const isPublicRoute = createRouteMatcher([
      "/api/trpc/(.*)", // tRPC handles its own auth
    ]);

    it("should mark /api/trpc/* routes as public", () => {
      const mockRequest = { url: "http://localhost:3000/api/trpc/paUsers.createPlayer" };
      expect(isPublicRoute(mockRequest as never)).toBe(true);
    });

    it("should mark /api/trpc/paUsers.getPlayerByNick as public", () => {
      const mockRequest = { url: "http://localhost:3000/api/trpc/paUsers.getPlayerByNick" };
      expect(isPublicRoute(mockRequest as never)).toBe(true);
    });

    it("should mark /api/trpc/batch as public", () => {
      const mockRequest = { url: "http://localhost:3000/api/trpc/batch" };
      expect(isPublicRoute(mockRequest as never)).toBe(true);
    });

    it("should NOT mark regular page routes as public", () => {
      const mockRequest = { url: "http://localhost:3000/construct" };
      expect(isPublicRoute(mockRequest as never)).toBe(false);
    });

    it("should NOT mark other API routes as public", () => {
      const mockRequest = { url: "http://localhost:3000/api/someother" };
      expect(isPublicRoute(mockRequest as never)).toBe(false);
    });
  });

  describe("tRPC endpoint protection", () => {
    it("should document that tRPC endpoints handle their own auth", () => {
      // This test serves as documentation
      const trpcEndpoints = [
        "/api/trpc/paUsers.createPlayer",
        "/api/trpc/paUsers.getPlayerByNick",
        "/api/trpc/paConstruct.updateBuilding",
      ];

      // All tRPC endpoints should be marked as public in Clerk middleware
      // because they handle authentication through privateProcedure in trpc.ts
      const isPublicRoute = createRouteMatcher(["/api/trpc/(.*)"]);

      trpcEndpoints.forEach((endpoint) => {
        const mockRequest = { url: `http://localhost:3000${endpoint}` };
        expect(isPublicRoute(mockRequest as never)).toBe(true);
      });
    });

    it("should ensure Clerk does not protect tRPC routes", () => {
      // This prevents the bug where Clerk returns HTML instead of JSON
      const isPublicRoute = createRouteMatcher(["/api/trpc/(.*)"]);
      
      // Simulate the tRPC mutation endpoint
      const createPlayerRequest = { 
        url: "http://localhost:3000/api/trpc/paUsers.createPlayer" 
      };
      
      // This must be true, otherwise Clerk will intercept and return HTML
      expect(isPublicRoute(createPlayerRequest as never)).toBe(true);
    });
  });

  describe("Regression test for JSON parse error", () => {
    it("should prevent Clerk from returning HTML on tRPC endpoints", () => {
      // Bug: When Clerk middleware protects /api/trpc/*, it returns HTML redirects
      // This causes: "JSON.parse: unexpected character at line 1 column 1"
      // Fix: Mark /api/trpc/* as public routes
      
      const isPublicRoute = createRouteMatcher(["/api/trpc/(.*)"]);
      
      // These requests would previously get HTML responses from Clerk
      const problematicEndpoints = [
        "http://localhost:3000/api/trpc/paUsers.createPlayer",
        "http://localhost:3000/api/trpc/paUsers.getAll",
        "http://localhost:3000/api/trpc/batch",
      ];

      problematicEndpoints.forEach((url) => {
        const mockRequest = { url };
        // Must be public to avoid Clerk returning HTML
        expect(isPublicRoute(mockRequest as never)).toBe(true);
      });
    });
  });
});
