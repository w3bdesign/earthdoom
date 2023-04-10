import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";

export const paUsersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.paUsers.findMany();
  }),
  getAttackedPlayer: publicProcedure
    .input(z.object({ Warid: z.number() }))
    .query(async ({ ctx, input }) => {
      const defender = await ctx.prisma.paUsers.findUnique({
        where: { id: input.Warid },
        select: { id: true, nick: true },
      });

      return defender;
    }),
  getDefendedPlayer: publicProcedure
    .input(z.object({ Defid: z.number() }))
    .query(async ({ ctx, input }) => {
      const defender = await ctx.prisma.paUsers.findUnique({
        where: { id: input.Defid },
        select: { id: true, nick: true },
      });

      return defender;
    }),
  getPlayerById: publicProcedure
    .input(z.object({ Userid: z.number() }))
    .query(async ({ ctx, input }) => {
      const player = await ctx.prisma.paUsers.findUnique({
        where: {
          id: input.Userid,
        },
      });

      return player;
    }),
  getFriendlies: publicProcedure
    .input(z.object({ Userid: z.number() }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.paUsers.findMany({
        where: {
          def: input.Userid,
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
        return { defenders: "You have no incoming friendlies." };
      }

      return {
        defenders: forsvar,
      };
    }),
  getHostiles: publicProcedure
    .input(z.object({ Userid: z.number() }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.paUsers.findMany({
        where: {
          war: input.Userid,
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
        .join("");

      if (users.length === 0) {
        return { hostiles: "You have no incoming hostiles." };
      }

      return {
        hostiles: krig,
      };
    }),

  constructBuilding: publicProcedure
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ buildingFieldName: z.string() }))
    .input(z.object({ buildingETA: z.number() }))

    .mutation(async ({ ctx, input }) => {
      const { buildingFieldName, buildingETA } = input;

      // TODO Deduct cost from player

      const data = await ctx.prisma.paUsers.update({
        where: {
          id: input.Userid,
        },
        data: {
          [buildingFieldName]: buildingETA,
        },
      });

      return data;
    }),

  researchBuilding: publicProcedure
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ buildingFieldName: z.string() }))
    .input(z.object({ buildingETA: z.number() }))

    .mutation(async ({ ctx, input }) => {
      const { buildingFieldName, buildingETA } = input;

      // TODO Deduct cost from player

      const data = await ctx.prisma.paUsers.update({
        where: {
          id: input.Userid,
        },
        data: {
          [buildingFieldName]: buildingETA,
        },
      });

      return data;
    }),
});
