import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const paMailRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.paMail.findMany();
  }),
});
