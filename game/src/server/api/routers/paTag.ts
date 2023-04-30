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
      const { tagName } = input;

      const user = await ctx.prisma.paUsers.findUnique({
        where: { id: input.Userid },
        select: { id: true, tag: true, nick: true },
      });

      const tagExists = await ctx.prisma.paTag.findUnique({
        where: {
          //leader:
        },
        //select: { id: true, x: true },
      });

      if (!tagExists && user) {
        const garbage = "tag" + Math.random().toString(36).substring(7);

        await ctx.prisma.paTag.create({
          data: {
            tag: tagName,
            password: garbage,
            leader: user.nick,
          },
        });

        await ctx.prisma.paUsers.update({
          where: {
            id: input.Userid,
          },
          data: {
            tag: tagName,
          },
        });
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
      }
    }),
});
