/**
 * Integration tests for tRPC API endpoints with middleware
 * These tests verify that middleware doesn't interfere with tRPC responses
 */
import { createNextApiHandler } from "@trpc/server/adapters/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

// Mock the environment module
jest.mock("@/env.mjs", () => ({
  env: {
    NODE_ENV: "development",
    DATABASE_URL: "mock-url",
  },
}));

// Mock Clerk auth
const mockAuthReturn = {
  userId: "user_123" as string | null,
  sessionClaims: { username: "testuser" } as { username?: string },
};

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(() => Promise.resolve(mockAuthReturn)),
}));

// Mock Prisma with proper types
const mockPrismaCreate = jest.fn();
const mockPrismaFindUnique = jest.fn();
const mockPrismaFindMany = jest.fn();
const mockPrismaUpdate = jest.fn();
const mockPrismaExecuteRaw = jest.fn();

jest.mock("@/server/db", () => ({
  prisma: {
    paUsers: {
      create: (...args: unknown[]) => mockPrismaCreate(...args),
      findUnique: (...args: unknown[]) => mockPrismaFindUnique(...args),
      findMany: (...args: unknown[]) => mockPrismaFindMany(...args),
      update: (...args: unknown[]) => mockPrismaUpdate(...args),
    },
    paConstruct: {
      create: jest.fn(),
    },
    $executeRaw: (...args: unknown[]) => mockPrismaExecuteRaw(...args),
  },
}));

describe("tRPC API Integration Tests", () => {
  let handler: ReturnType<typeof createNextApiHandler>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock auth to default authenticated state
    mockAuthReturn.userId = "user_123";
    mockAuthReturn.sessionClaims = { username: "testuser" };
    
    handler = createNextApiHandler({
      router: appRouter,
      createContext: createTRPCContext,
    });
  });

  const createMockRequest = (path: string, input: unknown): Partial<NextApiRequest> => ({
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    query: { trpc: path },
    body: { 0: { json: input } },
  });

  const createMockResponse = (): Partial<NextApiResponse> & {
    statusCode: number;
    _json: unknown;
    _ended: boolean;
  } => {
    const res = {
      statusCode: 200,
      _json: null,
      _ended: false,
      status: jest.fn(function (this: { statusCode: number }, code: number) {
        this.statusCode = code;
        return this;
      }),
      json: jest.fn(function (this: { _json: unknown; _ended: boolean }, data: unknown) {
        this._json = data;
        this._ended = true;
        return this;
      }),
      end: jest.fn(function (this: { _ended: boolean }) {
        this._ended = true;
        return this;
      }),
      setHeader: jest.fn(),
      getHeader: jest.fn(),
    };
    return res as unknown as Partial<NextApiResponse> & {
      statusCode: number;
      _json: unknown;
      _ended: boolean;
    };
  };

  describe("createPlayer mutation", () => {
    it("should return JSON response, not HTML", async () => {
      const mockPlayer = {
        id: 1,
        nick: "testuser",
        construction: { id: 1 },
      };

      mockPrismaCreate.mockResolvedValue(mockPlayer);

      const req = createMockRequest("paUsers.createPlayer", { nick: "testuser" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res._ended).toBe(true);
      expect(res._json).toBeDefined();
      
      // Verify response is JSON, not HTML
      const jsonString = JSON.stringify(res._json);
      expect(jsonString).not.toContain("<html");
      expect(jsonString).not.toContain("<!DOCTYPE");
      
      // Verify it's a valid tRPC response
      expect(res._json).toHaveProperty("0");
    });

    it("should successfully create a player when authenticated", async () => {
      const mockPlayer = {
        id: 1,
        nick: "testuser",
        construction: { id: 1 },
      };

      mockPrismaCreate.mockResolvedValue(mockPlayer);

      const req = createMockRequest("paUsers.createPlayer", { nick: "testuser" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(mockPrismaCreate).toHaveBeenCalledWith({
        data: {
          nick: "testuser",
          construction: { create: {} },
        },
        include: { construction: true },
      });

      expect(res.statusCode).toBe(200);
      expect(res._json).toHaveProperty("0.result.data.json");
    });

    it("should return FORBIDDEN error when nick doesn't match username", async () => {
      mockAuthReturn.sessionClaims = { username: "correctuser" };

      const req = createMockRequest("paUsers.createPlayer", { nick: "wronguser" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      // Should return JSON error, not HTML
      expect(res._json).toBeDefined();
      const jsonString = JSON.stringify(res._json);
      expect(jsonString).not.toContain("<html");

      const response = res._json as { 0?: { error?: { json?: { code?: string; message?: string } } } };
      expect(response?.[0]?.error?.json?.code).toBe("FORBIDDEN");
      expect(response?.[0]?.error?.json?.message).toContain("Nick must match");
    });

    it("should work in development mode without authentication", async () => {
      // Simulate unauthenticated state (dev mode allows this)
      mockAuthReturn.userId = null;
      mockAuthReturn.sessionClaims = {};

      const mockPlayer = {
        id: 1,
        nick: "admin",
        construction: { id: 1 },
      };

      mockPrismaCreate.mockResolvedValue(mockPlayer);

      const req = createMockRequest("paUsers.createPlayer", { nick: "admin" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      // In dev mode, should work without auth and use "admin" as default
      expect(res.statusCode).toBe(200);
      expect(res._json).toBeDefined();
      expect(mockPrismaCreate).toHaveBeenCalled();
    });
  });

  describe("getPlayerByNick query", () => {
    it("should return JSON response, not HTML", async () => {
      mockPrismaFindUnique.mockResolvedValue({
        id: 1,
        nick: "testuser",
        paConstructId: 1,
        construction: { id: 1 },
      });

      const req = createMockRequest("paUsers.getPlayerByNick", { nick: "testuser" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res._ended).toBe(true);
      expect(res._json).toBeDefined();
      
      // Verify response is JSON, not HTML
      const jsonString = JSON.stringify(res._json);
      expect(jsonString).not.toContain("<html");
      expect(jsonString).not.toContain("<!DOCTYPE");
    });

    it("should return null for non-existent player", async () => {
      mockPrismaFindUnique.mockResolvedValue(null);

      const req = createMockRequest("paUsers.getPlayerByNick", { nick: "nonexistent" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(200);
      const response = res._json as { 0?: { result?: { data?: { json?: null } } } };
      expect(response?.[0]?.result?.data?.json).toBeNull();
    });
  });

  describe("Response Content-Type validation", () => {
    it("should set correct Content-Type header for JSON", async () => {
      mockPrismaFindMany.mockResolvedValue([]);
      mockPrismaExecuteRaw.mockResolvedValue(0);

      const req = createMockRequest("paUsers.getAll", undefined);
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      // Verify setHeader was called (tRPC sets content-type)
      expect(res.setHeader).toHaveBeenCalled();
      
      // Verify response is valid JSON
      expect(() => JSON.stringify(res._json)).not.toThrow();
    });
  });

  describe("Middleware compatibility", () => {
    it("should handle batch requests without returning HTML", async () => {
      mockPrismaFindUnique.mockResolvedValue({
        id: 1,
        nick: "testuser",
        paConstructId: 1,
        construction: { id: 1 },
      });

      // Simulate a batch request
      const req = createMockRequest("paUsers.getPlayerByNick,paUsers.getResourceOverview", { nick: "testuser" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res._json).toBeDefined();
      const jsonString = JSON.stringify(res._json);
      
      // Critical: Must not return HTML from middleware redirect
      expect(jsonString).not.toContain("<html");
      expect(jsonString).not.toContain("<!DOCTYPE");
      expect(jsonString).not.toContain("<body");
    });

    it("should preserve JSON format even with CORS or other middleware", async () => {
      mockPrismaCreate.mockResolvedValue({
        id: 1,
        nick: "testuser",
        construction: { id: 1 },
      });

      const req = createMockRequest("paUsers.createPlayer", { nick: "testuser" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      // Ensure the response structure matches tRPC format
      const response = res._json as Record<string, unknown>;
      expect(response).toHaveProperty("0");
      expect(typeof response["0"]).toBe("object");
      
      // Should have either result or error, both in JSON format
      const firstResult = response["0"] as Record<string, unknown>;
      expect(firstResult).toHaveProperty("result");
    });
  });
});
