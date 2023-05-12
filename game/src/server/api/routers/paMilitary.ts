import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const paMilitaryRouter = createTRPCRouter({
  militaryAction: privateProcedure
    .input(
      z.object({
        Userid: z.number(),
        target: z.string(),
        energyCost: z.number().optional(),
        mode: z.enum(["attack", "defend"]),
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

      const data = await ctx.prisma.paUsers.update({
        where: {
          id: Userid,
        },
        data: {
          [mode === "attack" ? "war" : "def"]: user.id,
          wareta: 30,
          ...(energyCost !== undefined && energyCost > 0
            ? { energy: { decrement: energyCost } }
            : {}),
        },
      });

      return data;
    }),

  retreatTroops: privateProcedure
    .input(
      z.object({
        Userid: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { Userid } = input;

      const data = await ctx.prisma.paUsers.update({
        where: {
          id: Userid,
        },
        data: {
          war: -1,
        },
      });

      return data;
    }),
});
