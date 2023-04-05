import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const paMailRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const mails = await ctx.prisma.paMail.findMany();

    return { email: mails };
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
  deleteEmail: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const deleteEmail = await ctx.prisma.paMail.delete({
        where: {
          id,
        },
      });

      return deleteEmail;
    }),
  markAsSeen: publicProcedure
    .input(z.object({ sentTo: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { sentTo } = input;

      const seenMail = await ctx.prisma.paMail.updateMany({
        where: {
          sentTo,
          seen: 0,
        },
        data: { seen: 1 },
      });
      return seenMail;
    }),
});
