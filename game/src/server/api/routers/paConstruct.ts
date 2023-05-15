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

<<<<<<< HEAD
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
=======
      const data = await ctx.prisma.paUsers.update({
        where: {
          id: input.Userid,
        },
>>>>>>> parent of ba06544 (Separate construction in separate model with relations)
        data: {
          [buildingFieldName]: buildingETA,
          crystal: { decrement: buildingCostCrystal },
          metal: { decrement: buildingCostTitanium },
        },
      });

      return data;
    }),
});
