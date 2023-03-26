import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const paUsersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.paUsers.findMany();
  }),
});
