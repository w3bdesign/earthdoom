import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const paMailRouter = createTRPCRouter({
  markAsSeen: publicProcedure
    .input(z.object({ Userid: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { Userid } = input;
      const seenMail = await ctx.prisma.paMail.update({
        where: {
          sentTo: Userid,
        },
        data: { seen: 1 },
      });

      return { email: seenMail };
    }),
  getUnseenMailByUserId: publicProcedure
    .input(z.object({ Userid: z.number() }))
    .query(async ({ ctx, input }) => {
      const { Userid } = input;
      const mails = await ctx.prisma.paMail.findMany({
        where: {
          sentTo: Userid,
          seen: 0,
        },
        orderBy: { time: "desc" },
        take: 10,
      });

      return { email: mails };
    }),
  getAllMailByUserId: publicProcedure
    .input(z.object({ Userid: z.number() }))
    .query(async ({ ctx, input }) => {
      const { Userid } = input;

      const mails = await ctx.prisma.paMail.findMany({
        where: {
          sentTo: Userid,
        },
        orderBy: { time: "desc" },
      });

      return { email: mails };
    }),
});
