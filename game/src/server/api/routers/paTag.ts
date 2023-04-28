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

      //const player = ctx.prisma.paUsers.getPlayerById(input.Userid);

      const tagExists = await ctx.prisma.paTag.findUnique({
        where: {
          id: 1,
        },
        //select: { id: true, x: true },
      });

      if (!tagExists) {
        const garbage = "tag" + Math.random().toString(36).substring(7);

        await ctx.prisma.paTag.create({
          data: {
            tag: tagName,
            password: garbage,
            leader: "killah",
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
