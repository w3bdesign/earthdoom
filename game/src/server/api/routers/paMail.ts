import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const paMailRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const mails = await ctx.prisma.paMail.findMany();
    return { email: mails };
  }),
  getUnseenMailByUserId: privateProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true },
      });

      const mails = await ctx.prisma.paMail.findMany({
        where: {
          sentTo: user?.id,
          seen: 0,
        },
        orderBy: { time: "desc" },
        take: 10,
      });

      return { email: mails };
    }),
  getAllMailByNick: privateProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true },
      });

      if (!user) {
        return;
      }

      const mail = await ctx.prisma.paMail.findMany({
        where: {
          sentTo: user.id,
        },
        orderBy: { time: "desc" },
      });

      return { mail };
    }),

  sendMail: privateProcedure
    .input(z.object({ nick: z.string() }))
    .input(z.object({ news: z.string() }))
    .input(z.object({ header: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true },
      });

      if (!user) {
        return;
      }

      const mail = await ctx.prisma.paMail.create({
        data: {
          time: Math.floor(Date.now() / 1000), // get current time as a Unix timestamp
          sentTo: user.id,
          news: input.news,
          header: input.header,
        },
      });

      return { mail };
    }),

  deleteEmail: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      return await ctx.prisma.paMail.delete({
        where: {
          id,
        },
      });
    }),
  markAsSeen: privateProcedure
    .input(z.object({ sentTo: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { sentTo } = input;

      return await ctx.prisma.paMail.updateMany({
        where: {
          sentTo,
          seen: 0,
        },
        data: { seen: 1 },
      });
    }),
});
