import { mockDeep, mockReset } from 'jest-mock-extended';
import { type PrismaClient, type PaUsers, type PaConstruct } from '@prisma/client';
import { z } from 'zod';
import { type inferProcedureInput } from '@trpc/server';
import { type AppRouter } from '../../../../server/api/root';


const prismaMock = mockDeep<PrismaClient>();

// Infer the context type from createTRPCContext
type Context = {
  prisma: PrismaClient;
  userId: string | null;
  username: string | null;
};

interface RouterContext extends Omit<Context, 'prisma'> {
  prisma: typeof prismaMock;
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

// Mock the entire trpc module
jest.mock('../../../../server/api/trpc', () => ({
  createTRPCRouter: (routes: Record<string, unknown>) => ({
    createCaller: (ctx: RouterContext) => {
      const router: Record<string, Function> = {};
      for (const [name, route] of Object.entries(routes)) {
        router[name] = async (input: unknown) => {
          return (route as { resolve: Function }).resolve({ 
            ctx: { ...ctx, prisma: prismaMock },
            input,
          });
        };
      }
      return router;
    },
  }),
  publicProcedure: {
    input: (schema: z.ZodType) => ({
      mutation: (resolver: (params: ProcedureParams<z.infer<typeof schema>>) => Promise<unknown>) => ({
        resolve: resolver
      })
    })
  },
  privateProcedure: {
    input: (schema: z.ZodType) => ({
      query: (resolver: (params: ProcedureParams<z.infer<typeof schema>>) => Promise<unknown>) => ({
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
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe('createPlayer', () => {
    it('creates a new player with construction', async () => {
      const mockPlayer: PlayerWithConstruction = {
        id: 1,
        nick: 'testPlayer',
        crystal: 0,
        metal: 0,
        energy: 0,
        r_energy: 0,
        sats: 0,
        infinitys: 0,
        wraiths: 0,
        warfrigs: 0,
        destroyers: 0,
        scorpions: 0,
        astropods: 0,
        cobras: 0,
        infinitys_base: 0,
        wraiths_base: 0,
        warfrigs_base: 0,
        destroyers_base: 0,
        scorpions_base: 0,
        astropods_base: 0,
        cobras_base: 0,
        p_scorpions: 0,
        p_scorpions_eta: 0,
        p_cobras: 0,
        p_cobras_eta: 0,
        missiles: 0,
        score: 0,
        asteroids: 0,
        asteroid_crystal: 0,
        asteroid_metal: 0,
        ui_roids: 0,
        war: 0,
        def: 0,
        wareta: 0,
        defeta: 0,
        r_imcrystal: 0,
        r_immetal: 0,
        r_iafs: 0,
        r_aaircraft: 0,
        r_tbeam: 0,
        r_uscan: 0,
        r_oscan: 0,
        p_infinitys: 0,
        p_infinitys_eta: 0,
        p_wraiths: 0,
        p_wraiths_eta: 0,
        p_warfrigs: 0,
        p_warfrigs_eta: 0,
        p_destroyers: 0,
        p_destroyers_eta: 0,
        p_missiles: 0,
        p_missiles_eta: 0,
        timer: 0,
        size: 0,
        p_astropods: 0,
        p_astropods_eta: 0,
        rcannons: 0,
        p_rcannons: 0,
        p_rcannons_eta: 0,
        avengers: 0,
        p_avengers: 0,
        p_avengers_eta: 0,
        lstalkers: 0,
        p_lstalkers: 0,
        p_lstalkers_eta: 0,
        r_odg: 0,
        sleep: 0,
        lastsleep: 0,
        closed: 0,
        tag: '',
        rank: 0,
        commander: 0,
        galname: '',
        galpic: '',
        motd: 0,
        vote: '',
        civilians: 0,
        tax: 0,
        credits: 0,
        newbie: 0,
        paConstructId: null,
        x: 0,
        y: 0,
        construction: {
          id: 1,
          c_crystal: 0,
          c_metal: 0,
          c_airport: 0,
          c_abase: 0,
          c_wstation: 0,
          c_amp1: 0,
          c_amp2: 0,
          c_warfactory: 0,
          c_destfact: 0,
          c_scorpfact: 0,
          c_energy: 0,
          c_odg: 0,
        }
      };

      prismaMock.paUsers.create.mockResolvedValue(mockPlayer);

      const result = await paUsersRouter.createPlayer.resolve({
        ctx: { prisma: prismaMock, userId: null, username: null },
        input: { nick: 'testPlayer' }
      });

      expect(prismaMock.paUsers.create).toHaveBeenCalledWith({
        data: {
          nick: 'testPlayer',
          construction: { create: {} },
        },
        include: { construction: true },
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
      const mockUser: PaUsers & { construction: PaConstruct } = {
        id: 1,
        nick: 'testPlayer',
        crystal: 0,
        metal: 0,
        energy: 0,
        r_energy: 0,
        sats: 0,
        infinitys: 0,
        wraiths: 0,
        warfrigs: 0,
        destroyers: 0,
        scorpions: 0,
        astropods: 0,
        cobras: 0,
        infinitys_base: 0,
        wraiths_base: 0,
        warfrigs_base: 0,
        destroyers_base: 0,
        scorpions_base: 0,
        astropods_base: 0,
        cobras_base: 0,
        p_scorpions: 0,
        p_scorpions_eta: 0,
        p_cobras: 0,
        p_cobras_eta: 0,
        missiles: 0,
        score: 0,
        asteroids: 0,
        asteroid_crystal: 0,
        asteroid_metal: 0,
        ui_roids: 0,
        war: 0,
        def: 0,
        wareta: 0,
        defeta: 0,
        r_imcrystal: 0,
        r_immetal: 0,
        r_iafs: 0,
        r_aaircraft: 0,
        r_tbeam: 0,
        r_uscan: 0,
        r_oscan: 0,
        p_infinitys: 0,
        p_infinitys_eta: 0,
        p_wraiths: 0,
        p_wraiths_eta: 0,
        p_warfrigs: 0,
        p_warfrigs_eta: 0,
        p_destroyers: 0,
        p_destroyers_eta: 0,
        p_missiles: 0,
        p_missiles_eta: 0,
        timer: 0,
        size: 0,
        p_astropods: 0,
        p_astropods_eta: 0,
        rcannons: 0,
        p_rcannons: 0,
        p_rcannons_eta: 0,
        avengers: 0,
        p_avengers: 0,
        p_avengers_eta: 0,
        lstalkers: 0,
        p_lstalkers: 0,
        p_lstalkers_eta: 0,
        r_odg: 0,
        sleep: 0,
        lastsleep: 0,
        closed: 0,
        tag: 'TEST',
        rank: 1,
        commander: 0,
        galname: '',
        galpic: '',
        motd: 0,
        vote: '',
        civilians: 0,
        tax: 0,
        credits: 0,
        newbie: 0,
        paConstructId: 1,
        x: 0,
        y: 0,
        construction: {
          id: 1,
          c_crystal: 0,
          c_metal: 0,
          c_airport: 0,
          c_abase: 0,
          c_wstation: 0,
          c_amp1: 0,
          c_amp2: 0,
          c_warfactory: 0,
          c_destfact: 0,
          c_scorpfact: 0,
          c_energy: 0,
          c_odg: 0,
        }
      };

      const mockConstruct: PaConstruct = {
        id: 1,
        c_crystal: 0,
        c_metal: 0,
        c_airport: 0,
        c_abase: 0,
        c_wstation: 0,
        c_amp1: 0,
        c_amp2: 0,
        c_warfactory: 0,
        c_destfact: 0,
        c_scorpfact: 0,
        c_energy: 0,
        c_odg: 0,
      };

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
