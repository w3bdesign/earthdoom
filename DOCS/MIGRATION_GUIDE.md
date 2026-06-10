# Migration Guide: Earthdoom Game

## 🚨 ACTUAL Situation (After Running `npm outdated`)

You're facing **MASSIVE breaking changes** across your entire stack:

### Major Version Bumps (Breaking Changes)
- **React 18 → 19** (`react`, `react-dom`)
- **Next.js 15 → 16** (`next`, `eslint-config-next`)
- **tRPC 10 → 11** (all `@trpc/*` packages)
- **TanStack Query 4 → 5** 
- **Clerk 4 → 7** (3 major versions!)
- **Prisma 6 → 7** (`@prisma/client`, `prisma`)
- **Tailwind CSS 3 → 4** 
- **TypeScript 5 → 6**
- **Zod 3 → 4**
- **Jest 29 → 30** (all `jest-*` packages)
- **ESLint 9 → 10**

This is not "a few package updates" - this is a **complete stack upgrade** with breaking changes in virtually every major dependency.

---

## Top 2 Recommendations

---

## ✅ Option 1: Migrate to React + Hono (RECOMMENDED)

### Timeline: 2-3 weeks

### Why This Makes Sense Now
Given the scale of breaking changes, **starting fresh with modern versions** takes similar time to fixing 10+ major version migrations, but gives you:
- ✅ Latest stable versions of everything
- ✅ No cascading breaking changes to debug
- ✅ Escape Next.js entirely
- ✅ ~14KB bundle vs Next.js bloat
- ✅ Edge-native architecture

### Target Stack

```
Frontend: React 19 + React Router 7 + TanStack Query v5
Backend: Hono + @hono/trpc-server (tRPC v11) + Prisma 7
Database: Cloudflare D1 (SQLite) or Prisma Postgres
Auth: Clerk v7 (client SDK)
Validation: Zod v4
Testing: Vitest + Testing Library
Deploy: Vercel (frontend) + Cloudflare Workers (backend)
```

### What You Keep (Copy-Paste)

✅ **All React components** from `src/components/`
✅ **All tRPC routers** from `src/server/api/routers/`
✅ **Prisma schema** `prisma/schema.prisma` + migrations
✅ **Business logic** - game mechanics stay identical
✅ **Tailwind config** (upgrade to v4 syntax)
✅ **73 tests** (update imports only)

### Migration Steps

#### Week 1: Backend (Days 1-5)

**Day 1: Project setup**
```bash
mkdir earthdoom-v2
cd earthdoom-v2

# Backend
npm create hono@latest server -- --template cloudflare-workers
cd server
npm i @hono/trpc-server @trpc/server@11 zod@4
npm i @prisma/client@7 @prisma/adapter-d1
npm i -D prisma@7
```

**Day 2: Set up Prisma with Cloudflare D1**

You have two database options:

**Option A: Cloudflare D1 (Serverless SQLite - FREE)**
```bash
# Create D1 database
npx wrangler d1 create earthdoom-db

# Initialize Prisma
npx prisma init
```

Add to `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "earthdoom-db"
database_id = "<your-database-id-from-create-command>"
```

Update `prisma/schema.prisma`:
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Copy your existing models from ../game/prisma/schema.prisma
model PaUsers {
  id               Int          @id @default(autoincrement())
  nick             String       @unique
  crystal          Int          @default(0)
  // ... rest of your schema
}
```

**Option B: Prisma Postgres (Managed, Zero Cold Start)**
```bash
# Initialize with Prisma Postgres
npx prisma@latest init --db

# Install Accelerate extension
npm i @prisma/extension-accelerate
```

Create `.dev.vars`:
```
DATABASE_URL="your_prisma_postgres_url"
```

**Day 3: Set up Prisma helper and migrate**

Create `src/lib/prisma.ts`:
```ts
// For Cloudflare D1
import { PrismaClient } from '@prisma/client/edge'
import { PrismaD1 } from '@prisma/adapter-d1'

export const getPrisma = (db: D1Database) => {
  const adapter = new PrismaD1(db)
  return new PrismaClient({ adapter })
}

// Or for Prisma Postgres
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const getPrisma = (databaseUrl: string) => {
  return new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate())
}
```

Copy your existing schema and run migrations:
```bash
# Copy schema
cp ../game/prisma/schema.prisma ./prisma/schema.prisma

# For D1: Generate and apply migrations
npx wrangler d1 migrations create earthdoom-db initial_schema
# Copy SQL from prisma/migrations to the created file
npx wrangler d1 migrations apply earthdoom-db --local

# For Prisma Postgres
npx prisma migrate dev
```

**Day 4: Set up Hono with tRPC**

Create `src/index.ts`:
```ts
import { Hono } from 'hono'
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from './api/root'
import { getPrisma } from './lib/prisma'

type Bindings = {
  DB: D1Database // For D1
  // DATABASE_URL: string // For Prisma Postgres
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/trpc/*', trpcServer({
  router: appRouter,
  createContext: (opts, c) => {
    // For D1
    const prisma = getPrisma(c.env.DB)
    
    // For Prisma Postgres
    // const prisma = getPrisma(c.env.DATABASE_URL)
    
    return { prisma }
  },
}))

export default app
```

Copy your tRPC routers:
```bash
cp -r ../game/src/server/api/routers ./src/api/
cp ../game/src/server/api/root.ts ./src/api/
cp ../game/src/server/api/trpc.ts ./src/api/
```

Update imports in copied files to work with new structure.

**Day 5: Deploy backend**
```bash
npm run deploy  # Cloudflare Workers
```

#### Week 2: Frontend (Days 6-10)

**Day 6: React setup**
```bash
# Frontend
npm create vite@latest client -- --template react-ts
cd client
npm i react@19 react-dom@19 react-router@7
npm i @tanstack/react-query@5 @trpc/client@11 @trpc/react-query@11
npm i @clerk/clerk-react@7 hono zod@4
npm i -D tailwindcss@4 @tailwindcss/vite
```

**Day 7: Port components**
```bash
# Copy all components
cp -r ../game/src/components ./src/
cp -r ../game/src/styles ./src/
```

Update Tailwind v4 config:
```ts
// tailwind.config.ts (v4 uses CSS-first approach)
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  // v4 simplified config
} satisfies Config
```

**Day 8-9: Set up routing**
```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'

const queryClient = new QueryClient()

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_KEY}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/alliance" element={<AlliancePage />} />
            <Route path="/construct" element={<ConstructPage />} />
            <Route path="/military" element={<MilitaryPage />} />
            {/* Map all routes from src/pages/* */}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
```

**Day 10: tRPC client setup**
```ts
// src/utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../../server/src/api/root'

export const trpc = createTRPCReact<AppRouter>()

// src/main.tsx - wrap with trpc provider
import { trpc } from './utils/trpc'
import { httpBatchLink } from '@trpc/client'

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'https://your-worker.workers.dev/api/trpc',
    }),
  ],
})

root.render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <App />
  </trpc.Provider>
)
```

#### Week 3: Testing & Polish (Days 11-15)

**Day 11-12: Migrate tests to Vitest**
```bash
npm i -D vitest @testing-library/react@16 @testing-library/jest-dom
```

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

Update test files:
```ts
// Old: import { describe, it, expect } from '@jest/globals'
import { describe, it, expect } from 'vitest'  // New
```

**Day 13-14: Integration testing**
- Test all game mechanics
- Test authentication flows
- Test API endpoints
- Run full test suite: `npm test`

**Day 15: Deploy**
```bash
# Frontend
npm run build
vercel deploy

# Backend already deployed on Day 5
```

### Breaking Changes You Avoid

By starting fresh, you **skip debugging**:
1. React 19 compiler changes
2. Next.js 16 App Router breaking changes  
3. tRPC 11 API changes
4. Tailwind 4 CSS-first rewrite
5. TypeScript 6 stricter types
6. Clerk 7 auth API changes
7. Prisma 7 query changes
8. Jest → Vitest migration

### Estimated Effort

- Backend setup: **20 hours**
- Frontend setup: **25 hours**  
- Testing: **15 hours**
- **Total: ~60 hours (2 weeks at 30hr/week)**

---

## ⚠️ Option 2: Upgrade All Packages In-Place (Higher Risk)

### Timeline: 2-3 weeks (similar to Option 1!)

### Why You Might Choose This
- Keep Next.js familiarity
- Keep file-based routing
- Keep SSR capabilities (not used currently)

### The Reality

You'll spend similar time debugging breaking changes:

**Week 1: Core framework updates**
- React 18 → 19 (component behavior changes)
- Next.js 15 → 16 (App Router breaking changes)
- TypeScript 5 → 6 (stricter inference)

**Week 2: API layer updates**
- tRPC 10 → 11 (context API changes)
- TanStack Query 4 → 5 (cache behavior)
- Prisma 6 → 7 (query API changes)
- Clerk 4 → 7 (complete auth rewrite)

**Week 3: Tooling & testing**
- Tailwind 3 → 4 (CSS-first rewrite)
- Jest 29 → 30 (config changes)
- ESLint 9 → 10 (rule updates)
- Zod 3 → 4 (validation changes)

### Migration Steps (Condensed)

```bash
# Phase 1: Update everything
npm install react@19 react-dom@19
npm install next@16 eslint-config-next@16
npm install @trpc/client@11 @trpc/server@11 @trpc/next@11 @trpc/react-query@11
npm install @tanstack/react-query@5 @tanstack/react-query-devtools@5
npm install @clerk/nextjs@7
npm install @prisma/client@7
npm install -D prisma@7
npm install -D tailwindcss@4
npm install -D typescript@6
npm install zod@4

# Phase 2: Fix 100+ breaking changes
npm test  # Watch it fail
npm run build  # Watch it fail
# ... debug for days ...
```

### Why This Is Harder

1. **Cascading failures**: One breaking change causes 10 errors
2. **Migration guides**: Must read 10+ migration guides
3. **Type errors**: TypeScript 6 finds issues everywhere
4. **Test failures**: Jest 30 config incompatibilities
5. **Unknown unknowns**: Interactions between upgrades

### Pros & Cons

❌ **Cons:**
- Same timeline as Option 1
- Higher debugging risk
- Still on Next.js (security concerns)
- Future upgrade debt
- Cascading breaking changes

✅ **Pros:**
- Keep Next.js familiarity
- Keep file-based routing
- Don't rewrite tests (but still need updates)

---

## Decision Matrix

| Factor | Option 1: Hono | Option 2: In-Place |
|--------|----------------|-------------------|
| **Timeline** | 2-3 weeks | 2-3 weeks |
| **Risk** | Medium (clean slate) | High (cascading breaks) |
| **Debugging** | Minimal | Extensive |
| **Bundle Size** | ~14KB | ~572KB |
| **Long-term Maintenance** | Modern baseline | Continuous upgrades |
| **Addresses Security** | ✅ Complete | ⚠️ Partial |
| **Breaking Changes** | Avoid | Must fix 10+ |
| **Database Options** | D1 (free) or Postgres | Same as current |

---

## ❓ What About Vue/Nuxt?

**Short answer: Not recommended**

### Why Vue/Nuxt Would Add Work

- ❌ Rewrite ALL 73 React component tests
- ❌ Rewrite ALL components (React → Vue SFC)
- ❌ Learn new framework patterns
- ❌ Additional 2-3 weeks on top of migration

**Timeline: 4-6 weeks vs 2-3 weeks with React**

### When Vue WOULD Make Sense
- Starting from scratch
- Team already knows Vue
- Personal preference for Vue API

**Recommendation: Stick with React** - preserve your investment in 73 tests and working components.

---

## My Strong Recommendation: Option 1 (React + Hono)

Given that you're facing a **complete stack rewrite anyway**, might as well:
- ✅ Start with latest versions
- ✅ Avoid Next.js entirely  
- ✅ Get lighter, faster architecture
- ✅ Use Cloudflare D1 (free serverless DB)
- ✅ Spend time building features, not debugging upgrades

**Option 2 (in-place upgrade) takes the same time but leaves you with technical debt.**

---

## Next Steps

### Ready to migrate to Hono?

1. **Create new repos:**
   ```bash
   mkdir earthdoom-v2
   cd earthdoom-v2
   ```

2. **Start with backend** (game logic is critical):
   - Set up Hono + tRPC
   - Configure Cloudflare D1 or Prisma Postgres
   - Copy routers and test with Postman

3. **Build frontend incrementally**:
   - Set up Vite + React 19
   - Copy components one route at a time
   - Test as you go

4. **Deploy early and often**:
   - Backend to Cloudflare Workers
   - Frontend to Vercel

---

## Resources

### Migration Guides
- [Hono Documentation](https://hono.dev)
- [tRPC v11 Migration](https://trpc.io/docs/migrate-from-v10-to-v11)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Tailwind v4 Docs](https://tailwindcss.com/docs/v4-beta)
- [Cloudflare D1 with Prisma](https://developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm/)
- [Prisma Postgres Guide](https://www.prisma.io/docs/orm/overview/databases/prisma-postgres)

### Community
- [Hono Discord](https://discord.gg/hono)
- [tRPC Discord](https://trpc.io/discord)
- [Cloudflare Developers Discord](https://discord.gg/cloudflaredev)
