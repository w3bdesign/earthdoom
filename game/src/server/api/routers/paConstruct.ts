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

      // Fetch the associated PaConstruct for the user
      const paConstruct = await ctx.prisma.paUsers
        .findUnique({ where: { id: input.Userid } })
        .construction();

      if (!paConstruct) {
        throw new Error(
          `No PaConstruct found for user with ID: ${input.Userid}`,
        );
      }

      // Update the PaConstruct
      await ctx.prisma.paConstruct.update({
        where: {
          id: paConstruct.id,
        },
        data: {
          [buildingFieldName]: { set: buildingETA },
        },
      });

      // Update the PaUsers
      return await ctx.prisma.paUsers.update({
        where: {
          id: input.Userid,
        },
        data: {
          crystal: { decrement: buildingCostCrystal },
          metal: { decrement: buildingCostTitanium },
        },
      });
    }),

  /*
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
    }),*/

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

      // Fetch the current user data
      const currentUser = await ctx.prisma.paUsers.findUnique({
        where: { id: Userid },
      });

      // Check if user exists
      if (!currentUser) {
        throw new Error("User does not exist");
      }

      // Check if user has enough ui_roids
      if (currentUser.ui_roids < unitAmountDefault) {
        throw new Error("Not enough land");
      }

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
