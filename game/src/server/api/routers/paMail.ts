import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const paMailRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.paMail.findMany();
  }),
  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("Only emojis are allowed").min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.paMail.create({
        data: {
          id: input.content,
          header,
          news: txt,
          seen: "false",
          time: Math.floor(Date.now() / 1000), // assuming time is stored as Unix timestamp in seconds
        },
      });

      const nick = await ctx.prisma.paLogging.create({
        data: {
          toid: user,
          type: "news",
          author: Userid, // assuming this is a global variable
          text: txt,
          stamp: Math.floor(Date.now() / 1000),
          subject: header,
        },
      });

      //const authorId = ctx.userId;

      //const post = await ctx.prisma.paMail.create();

      return { nick, result };
    }),
});
