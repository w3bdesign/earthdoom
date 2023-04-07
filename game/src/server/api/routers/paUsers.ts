import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const paUsersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.paUsers.findMany();
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
          return `Friendly incoming fleet of ${ships} units: ${defender.nick} #${defender.id} (ETA: ${eta})`;
        })
        .join("");

      if (users.length === 0) {
        return { hostiles: "You have no incoming friendlies." };
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
          return `Hostile incoming fleet of ${ships} units: ${defender.nick} #${defender.id} (ETA: ${eta})`;
        })
        .join("");

      if (users.length === 0) {
        return { hostiles: "You have no incoming hostiles." };
      }

      return {
        hostiles: krig,
      };
    }),
});
