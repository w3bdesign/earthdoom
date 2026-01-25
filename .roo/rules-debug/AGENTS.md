# Project Debug Rules (Non-Obvious Only)

- **Environment crash**: App fails fast on invalid env vars - check `src/env.mjs` validation
- **Auth in dev**: tRPC context uses hardcoded `userId = "admin"` when `NODE_ENV === "development"`
- **Database logging**: Prisma query logging disabled by default (commented out in `src/server/db.ts`)
- **tRPC errors**: Development shows detailed path + message, production only shows generic errors
- **Jest transforms**: ESM modules require special transforms for `@prisma`, `@clerk`, `superjson`, `@trpc`
- **Test environment**: Must use `jest-environment-jsdom` or tests fail silently
- **Module resolution**: Path aliases `@/` and `server/` require explicit Jest mappings
- **Database scripts**: Migration utilities in `scripts/` directory must be run with proper env