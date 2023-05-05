import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const paNewsRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const news = await ctx.prisma.paNews.findMany();
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
});
