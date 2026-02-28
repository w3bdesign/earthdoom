import { z } from "zod";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const paTagRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.paTag.findMany();
  }),

  createAlliance: privateProcedure
    .input(z.object({
      Userid: z.number(),
      tagName: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { Userid, tagName } = input;

      const player = await ctx.prisma.paUsers.findUnique({
        where: {
          id: Userid,
        },
      });

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }

      const tagExists = await ctx.prisma.paTag.findFirst({
        where: {
          tag: tagName,
        },
        select: { id: true, tag: true, leader: true, password: true },
      });

      if (tagExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Alliance "${tagName}" already exists`,
        });
      }

      const password = crypto.randomUUID();
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      const tagCreated = await ctx.prisma.paTag.create({
        data: {
          tag: tagName,
          password: hashedPassword,
          leader: player.nick,
        },
      });

      await ctx.prisma.paUsers.update({
        where: {
          id: Userid,
        },
        data: {
          tag: tagName,
        },
      });

      // Return the plaintext password once so the leader can share it
      return { ...tagCreated, password };
    }),

  joinAlliance: privateProcedure
    .input(z.object({
      Userid: z.number(),
      tagPassword: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { tagPassword } = input;

      const hashedPassword = crypto
        .createHash("sha256")
        .update(tagPassword)
        .digest("hex");

      const tagExists = await ctx.prisma.paTag.findFirst({
        where: {
          password: hashedPassword,
        },
        select: {
          tag: true,
        },
      });

      if (!tagExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wrong password or alliance not found",
        });
      }

      await ctx.prisma.paUsers.update({
        where: {
          id: input.Userid,
        },
        data: {
          tag: tagExists.tag,
        },
      });

      return "Joined alliance";
    }),

  leaveAlliance: privateProcedure
    .input(z.object({ Userid: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { Userid } = input;

      await ctx.prisma.paUsers.update({
        where: {
          id: Userid,
        },
        data: {
          tag: "",
        },
      });
    }),
});
