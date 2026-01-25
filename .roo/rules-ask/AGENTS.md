# Project Documentation Rules (Non-Obvious Only)

- **Monorepo structure**: Commands must be run from `blog/` or `game/` subdirectories, not root
- **T3 stack**: Game app uses Create-T3-App pattern with tRPC + Prisma + Next.js + Clerk auth
- **Database relations**: `relationMode = "prisma"` means no foreign keys at DB level - relations only in Prisma
- **Environment setup**: Custom validation in `src/env.mjs` with strict Zod schemas
- **Auth patterns**: Clerk integration with development mode bypass in tRPC context
- **Query patterns**: tRPC queries configured for 60-second auto-refetch + background updates
- **Test setup**: Jest requires special ESM transform patterns for framework packages
- **Scripts location**: Database utilities and migrations live in `game/scripts/` directory
- **Astro config**: Blog uses static output mode with MDX, sitemap, Tailwind integrations