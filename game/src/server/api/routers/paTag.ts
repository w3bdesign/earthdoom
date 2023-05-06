import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const paTagRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.paTag.findMany();
  }),

  createAlliance: privateProcedure
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ tagName: z.string() }))

    .mutation(async ({ ctx, input }) => {
      const { Userid, tagName } = input;

      const player = await ctx.prisma.paUsers.findUnique({
        where: {
          id: Userid,
        },
      });

      if (!player) return;

      const tagExists = await ctx.prisma.paTag.findFirst({
        where: {
          tag: tagName,
        },
        select: { id: true, tag: true, leader: true, password: true },
      });

      if (!tagExists) {
        const garbage = "tag" + Math.random().toString(36).substring(7);

        const tagCreated = await ctx.prisma.paTag.create({
          data: {
            tag: tagName,
            password: garbage,
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
        return tagCreated;
      }
    }),

  joinAlliance: privateProcedure
    .input(z.object({ Userid: z.number() }))
    .input(z.object({ tagPassword: z.string() }))

    .mutation(async ({ ctx, input }) => {
      const { tagPassword } = input;

      const tagExists = await ctx.prisma.paTag.findFirst({
        where: {
          password: tagPassword,
        },
        select: {
          tag: true,
        },
      });

      if (tagExists) {
        await ctx.prisma.paUsers.update({
          where: {
            id: input.Userid,
          },
          data: {
            tag: tagExists.tag,
          },
        });
        return "Joined alliance";
      } else {
        return "Wrong password";
      }
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
