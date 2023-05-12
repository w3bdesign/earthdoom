import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const paUsersRouter = createTRPCRouter({
  createPlayer: publicProcedure
    .input(z.object({ nick: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.paUsers.create({ data: { nick: input.nick } });
    }),
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.paUsers.findMany({
      orderBy: {
        rank: "asc",
      },
    });
  }),
  getResourceOverview: privateProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      const player = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: {
          id: true,
          metal: true,
          crystal: true,
          energy: true,
          civilians: true,
          asteroid_crystal: true,
          asteroid_metal: true,
          score: true,
          rank: true,
          nick: true,
        },
      });

      return player;
    }),
  getAttackedPlayer: privateProcedure
    .input(z.object({ Warid: z.number() }))
    .query(async ({ ctx, input }) => {
      const defender = await ctx.prisma.paUsers.findUnique({
        where: { id: input.Warid },
        select: { id: true, nick: true },
      });

      return defender;
    }),
  getDefendedPlayer: privateProcedure
    .input(z.object({ Defid: z.number() }))
    .query(async ({ ctx, input }) => {
      const defender = await ctx.prisma.paUsers.findUnique({
        where: { id: input.Defid },
        select: { id: true, nick: true },
      });

      return defender;
    }),
  getPlayerByNick: privateProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true, tag: true },
      });

      const player = await ctx.prisma.paUsers.findUnique({
        where: {
          id: user?.id,
        },
      });

      return player;
    }),
  getFriendlies: privateProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true },
      });

      const users = await ctx.prisma.paUsers.findMany({
        where: {
          def: user?.id,
        },
      });

      const forsvar = users
        .map((defender) => {
          const ships =
            defender.astropods +
            defender.infinitys +
            defender.wraiths +
            defender.warfrigs +
            defender.destroyers +
            defender.scorpions;
          const eta = defender.defeta >= 5 ? defender.defeta - 5 : 0;
          return `Friendly incoming fleet of ${ships} units: ${defender.nick} #${defender.id} (ETA: ${eta} ticks)`;
        })
        .join("\n \n");

      if (users.length === 0) {
        return { defenders: "" };
      }

      return {
        defenders: forsvar,
      };
    }),
  getHostiles: privateProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true },
      });

      const users = await ctx.prisma.paUsers.findMany({
        where: {
          war: user?.id,
        },
      });

      const krig = users
        .map((defender) => {
          const ships =
            defender.astropods +
            defender.infinitys +
            defender.wraiths +
            defender.warfrigs +
            defender.destroyers +
            defender.scorpions;
          const eta = defender.wareta >= 5 ? defender.wareta - 5 : 0;
          return `Hostile incoming fleet of ${ships} units: ${defender.nick} #${defender.id} (ETA: ${eta} ticks)`;
        })
        .join("\n \n");

      if (users.length === 0) {
        return { hostiles: "" };
      }

      return {
        hostiles: krig,
      };
    }),

  getContinentIncoming: privateProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true, x: true },
      });

      const hostiles = await ctx.prisma.paUsers.findMany({
        where: {
          motd: user?.x,
          war: { gt: 0 },
        },
        select: { war: true, wareta: true, nick: true, id: true },
      });

      const friendly = await ctx.prisma.paUsers.findMany({
        where: {
          motd: user?.x,
          def: { gt: 0 },
        },
        select: { def: true, defeta: true, nick: true, id: true },
      });

      const hostileFleets = hostiles.map((hostile) => {
        const eta = hostile.wareta >= 5 ? hostile.wareta - 5 : 0;
        return `Continent incoming fleet: ${hostile.nick} is attacking #${hostile.war} (ETA: ${eta})`;
      });

      const friendlyFleets = friendly.map((friendly) => {
        const eta = friendly.defeta >= 10 ? friendly.defeta - 10 : 0;
        return `Continent incoming fleet: ${friendly.nick} is defending #${friendly.def} (ETA: ${eta})`;
      });

      return {
        hostiles: hostileFleets.join("\n"),
        friendly: friendlyFleets.join("\n"),
      };
    }),

  constructBuilding: privateProcedure
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ buildingCostCrystal: z.number() }))
    .input(z.object({ buildingCostTitanium: z.number() }))
    .input(z.object({ buildingFieldName: z.string() }))
    .input(z.object({ buildingETA: z.number() }))

    .mutation(async ({ ctx, input }) => {
      const {
        buildingFieldName,
        buildingCostCrystal,
        buildingCostTitanium,
        buildingETA,
      } = input;

      const data = await ctx.prisma.paUsers.update({
        where: {
          id: input.Userid,
        },
        data: {
          [buildingFieldName]: buildingETA,
          crystal: { decrement: buildingCostCrystal },
          metal: { decrement: buildingCostTitanium },
        },
      });

      return data;
    }),

  researchBuilding: privateProcedure
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ buildingFieldName: z.string() }))
    .input(z.object({ buildingCostCrystal: z.number() }))
    .input(z.object({ buildingCostTitanium: z.number() }))
    .input(z.object({ buildingFieldName: z.string() }))
    .input(z.object({ buildingETA: z.number() }))

    .mutation(async ({ ctx, input }) => {
      const {
        buildingFieldName,
        buildingCostCrystal,
        buildingCostTitanium,
        buildingETA,
      } = input;

      const data = await ctx.prisma.paUsers.update({
        where: {
          id: input.Userid,
        },
        data: {
          [buildingFieldName]: buildingETA,
          crystal: { decrement: buildingCostCrystal },
          metal: { decrement: buildingCostTitanium },
        },
      });

      return data;
    }),

  // TODO Combine constructBuilding, produceUnit, spyingInitiate and researchBuilding into one?

  produceUnit: privateProcedure
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ buildingFieldName: z.string() }))
    .input(z.object({ buildingFieldNameETA: z.string() }))
    .input(z.object({ buildingCostCrystal: z.number() }))
    .input(z.object({ buildingCostTitanium: z.number() }))
    .input(z.object({ unitAmount: z.number() }))
    .input(z.object({ buildingETA: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const {
        buildingFieldName,
        buildingFieldNameETA,
        buildingCostCrystal,
        buildingCostTitanium,
        unitAmount,
        buildingETA,
      } = input;

      const data = await ctx.prisma.paUsers.update({
        where: {
          id: input.Userid,
        },
        data: {
          [buildingFieldName]: {
            increment: unitAmount,
          },
          [buildingFieldNameETA]: buildingETA,
          crystal: { decrement: buildingCostCrystal * unitAmount },
          metal: { decrement: buildingCostTitanium * unitAmount },
        },
      });

      return data;
    }),

  // TODO Add support for more spying options
  spyingInitiate: privateProcedure
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ buildingFieldName: z.string() }))
    .input(z.object({ buildingCostCrystal: z.number() }))
    .input(z.object({ buildingCostTitanium: z.number() }))
    .input(z.object({ buildingETA: z.number() }))
    .input(z.object({ unitAmount: z.number().optional() }))
    .input(z.object({ spyingType: z.enum(["land"]).optional() })) // TODO Add more types and make it required

    .mutation(async ({ ctx, input }) => {
      const { Userid, buildingFieldName, buildingCostCrystal, unitAmount } =
        input;

      const unitAmountDefault = unitAmount ? unitAmount : 0;

      const data = await ctx.prisma.paUsers.update({
        where: {
          id: Userid,
        },
        data: {
          [buildingFieldName]: {
            increment: unitAmount,
          },

          crystal: { decrement: buildingCostCrystal * unitAmountDefault },
          ui_roids: { increment: unitAmount },
        },
      });

      return data;
    }),

  militaryAction: privateProcedure
    .input(
      z.object({
        Userid: z.number(),
        target: z.string().optional(),
        energyCost: z.number().optional(),
        mode: z.enum(["attack", "defend", "retreat"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { Userid, target, mode, energyCost } = input;

      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: target },
        select: { id: true },
      });

      // TODO Show an error if user is not found
      if (!user) return;

      const fieldMap = {
        attack: "war",
        defend: "def",
        retreat: "war",
      };

      const data = await ctx.prisma.paUsers.update({
        where: {
          id: Userid,
        },
        data: {
          [fieldMap[mode]]: mode === "retreat" ? -1 : user.id,
          wareta: 30,
          ...(energyCost !== undefined && energyCost > 0
            ? { energy: { decrement: energyCost } }
            : {}),
        },
      });

      return data;
    }),
});
