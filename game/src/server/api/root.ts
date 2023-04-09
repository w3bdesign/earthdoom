import { createTRPCRouter } from "@/server/api/trpc";

import { paUsersRouter } from "@/server/api/routers/paUsers";
import { paMailRouter } from "@/server/api/routers/paMail";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  paUsers: paUsersRouter,
  paMail: paMailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
