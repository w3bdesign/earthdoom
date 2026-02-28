import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  privateProcedure,
} from "@/server/api/trpc";

/** Allowed dynamic field names for research on PaUsers */
const researchFields = [
  "r_imcrystal",
  "r_immetal",
  "r_energy",
  "r_aaircraft",
  "r_tbeam",
  "r_uscan",
  "r_oscan",
  "r_odg",
] as const;

/** Allowed dynamic field names for unit production on PaUsers */
const productionFields = [
  "p_infinitys",
  "p_wraiths",
  "p_cobras",
  "p_warfrigs",
  "p_astropods",
  "p_destroyers",
  "p_rcannons",
  "p_avengers",
  "p_lstalkers",
  "p_scorpions",
  "p_missiles",
] as const;

/** Allowed dynamic ETA field names for unit production on PaUsers */
const productionETAFields = [
  "p_infinitys_eta",
  "p_wraiths_eta",
  "p_cobras_eta",
  "p_warfrigs_eta",
  "p_astropods_eta",
  "p_destroyers_eta",
  "p_rcannons_eta",
  "p_avengers_eta",
  "p_lstalkers_eta",
  "p_scorpions_eta",
  "p_missiles_eta",
] as const;

export const paUsersRouter = createTRPCRouter({
  createPlayer: privateProcedure
    .input(z.object({ nick: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.nick !== ctx.username) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Nick must match your authenticated username",
        });
      }

      return await ctx.prisma.paUsers.create({
        data: {
          nick: input.nick,
          construction: { create: {} },
        },
        include: { construction: true },
      });
    }),

  getAll: privateProcedure.query(async ({ ctx }) => {
    // Batch-update all ranks in a single query using ROW_NUMBER()
    await ctx.prisma.$executeRaw`
      UPDATE "PaUsers" SET rank = ranked.new_rank
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC) AS new_rank
        FROM "PaUsers"
      ) AS ranked
      WHERE "PaUsers".id = ranked.id
    `;

    return await ctx.prisma.paUsers.findMany({
      orderBy: { rank: "asc" },
    });
  }),
  getResourceOverview: privateProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.paUsers.findUnique({
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
          newbie: true,
        },
      });
    }),
  getAttackedPlayer: privateProcedure
    .input(z.object({ Warid: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.paUsers.findUnique({
        where: { id: input.Warid },
        select: { id: true, nick: true },
      });
    }),
  getDefendedPlayer: privateProcedure
    .input(z.object({ Defid: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.paUsers.findUnique({
        where: { id: input.Defid },
        select: { id: true, nick: true },
      });
    }),
  getPlayerByNick: privateProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true, tag: true, construction: true },
      });

      const player = await ctx.prisma.paUsers.findUnique({
        where: {
          id: user?.id,
        },
      });

      if (!player) {
        return null;
      }

      // If player has no paConstructId, create a new PaConstruct
      if (!player.paConstructId) {
        const newConstruct = await ctx.prisma.paConstruct.create({
          data: {}
        });
        
        // Link the new construct to the player
        await ctx.prisma.paUsers.update({
          where: { id: player.id },
          data: { paConstructId: newConstruct.id }
        });
        
        return { ...newConstruct, ...player, id: player.id };
      }

      const paConstruct = await ctx.prisma.paConstruct.findUnique({
        where: { id: player.paConstructId },
      });

      if (!paConstruct) {
        throw new Error(`No PaConstruct found for user with ID: ${player.id}`);
      }

      return { ...paConstruct, ...player, id: player.id };
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

  researchBuilding: privateProcedure
    .input(z.object({ buildingFieldName: z.enum(researchFields) }))
    .input(z.object({ buildingCostCrystal: z.number() }))
    .input(z.object({ buildingCostTitanium: z.number() }))
    .input(z.object({ buildingETA: z.number() }))

    .mutation(async ({ ctx, input }) => {
      const {
        buildingFieldName,
        buildingCostCrystal,
        buildingCostTitanium,
        buildingETA,
      } = input;

      const player = await ctx.prisma.paUsers.findUnique({
        where: { nick: ctx.username ?? "" },
        select: { id: true },
      });

      if (!player) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Player not found" });
      }

      return await ctx.prisma.paUsers.update({
        where: { id: player.id },
        data: {
          [buildingFieldName]: buildingETA,
          crystal: { decrement: buildingCostCrystal },
          metal: { decrement: buildingCostTitanium },
        },
      });
    }),

  // TODO Combine constructBuilding, produceUnit and researchBuilding into one?

  produceUnit: privateProcedure
    .input(z.object({ buildingFieldName: z.enum(productionFields) }))
    .input(z.object({ buildingFieldNameETA: z.enum(productionETAFields) }))
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

      const player = await ctx.prisma.paUsers.findUnique({
        where: { nick: ctx.username ?? "" },
        select: { id: true },
      });

      if (!player) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Player not found" });
      }

      const data = await ctx.prisma.paUsers.update({
        where: { id: player.id },
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
});
