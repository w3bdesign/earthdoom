import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";

/*const User = z.object({
  id: z.number(),
  nick: z.string(),
  md5: z.string(),
});*/

const Mail = z.object({
  id: z.number(),
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
          id: Userid,
          seen: 0,
        },
        orderBy: { time: "desc" },
        take: 10,
      });

      console.log("Mails er: ", mails);

      const epost = mails
        .map((mail) =>
          Mail.parse({
            id: mail.id,
            time: mail.time,
            header: mail.header,
            news: mail.news,
            seen: mail.seen,
          })
        )
        .join("");

      return { email: mails[0] };
    }),
});
