import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const paNewsRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const news = await ctx.prisma.paNews.findMany();
    return { news };
  }),

  addNews: privateProcedure
    .input(z.object({ sentTo: z.number() }))
    .input(z.object({ news: z.string() }))
    .input(z.object({ header: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.prisma.paNews.create({
        data: {
          time: Math.floor(Date.now() / 1000), // get current time as a Unix timestamp
          sentTo: input.sentTo,
          news: input.news,
          header: input.header,
        },
      });

      return { news };
    }),

  getAllNewsByUserId: privateProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true },
      });

      const news = await ctx.prisma.paNews.findMany({
        where: {
          sentTo: user?.id,
        },
        orderBy: { time: "desc" },
      });

      return { news };
    }),

  deleteSingleNews: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deleteNews = await ctx.prisma.paNews.delete({
        where: {
          id: input.id,
        },
      });
      return { deleteNews };
    }),

  deleteAllNews: privateProcedure
    .input(z.object({ nick: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true },
      });

      const deleteNews = await ctx.prisma.paNews.deleteMany({
        where: {
          sentTo: user?.id,
        },
      });
      return { deleteNews };
    }),
});
