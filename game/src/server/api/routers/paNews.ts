import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const paNewsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const news = await ctx.prisma.paNews.findMany();
    return { news };
  }),

  getAllNewsByUserId: publicProcedure
    .input(z.object({ nick: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.paUsers.findUnique({
        where: { nick: input.nick },
        select: { id: true },
      });

      const news = await ctx.prisma.paNews.findMany({
        where: {
          id: user?.id,
        },
        orderBy: { time: "desc" },
      });

      return { news };
    }),
});
