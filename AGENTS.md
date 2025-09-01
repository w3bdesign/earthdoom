# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Monorepo Structure
- `blog/` - Astro static site (earthdoom.com)
- `game/` - Next.js T3 stack app (game interface)
- Commands must be run from respective subdirectories, not project root

## Game App (T3 Stack) Non-Obvious Patterns
- **Authentication bypass**: Development mode sets `userId = "admin"` in tRPC context
- **Database**: Uses `relationMode = "prisma"` instead of foreign keys in schema
- **Environment**: Custom env validation crashes app on invalid vars (see `src/env.mjs`)
- **tRPC queries**: Auto-refetch every 60 seconds + background refetching enabled
- **Module paths**: Jest requires custom mappings for `@/`, `server/`, `@prisma/client`
- **Refresh command**: `npm run refresh` removes node_modules, package-lock, reinstalls + formats

## Code Style (Project-Specific)
- **TypeScript imports**: Use inline type imports (`import { type Foo }`)
- **Unused variables**: Prefix with underscore to avoid lint errors
- **Tailwind classes**: Auto-sorted by prettier-plugin-tailwindcss

## Testing Requirements
- Tests require `jest-environment-jsdom`
- Special transform patterns for ESM modules in `@prisma`, `@clerk`, `superjson`, `@trpc`
- Module name mapping required for path aliases

## Commands (Non-Standard)
```bash
# Blog (run from blog/ directory)
npm run check        # Astro validation

# Game (run from game/ directory)  
npm run refresh      # Full clean reinstall + format
npm run prisma:generate  # Manual Prisma generation