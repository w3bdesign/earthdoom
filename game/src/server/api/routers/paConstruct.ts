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

      const user = await ctx.prisma.paUsers.findUnique({
        where: { id: input.Userid },
        include: { construction: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const construct = user.construction;

      if (!construct) {
        throw new Error("Construction not found");
      }

      await ctx.prisma.paConstruct.update({
        where: { id: construct.id },
        data: {
          [buildingFieldName]: buildingETA,
        },
      });

      const updatedUser = await ctx.prisma.paUsers.update({
        where: { id: input.Userid },
        data: {
          crystal: { decrement: buildingCostCrystal },
          metal: { decrement: buildingCostTitanium },
        },
      });

      return updatedUser;
    }),

  developLand: privateProcedure
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ buildingFieldName: z.string() }))
    .input(z.object({ buildingCostCrystal: z.number() }))
    .input(z.object({ buildingCostTitanium: z.number() }))
    .input(z.object({ buildingETA: z.number() }))
    //.input(z.object({ unitAmount: z.number().optional() }))
    .input(z.object({ unitAmount: z.number() }))

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
          ui_roids: { decrement: unitAmount },
        },
      });

      return data;
    }),
});
