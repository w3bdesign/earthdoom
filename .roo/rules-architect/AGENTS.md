# Project Architecture Rules (Non-Obvious Only)

- **Monorepo isolation**: Blog (Astro) and Game (Next.js) are completely separate with different build systems
- **Database design**: Uses `relationMode = "prisma"` - database integrity handled at app level, not DB level
- **Auth architecture**: Clerk handles authentication with development bypass pattern in tRPC context
- **Data flow**: tRPC provides type-safe API layer between Next.js frontend and Prisma backend
- **Query strategy**: Aggressive caching (60s refetch, 30s stale time, 2min cache) optimizes for read-heavy game data
- **Environment isolation**: Custom validation prevents runtime failures from missing/invalid env vars
- **Testing architecture**: Jest configured for ESM modules with special transforms for framework packages
- **Development patterns**: Global Prisma client prevents connection exhaustion in dev mode
- **Component patterns**: Layout components expect specific prop interfaces (e.g., `PaPlayer` type)
- **Script architecture**: Database utilities isolated in `scripts/` directory with direct Prisma client usage