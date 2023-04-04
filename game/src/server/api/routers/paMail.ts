import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";

const Mail = z.object({
  id: z.number(),
  sentTo: z.number(),
  time: z.number(),
  seen: z.number(),
  header: z.string(),
  news: z.string(),
});

export const paMailRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.paMail.findMany();
  }),

  getMailByUserId: publicProcedure
    .input(z.object({ Userid: z.number() }))
    .query(async ({ ctx, input }) => {
      const { Userid } = input;
      console.log("Input: ", Userid);

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
});
