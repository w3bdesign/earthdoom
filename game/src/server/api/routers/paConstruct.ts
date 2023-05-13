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
});
