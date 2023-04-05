import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const paMailRouter = createTRPCRouter({
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

  deleteEmail: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      await ctx.prisma.paMail.delete({
        where: {
          id,
        },
      });
    }),

    /*
  markAsSeen: publicProcedure
    .input(z.object({ sentTo: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { sentTo } = input;
      console.log("Ctx er: ", ctx);

      console.log("markAsSeen Input Userid er: ", sentTo);

      await ctx.prisma.paMail.update({
        where: {
          //sentTo: ctx.userId,
          //id: ctx.userId
          //id: ctx.userId
          sentTo,
        },
        data: { seen: 1 },
      });
    }),*/
});
