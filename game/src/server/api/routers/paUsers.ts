import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const paUsersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.paUsers.findMany();
  }),

  getHostiles: publicProcedure
    .input(z.object({ Userid: z.number() }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.paUsers.findMany({
        where: {
          war: input.Userid,
        },
      });

      console.log(users);

      if (users.length === 0) {
        return { hostiles: "You have no incoming hostiles." };
      }

      return {
        hostiles: `Hello War: ${users} `,
      };

      /*return users
        .map((user) => {
          const ships =
            user.astropods +
            user.infinitys +
            user.wraiths +
            user.warfrigs +
            user.destroyers +
            user.scorpions;
          const eta = user.wareta >= 5 ? user.wareta - 5 : 0;
          return `<font color="red">Hostile incoming fleet of ${ships} units: ${user.nick} #${user.id} (ETA: ${eta})</font><br>`;
        })
        .join("");*/
    }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
