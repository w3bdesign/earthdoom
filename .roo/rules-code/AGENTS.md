# Project Coding Rules (Non-Obvious Only)

- **tRPC context**: Development bypasses auth - `userId = "admin"` when `NODE_ENV === "development"`
- **Prisma relations**: Uses `relationMode = "prisma"` - no foreign keys enforced at database level
- **Environment vars**: App crashes on startup if env validation fails (see `src/env.mjs`)
- **Type imports**: ESLint enforces inline type imports: `import { type Foo }` not `import type { Foo }`
- **Unused variables**: Must prefix with underscore: `const _unused = foo` to avoid lint errors
- **Database queries**: Prisma client globally cached in `src/server/db.ts` for development
- **Authentication**: Clerk `getAuth()` used in tRPC context, handles both server and client scenarios
- **Scripts directory**: Contains database migration utilities like `fix-constructs.ts`