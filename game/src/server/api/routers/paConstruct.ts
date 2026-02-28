import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

/** Allowed dynamic field names for construction on PaConstruct */
const constructFields = [
  "c_crystal",
  "c_metal",
  "c_airport",
  "c_abase",
  "c_wstation",
  "c_amp1",
  "c_amp2",
  "c_warfactory",
  "c_destfact",
  "c_scorpfact",
  "c_energy",
  "c_odg",
] as const;

/** Allowed dynamic field names for land development on PaUsers */
const developLandFields = [
  "asteroid_crystal",
  "asteroid_metal",
] as const;

export const paConstructRouter = createTRPCRouter({
  constructBuilding: privateProcedure
    .input(z.object({
      buildingCostCrystal: z.number(),
      buildingCostTitanium: z.number(),
      buildingFieldName: z.enum(constructFields),
      buildingETA: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const {
        buildingFieldName,
        buildingCostCrystal,
        buildingCostTitanium,
        buildingETA,
      } = input;

      const player = await ctx.prisma.paUsers.findUnique({
        where: { nick: ctx.username ?? "" },
        select: { id: true },
      });

      if (!player) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Player not found" });
      }

      // Fetch the associated PaConstruct for the user
      const paConstruct = await ctx.prisma.paUsers
        .findUnique({ where: { id: player.id } })
        .construction();

      if (!paConstruct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No PaConstruct found for player`,
        });
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
          id: player.id,
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
    .input(z.object({
      buildingFieldName: z.enum(developLandFields),
      buildingCostCrystal: z.number(),
      buildingCostTitanium: z.number(),
      buildingETA: z.number(),
      unitAmount: z.number().optional(),
    }))

    .mutation(async ({ ctx, input }) => {
      const { buildingFieldName, buildingCostCrystal, unitAmount } =
        input;

      const unitAmountDefault = unitAmount || 0;

      // Fetch the current user data from auth context
      const currentUser = await ctx.prisma.paUsers.findUnique({
        where: { nick: ctx.username ?? "" },
      });

      // Check if user exists
      if (!currentUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Player not found" });
      }

      // Check if user has enough ui_roids
      if (currentUser.ui_roids < unitAmountDefault) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Not enough land" });
      }

      return await ctx.prisma.paUsers.update({
        where: {
          id: currentUser.id,
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
