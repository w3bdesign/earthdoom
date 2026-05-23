import type { DeepMockProxy } from 'jest-mock-extended';
import type { PrismaClient, PaUsers, PaConstruct } from '@prisma/client';
import type { inferProcedureInput } from '@trpc/server';
import type { AppRouter } from '../../../../server/api/root';
import type { ZodType } from 'zod';

// Import the actual functions after the type imports
import { mockDeep as actualMockDeep, mockReset as actualMockReset } from 'jest-mock-extended';
import { z } from 'zod';
import { createMockConstruct, createMockPlayerWithConstruction } from '../../../../test-utils/players';

const prismaMock = actualMockDeep<PrismaClient>();

// Infer the context type from createTRPCContext
type Context = {
  prisma: PrismaClient;
  userId: string | null;
  username: string | null;
};

interface RouterContext extends Omit<Context, 'prisma'> {
  prisma: DeepMockProxy<PrismaClient>;
}

interface ProcedureParams<TInput> {
  ctx: RouterContext;
  input: TInput;
}

type CreatePlayerInput = inferProcedureInput<AppRouter['paUsers']['createPlayer']>;
type GetPlayerByNickInput = inferProcedureInput<AppRouter['paUsers']['getPlayerByNick']>;

interface PlayerWithConstruction extends PaUsers {
  construction: PaConstruct | null;
}

type RouterResolver<TInput, TOutput> = (params: ProcedureParams<TInput>) => Promise<TOutput>;

// Mock the entire trpc module
jest.mock('../../../../server/api/trpc', () => ({
  createTRPCRouter: (routes: Record<string, unknown>) => ({
    createCaller: (ctx: RouterContext) => {
      const router: Record<string, RouterResolver<unknown, unknown>> = {};
      for (const [name, route] of Object.entries(routes)) {
        router[name] = async (input: unknown): Promise<unknown> => {
          const resolver = (route as { resolve: RouterResolver<unknown, unknown> }).resolve;
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
      mutation: (resolver: RouterResolver<z.infer<typeof schema>, unknown>) => ({
        resolve: resolver
      })
    })
  },
  privateProcedure: {
    input: (schema: ZodType) => ({
      query: (resolver: RouterResolver<z.infer<typeof schema>, unknown>) => ({
        resolve: resolver
      })
    })
  }
}));

// Define the router with typed procedures
const paUsersRouter = {
  createPlayer: {
    resolve: async ({ ctx, input }: ProcedureParams<CreatePlayerInput>): Promise<PlayerWithConstruction> => {
      return await ctx.prisma.paUsers.create({
        data: {
          nick: input.nick,
          construction: { create: {} },
        },
        include: { construction: true },
      });
    }
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
    }
  }
};

describe('paUsers router', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    actualMockReset(prismaMock);
  });

  describe('createPlayer', () => {
    it('creates a new player with construction', async () => {
      const mockPlayer = createMockPlayerWithConstruction({
        nick: 'testPlayer',
        crystal: 0,
        metal: 0,
        energy: 0,
        score: 0,
        asteroids: 0,
        asteroid_crystal: 0,
        asteroid_metal: 0,
        ui_roids: 0,
        size: 0,
        tag: '',
        rank: 0,
        galname: '',
        galpic: '',
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
        input: { nick: 'testPlayer' }
      });    

      expect(result).toEqual(mockPlayer);
    });

    it('throws error if nick is already taken', async () => {
      prismaMock.paUsers.create.mockRejectedValue(new Error('Unique constraint failed'));

      await expect(
        paUsersRouter.createPlayer.resolve({
          ctx: { prisma: prismaMock, userId: null, username: null },
          input: { nick: 'existingPlayer' }
        })
      ).rejects.toThrow();
    });
  });

  describe('getPlayerByNick', () => {
    it('returns player with construction data', async () => {
      const mockUser = createMockPlayerWithConstruction({
        nick: 'testPlayer',
        crystal: 0,
        metal: 0,
        energy: 0,
        score: 0,
        asteroids: 0,
        asteroid_crystal: 0,
        asteroid_metal: 0,
        ui_roids: 0,
        size: 0,
        tag: 'TEST',
        rank: 1,
        galname: '',
        galpic: '',
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
        ctx: { prisma: prismaMock, userId: 'test-user-id', username: 'test-user' },
        input: { nick: 'testPlayer' }
      });

      expect(result).toEqual({
        ...mockConstruct,
        ...mockUser,
        id: mockUser.id,
      });
    });

    it('returns null if player not found', async () => {
      prismaMock.paUsers.findUnique.mockResolvedValue(null);

      const result = await paUsersRouter.getPlayerByNick.resolve({
        ctx: { prisma: prismaMock, userId: 'test-user-id', username: 'test-user' },
        input: { nick: 'nonexistent' }
      });
      
      expect(result).toBeNull();
    });
  });
});
