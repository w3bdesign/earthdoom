import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

import { calculateLand } from "@/utils/functions";

/** Allowed dynamic field names for spying/energy on PaUsers */
const spyingFields = [
  "ui_roids",
  "sats",
] as const;

export const paSpyingRouter = createTRPCRouter({
  // TODO Add support for more spying options
  spyingInitiate: privateProcedure
    .input(z.object({
      buildingFieldName: z.enum(spyingFields),
      buildingCostCrystal: z.number(),
      buildingCostTitanium: z.number(),
      buildingETA: z.number(),
      unitAmount: z.number().optional(),
      spyingType: z.enum(["land"]).optional(), // TODO Add more types and make it required
    }))

    .mutation(async ({ ctx, input }) => {
      const { buildingFieldName, buildingCostCrystal, unitAmount } =
        input;

      const player = await ctx.prisma.paUsers.findUnique({
        where: { nick: ctx.username ?? "" },
        select: { id: true },
      });

      if (!player) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Player not found" });
      }

      const unitAmountDefault = unitAmount || 0;

      const landFound = calculateLand(unitAmountDefault);

      return await ctx.prisma.paUsers.update({
        where: {
          id: player.id,
        },
        data: {
          [buildingFieldName]: {
            increment: unitAmount,
          },

          crystal: { decrement: buildingCostCrystal * unitAmountDefault },
          ui_roids: { increment: landFound },
        },
      });
    }),
});
