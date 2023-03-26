import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { paUsersRouter } from "@/server/api/routers/paUsers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  paUsers: paUsersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
