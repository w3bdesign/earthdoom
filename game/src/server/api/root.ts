import { createTRPCRouter } from "@/server/api/trpc";

// Import all routers
import { paUsersRouter } from "@/server/api/routers/paUsers";
import { paConstructRouter } from "@/server/api/routers/paConstruct";
import { paMailRouter } from "@/server/api/routers/paMail";
import { paNewsRouter } from "@/server/api/routers/paNews";
import { paTagRouter } from "@/server/api/routers/paTag";
import { paMilitaryRouter } from "@/server/api/routers/paMilitary";
import { paSpyingRouter } from "@/server/api/routers/paSpying";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  paUsers: paUsersRouter,
  paConstruct: paConstructRouter,
  paMail: paMailRouter,
  paNews: paNewsRouter,
  paTag: paTagRouter,
  paMilitary: paMilitaryRouter,
  paSpying: paSpyingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
