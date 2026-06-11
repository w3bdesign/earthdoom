/**
 * Integration tests for tRPC API endpoints with middleware
 * These tests verify that middleware doesn't interfere with tRPC responses
 */
import { createNextApiHandler } from "@trpc/server/adapters/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

// Mock Clerk auth
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

// Mock Prisma
jest.mock("@/server/db", () => ({
  prisma: {
    paUsers: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    paConstruct: {
      create: jest.fn(),
    },
    $executeRaw: jest.fn(),
  },
}));

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("tRPC API Integration Tests", () => {
  let handler: ReturnType<typeof createNextApiHandler>;

  beforeEach(() => {
    jest.clearAllMocks();
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
      status: jest.fn(function (code: number) {
        this.statusCode = code;
        return this;
      }),
      json: jest.fn(function (data: unknown) {
        this._json = data;
        this._ended = true;
        return this;
      }),
      end: jest.fn(function () {
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
      mockAuth.mockResolvedValue({
        userId: "user_123",
        sessionClaims: { username: "testuser" },
      } as never);

      mockPrisma.paUsers.create.mockResolvedValue({
        id: 1,
        nick: "testuser",
        construction: {},
      } as never);

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
      mockAuth.mockResolvedValue({
        userId: "user_123",
        sessionClaims: { username: "testuser" },
      } as never);

      const mockPlayer = {
        id: 1,
        nick: "testuser",
        construction: { id: 1 },
      };

      mockPrisma.paUsers.create.mockResolvedValue(mockPlayer as never);

      const req = createMockRequest("paUsers.createPlayer", { nick: "testuser" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(mockPrisma.paUsers.create).toHaveBeenCalledWith({
        data: {
          nick: "testuser",
          construction: { create: {} },
        },
        include: { construction: true },
      });

      expect(res.statusCode).toBe(200);
      expect(res._json).toHaveProperty("0.result.data.json");
    });

    it("should return UNAUTHORIZED error when not authenticated in production", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      mockAuth.mockResolvedValue({
        userId: null,
        sessionClaims: {},
      } as never);

      const req = createMockRequest("paUsers.createPlayer", { nick: "testuser" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      // Should still return JSON, not HTML
      expect(res._json).toBeDefined();
      const jsonString = JSON.stringify(res._json);
      expect(jsonString).not.toContain("<html");

      // Should have error in response
      const response = res._json as { 0?: { error?: { json?: { code?: string } } } };
      expect(response?.[0]?.error?.json?.code).toBe("UNAUTHORIZED");

      process.env.NODE_ENV = originalEnv;
    });

    it("should return FORBIDDEN error when nick doesn't match username", async () => {
      mockAuth.mockResolvedValue({
        userId: "user_123",
        sessionClaims: { username: "correctuser" },
      } as never);

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
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      mockAuth.mockResolvedValue({
        userId: null,
        sessionClaims: {},
      } as never);

      const mockPlayer = {
        id: 1,
        nick: "admin",
        construction: { id: 1 },
      };

      mockPrisma.paUsers.create.mockResolvedValue(mockPlayer as never);

      const req = createMockRequest("paUsers.createPlayer", { nick: "admin" });
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      // In dev mode, should work without auth and use "admin" as default
      expect(res.statusCode).toBe(200);
      expect(res._json).toBeDefined();
      expect(mockPrisma.paUsers.create).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("getPlayerByNick query", () => {
    it("should return JSON response, not HTML", async () => {
      mockAuth.mockResolvedValue({
        userId: "user_123",
        sessionClaims: { username: "testuser" },
      } as never);

      mockPrisma.paUsers.findUnique.mockResolvedValue({
        id: 1,
        nick: "testuser",
        paConstructId: 1,
        construction: { id: 1 },
      } as never);

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
      mockAuth.mockResolvedValue({
        userId: "user_123",
        sessionClaims: { username: "testuser" },
      } as never);

      mockPrisma.paUsers.findUnique.mockResolvedValue(null);

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
      mockAuth.mockResolvedValue({
        userId: "user_123",
        sessionClaims: { username: "testuser" },
      } as never);

      mockPrisma.paUsers.findMany.mockResolvedValue([]);
      mockPrisma.$executeRaw.mockResolvedValue(0 as never);

      const req = createMockRequest("paUsers.getAll", undefined);
      const res = createMockResponse();

      await handler(req as NextApiRequest, res as NextApiResponse);

      // Verify setHeader was called (tRPC sets content-type)
      expect(res.setHeader).toHaveBeenCalled();
      
      // Verify response is valid JSON
      expect(() => JSON.stringify(res._json)).not.toThrow();
    });
  });
});
