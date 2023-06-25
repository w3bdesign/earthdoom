import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const paConstructRouter = createTRPCRouter({
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

      return await ctx.prisma.paUsers.update({
              where: {
                id: input.Userid,
              },
              data: {
                [buildingFieldName]: buildingETA,
                crystal: { decrement: buildingCostCrystal },
                metal: { decrement: buildingCostTitanium },
              },
            });
    }),

  developLand: privateProcedure
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ buildingFieldName: z.string() }))
    .input(z.object({ buildingCostCrystal: z.number() }))
    .input(z.object({ buildingCostTitanium: z.number() }))
    .input(z.object({ buildingETA: z.number() }))
    .input(z.object({ unitAmount: z.number().optional() }))

    .mutation(async ({ ctx, input }) => {
      const { Userid, buildingFieldName, buildingCostCrystal, unitAmount } =
        input;

      const unitAmountDefault = unitAmount || 0;

      return await ctx.prisma.paUsers.update({
              where: {
                id: Userid,
              },
              data: {
                [buildingFieldName]: {
                  increment: unitAmount,
                },
      
                crystal: { decrement: buildingCostCrystal * unitAmountDefault },
                ui_roids: { decrement: unitAmount },
              },
            });
    }),
});
