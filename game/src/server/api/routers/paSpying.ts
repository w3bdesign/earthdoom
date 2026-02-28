import { z } from "zod";

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
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ buildingFieldName: z.enum(spyingFields) }))
    .input(z.object({ buildingCostCrystal: z.number() }))
    .input(z.object({ buildingCostTitanium: z.number() }))
    .input(z.object({ buildingETA: z.number() }))
    .input(z.object({ unitAmount: z.number().optional() }))
    .input(z.object({ spyingType: z.enum(["land"]).optional() })) // TODO Add more types and make it required

    .mutation(async ({ ctx, input }) => {
      const { Userid, buildingFieldName, buildingCostCrystal, unitAmount } =
        input;

      const unitAmountDefault = unitAmount || 0;

      const landFound = calculateLand(unitAmountDefault);

      return await ctx.prisma.paUsers.update({
        where: {
          id: Userid,
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
