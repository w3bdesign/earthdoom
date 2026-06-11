/**
 * Middleware Configuration Validation Tests
 * 
 * These tests validate the actual middleware configuration to prevent
 * Clerk from intercepting tRPC API calls and returning HTML instead of JSON.
 * 
 * BUG PREVENTED: Without proper configuration, Clerk middleware intercepts
 * /api/trpc/* routes and returns HTML redirects, causing:
 * "JSON.parse: unexpected character at line 1 column 1 of the JSON data"
 * 
 * SOLUTION: Mark /api/trpc/* as public routes in middleware.ts, allowing
 * tRPC to handle its own authentication via privateProcedure.
 */

import * as fs from "fs";
import * as path from "path";

describe("Middleware Configuration - Validation Tests", () => {
  let middlewareContent: string;

  beforeAll(() => {
    // Read the actual middleware.ts file
    const middlewarePath = path.join(__dirname, "../../middleware.ts");
    middlewareContent = fs.readFileSync(middlewarePath, "utf-8");
  });

  describe("Critical Configuration", () => {
    it("should mark /api/trpc/* routes as public to prevent HTML responses", () => {
      // This test will FAIL if the middleware doesn't include the tRPC route
      // and will PASS once we add it
      const hasTrpcPublicRoute = middlewareContent.includes('"/api/trpc/(.*)"');
      
      expect(hasTrpcPublicRoute).toBe(true);
    });

    it("should NOT use only placeholder routes", () => {
      // This ensures we're not just using the default placeholder
      const hasTrpcRoute = middlewareContent.includes('"/api/trpc/(.*)"');
      
      expect(hasTrpcRoute).toBe(true);
    });
  });
});
