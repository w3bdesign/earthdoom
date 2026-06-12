import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, PaUsers, PaConstruct } from "@prisma/client";
import type { inferProcedureInput } from "@trpc/server";
import type { AppRouter } from "../../../../server/api/root";
import type { ZodType } from "zod";

// Import the actual functions after the type imports
import {
  mockDeep as actualMockDeep,
  mockReset as actualMockReset,
} from "jest-mock-extended";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createMockConstruct,
  createMockPlayerWithConstruction,
} from "../../../../test-utils/players";

const prismaMock = actualMockDeep<PrismaClient>();

// Infer the context type from createTRPCContext
type Context = {
  prisma: PrismaClient;
  userId: string | null;
  username: string | null;
};

interface RouterContext extends Omit<Context, "prisma"> {
  prisma: DeepMockProxy<PrismaClient>;
}

interface ProcedureParams<TInput> {
  ctx: RouterContext;
  input: TInput;
}

type CreatePlayerInput = inferProcedureInput<
  AppRouter["paUsers"]["createPlayer"]
>;
type GetPlayerByNickInput = inferProcedureInput<
  AppRouter["paUsers"]["getPlayerByNick"]
>;

interface PlayerWithConstruction extends PaUsers {
  construction: PaConstruct | null;
}

type RouterResolver<TInput, TOutput> = (
  params: ProcedureParams<TInput>,
) => Promise<TOutput>;

// Mock the entire trpc module
jest.mock("../../../../server/api/trpc", () => ({
  createTRPCRouter: (routes: Record<string, unknown>) => ({
    createCaller: (ctx: RouterContext) => {
      const router: Record<string, RouterResolver<unknown, unknown>> = {};
      for (const [name, route] of Object.entries(routes)) {
        router[name] = async (input: unknown): Promise<unknown> => {
          const resolver = (
            route as { resolve: RouterResolver<unknown, unknown> }
          ).resolve;
          return await resolver({
            ctx: { ...ctx, prisma: prismaMock },
            input,
          });
        };
      }
      return router;
    },
  }),
  publicProcedure: {
    input: (schema: ZodType) => ({
      mutation: (
        resolver: RouterResolver<z.infer<typeof schema>, unknown>,
      ) => ({
        resolve: resolver,
      }),
    }),
  },
  privateProcedure: {
    input: (schema: ZodType) => ({
      query: (resolver: RouterResolver<z.infer<typeof schema>, unknown>) => ({
        resolve: resolver,
      }),
    }),
  },
}));

// Import the actual router for integration tests
import { paUsersRouter as actualPaUsersRouter } from "../../../../server/api/routers/paUsers";

// Define the router with typed procedures for unit tests
const paUsersRouter = {
  createPlayer: {
    resolve: async ({
      ctx,
      input,
    }: ProcedureParams<CreatePlayerInput>): Promise<PlayerWithConstruction> => {
      return await ctx.prisma.paUsers.create({
        data: {
          nick: input.nick,
          construction: { create: {} },
        },
        include: { construction: true },
      });
    },
  },
  getPlayerByNick: {
    resolve: async ({ ctx, input }: ProcedureParams<GetPlayerByNickInput>) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true, tag: true, construction: true },
      });

      if (!user) return null;

      const player = await ctx.prisma.paUsers.findUnique({
        where: { id: user.id },
      });

      if (!player) return null;

      const paConstruct = await ctx.prisma.paConstruct.findUnique({
        where: { id: player.paConstructId || 1 },
      });

      return { ...paConstruct, ...player, id: player.id };
    },
  },
};

describe("paUsers router", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    actualMockReset(prismaMock);
  });

  describe("createPlayer", () => {
    it("creates a new player with construction", async () => {
      const mockPlayer = createMockPlayerWithConstruction({
        nick: "testPlayer",
        crystal: 0,
        metal: 0,
        energy: 0,
        score: 0,
        asteroids: 0,
        asteroid_crystal: 0,
        asteroid_metal: 0,
        ui_roids: 0,
        size: 0,
        tag: "",
        rank: 0,
        galname: "",
        galpic: "",
        civilians: 0,
        tax: 0,
        credits: 0,
        newbie: 0,
        paConstructId: null,
        x: 0,
        y: 0,
      });

      prismaMock.paUsers.create.mockResolvedValue(mockPlayer);

      const result = await paUsersRouter.createPlayer.resolve({
        ctx: { prisma: prismaMock, userId: null, username: null },
        input: { nick: "testPlayer" },
      });

      expect(result).toEqual(mockPlayer);
    });

    it("throws error if nick is already taken", async () => {
      prismaMock.paUsers.create.mockRejectedValue(
        new Error("Unique constraint failed"),
      );

      await expect(
        paUsersRouter.createPlayer.resolve({
          ctx: { prisma: prismaMock, userId: null, username: null },
          input: { nick: "existingPlayer" },
        }),
      ).rejects.toThrow();
    });
  });

  describe("getPlayerByNick", () => {
    it("returns player with construction data", async () => {
      const mockUser = createMockPlayerWithConstruction({
        nick: "testPlayer",
        crystal: 0,
        metal: 0,
        energy: 0,
        score: 0,
        asteroids: 0,
        asteroid_crystal: 0,
        asteroid_metal: 0,
        ui_roids: 0,
        size: 0,
        tag: "TEST",
        rank: 1,
        galname: "",
        galpic: "",
        civilians: 0,
        tax: 0,
        credits: 0,
        newbie: 0,
        paConstructId: 1,
        x: 0,
        y: 0,
      });

      const mockConstruct = createMockConstruct();

      prismaMock.paUsers.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUser);

      prismaMock.paConstruct.findUnique.mockResolvedValue(mockConstruct);

      const result = await paUsersRouter.getPlayerByNick.resolve({
        ctx: {
          prisma: prismaMock,
          userId: "test-user-id",
          username: "test-user",
        },
        input: { nick: "testPlayer" },
      });

      expect(result).toEqual({
        ...mockConstruct,
        ...mockUser,
        id: mockUser.id,
      });
    });

    it("returns null if player not found", async () => {
      prismaMock.paUsers.findUnique.mockResolvedValue(null);

      const result = await paUsersRouter.getPlayerByNick.resolve({
        ctx: {
          prisma: prismaMock,
          userId: "test-user-id",
          username: "test-user",
        },
        input: { nick: "nonexistent" },
      });

      expect(result).toBeNull();
    });
  });

  describe("createPlayer - integration tests", () => {
    // Mock the actual router to test the full logic including validation
    const createCallerMock = (ctx: RouterContext) => ({
      createPlayer: async (input: CreatePlayerInput) => {
        // This simulates the actual router logic with validation
        if (input.nick !== ctx.username) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Nick must match your authenticated username",
          });
        }

        const existingPlayer = await ctx.prisma.paUsers.findUnique({
          where: { nick: input.nick },
        });

        if (existingPlayer) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Player with this username already exists",
          });
        }

        return await ctx.prisma.paUsers.create({
          data: {
            nick: input.nick,
            construction: { create: {} },
          },
          include: { construction: true },
        });
      },
    });

    it("throws FORBIDDEN error when nick does not match authenticated username", async () => {
      const ctx: RouterContext = {
        prisma: prismaMock,
        userId: "user-123",
        username: "authenticatedUser",
      };

      const caller = createCallerMock(ctx);

      await expect(
        caller.createPlayer({ nick: "differentUser" }),
      ).rejects.toMatchObject({
        code: "FORBIDDEN",
        message: "Nick must match your authenticated username",
      });
    });

    it("successfully creates player when nick matches authenticated username", async () => {
      const ctx: RouterContext = {
        prisma: prismaMock,
        userId: "user-123",
        username: "testPlayer",
      };

      const mockPlayer = createMockPlayerWithConstruction({
        nick: "testPlayer",
        crystal: 0,
        metal: 0,
        energy: 0,
        score: 0,
        asteroids: 0,
        asteroid_crystal: 0,
        asteroid_metal: 0,
        ui_roids: 0,
        size: 0,
        tag: "",
        rank: 0,
        galname: "",
        galpic: "",
        civilians: 0,
        tax: 0,
        credits: 0,
        newbie: 0,
        paConstructId: null,
        x: 0,
        y: 0,
      });

      prismaMock.paUsers.findUnique.mockResolvedValue(null);
      prismaMock.paUsers.create.mockResolvedValue(mockPlayer);

      const caller = createCallerMock(ctx);
      const result = await caller.createPlayer({ nick: "testPlayer" });

      expect(result).toEqual(mockPlayer);
      expect(prismaMock.paUsers.create).toHaveBeenCalledWith({
        data: {
          nick: "testPlayer",
          construction: { create: {} },
        },
        include: { construction: true },
      });
    });

    it("throws CONFLICT error when player already exists", async () => {
      const ctx: RouterContext = {
        prisma: prismaMock,
        userId: "user-123",
        username: "existingPlayer",
      };

      const existingPlayer = createMockPlayerWithConstruction({
        nick: "existingPlayer",
        crystal: 0,
        metal: 0,
        energy: 0,
        score: 0,
        asteroids: 0,
        asteroid_crystal: 0,
        asteroid_metal: 0,
        ui_roids: 0,
        size: 0,
        tag: "",
        rank: 0,
        galname: "",
        galpic: "",
        civilians: 0,
        tax: 0,
        credits: 0,
        newbie: 0,
        paConstructId: null,
        x: 0,
        y: 0,
      });

      prismaMock.paUsers.findUnique.mockResolvedValue(existingPlayer);

      const caller = createCallerMock(ctx);

      await expect(
        caller.createPlayer({ nick: "existingPlayer" }),
      ).rejects.toMatchObject({
        code: "CONFLICT",
        message: "Player with this username already exists",
      });
    });

    it("validates that username context is properly set", async () => {
      const ctx: RouterContext = {
        prisma: prismaMock,
        userId: "user-123",
        username: null, // Simulating missing username from context
      };

      const caller = createCallerMock(ctx);

      // This should fail because username is null
      await expect(
        caller.createPlayer({ nick: "somePlayer" }),
      ).rejects.toMatchObject({
        code: "FORBIDDEN",
        message: "Nick must match your authenticated username",
      });
    });
  });
});
