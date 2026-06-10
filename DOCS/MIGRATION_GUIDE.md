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
- ✅ No need for tRPC - Hono has built-in type-safe RPC

### Target Stack

```
Frontend: React 19 + React Router 7 + Hono Client (RPC)
Backend: Hono + Prisma 7
Database: Cloudflare D1 (SQLite) or Prisma Postgres
Auth: Clerk v7 (client SDK)
Validation: Zod v4
Testing: Vitest + Testing Library
Deploy: Vercel (frontend) + Cloudflare Workers (backend)
```

**Why drop tRPC?** Hono has **built-in type-safe RPC** that's lighter, simpler, and doesn't require extra adapters or middleware. You get the same end-to-end type safety with significantly less code and fewer dependencies.

### What You Keep (Copy-Paste)

✅ **All React components** from `src/components/`
✅ **Business logic** from tRPC routers (adapt to Hono routes)
✅ **Prisma schema** `prisma/schema.prisma` + migrations
✅ **Game mechanics** - stays identical
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
npm i hono zod@4 @prisma/client@7 @prisma/adapter-d1
npm i -D prisma@7
```

**Day 2: Set up Prisma with Cloudflare D1**

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

// Copy your existing models
model PaUsers {
  id               Int          @id @default(autoincrement())
  nick             String       @unique
  crystal          Int          @default(0)
  metal            Int          @default(0)
  // ... rest of schema from ../game/prisma/schema.prisma
}
```

**Option B: Prisma Postgres (Managed, Zero Cold Start)**
```bash
npx prisma@latest init --db
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
```

Migrate schema:
```bash
# Copy schema
cp ../game/prisma/schema.prisma ./prisma/schema.prisma

# For D1
npx wrangler d1 migrations create earthdoom-db initial_schema
npx wrangler d1 migrations apply earthdoom-db --local

# For Prisma Postgres
npx prisma migrate dev
```

**Day 4: Create Hono API routes with Zod validation**

Create `src/index.ts`:
```ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { getPrisma } from './lib/prisma'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Example: Get user
const getUserSchema = z.object({
  id: z.string(),
})

app.get('/api/users/:id', 
  zValidator('param', getUserSchema),
  async (c) => {
    const { id } = c.req.valid('param')
    const prisma = getPrisma(c.env.DB)
    
    const user = await prisma.paUsers.findUnique({
      where: { id: parseInt(id) },
    })
    
    return c.json({ user })
  }
)

// Example: Create post
const createPostSchema = z.object({
  title: z.string(),
  body: z.string(),
})

app.post('/api/posts',
  zValidator('json', createPostSchema),
  async (c) => {
    const { title, body } = c.req.valid('json')
    const prisma = getPrisma(c.env.DB)
    
    // Your game logic here
    
    return c.json({ message: 'Created!' }, 201)
  }
)

export default app
```

Copy and adapt your tRPC router logic into Hono routes. The pattern is:
```ts
// Old tRPC
router.query('getUser', { input: z.object(...), resolve: async ({ input }) => {...} })

// New Hono
app.get('/api/users/:id', zValidator('param', z.object(...)), async (c) => {...})
```

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
npm i hono zod@4  # Hono client for RPC
npm i @clerk/clerk-react@7
npm i -D tailwindcss@4 @tailwindcss/vite
```

**Day 7: Port components**
```bash
# Copy components
cp -r ../game/src/components ./src/
cp -r ../game/src/styles ./src/
```

Update Tailwind v4:
```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
} satisfies Config
```

**Day 8-9: Set up Hono RPC client**

Export your backend types:
```ts
// server/src/index.ts
const app = new Hono()
  .get('/api/users/:id', ...)
  .post('/api/posts', ...)
  
export default app
export type AppType = typeof app
```

Use in frontend:
```tsx
// client/src/lib/api.ts
import { hc } from 'hono/client'
import type { AppType } from '../../../server/src/index'

export const client = hc<AppType>('https://your-worker.workers.dev')

// Usage in components
const res = await client.api.users[':id'].$get({ 
  param: { id: '123' } 
})
const data = await res.json() // Fully typed!
```

**Day 10: Set up routing**
```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/alliance" element={<AlliancePage />} />
          <Route path="/military" element={<MilitaryPage />} />
          {/* Map all routes from src/pages/* */}
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  )
}
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

Update tests:
```ts
// Old
import { describe, it, expect } from '@jest/globals'

// New
import { describe, it, expect } from 'vitest'
```

**Day 13-14: Integration testing**
- Test API endpoints
- Test authentication flows
- Test game mechanics
- Run: `npm test`

**Day 15: Deploy**
```bash
# Frontend
npm run build
vercel deploy
```

### Comparison: Hono RPC vs tRPC

| Feature | Hono RPC | tRPC |
|---------|----------|------|
| **Setup complexity** | Minimal | Complex |
| **Dependencies** | Built-in | Multiple packages |
| **Type safety** | ✅ Full | ✅ Full |
| **Bundle size** | Smaller | Larger |
| **Learning curve** | Low | Medium |
| **Code verbosity** | Less | More |

### Example Code Comparison

**tRPC approach:**
```ts
// Server
const userRouter = t.router({
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findUnique({ where: { id: input.id } })
    }),
})

// Client
const user = await trpc.user.getById.query({ id: '123' })
```

**Hono RPC approach:**
```ts
// Server
app.get('/api/users/:id', 
  zValidator('param', z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid('param')
    const user = await prisma.user.findUnique({ where: { id } })
    return c.json({ user })
  }
)

// Client
const res = await client.api.users[':id'].$get({ param: { id: '123' } })
const { user } = await res.json() // Fully typed!
```

**Result: Same type safety, less code, fewer dependencies.**

---

## ⚠️ Option 2: Upgrade All Packages In-Place (Higher Risk)

### Timeline: 2-3 weeks (similar to Option 1!)

### Why You Might Choose This
- Keep Next.js familiarity
- Keep file-based routing

### The Reality

You'll spend similar time debugging breaking changes across 10+ packages.

### Migration Steps (Condensed)

```bash
# Update everything at once
npm install react@19 react-dom@19
npm install next@16 eslint-config-next@16
npm install @trpc/client@11 @trpc/server@11 @trpc/next@11 @trpc/react-query@11
npm install @tanstack/react-query@5 @tanstack/react-query-devtools@5
npm install @clerk/nextjs@7
npm install @prisma/client@7
npm install -D prisma@7 tailwindcss@4 typescript@6
npm install zod@4

# Then fix 100+ breaking changes
npm test  # Watch it fail
npm run build  # Watch it fail
```

### Pros & Cons

❌ **Cons:**
- Same timeline as Option 1
- Higher debugging risk
- Still on Next.js (security concerns)
- Cascading breaking changes
- Keep tRPC complexity

✅ **Pros:**
- Keep Next.js familiarity
- Keep file-based routing

---

## Decision Matrix

| Factor | Option 1: Hono | Option 2: In-Place |
|--------|----------------|-------------------|
| **Timeline** | 2-3 weeks | 2-3 weeks |
| **Risk** | Medium | High |
| **Debugging** | Minimal | Extensive |
| **Bundle Size** | ~14KB | ~572KB |
| **Dependencies** | Fewer | Many |
| **Type Safety** | ✅ Native RPC | ✅ via tRPC |
| **Addresses Security** | ✅ Complete | ⚠️ Partial |
| **Breaking Changes** | Avoid | Fix 10+ |

---

## ❓ What About Vue/Nuxt?

**Not recommended** - would require:
- ❌ Rewriting all 73 React tests
- ❌ Rewriting all components
- ❌ Additional 2-3 weeks
- **Timeline: 4-6 weeks vs 2-3 weeks**

Stick with React to preserve your investment.

---

## My Strong Recommendation: Option 1 (React + Hono)

Since you're doing a complete rewrite anyway:
- ✅ Start with latest versions
- ✅ Escape Next.js entirely
- ✅ Drop tRPC complexity - use Hono's built-in RPC
- ✅ Get 14KB bundle
- ✅ Use free Cloudflare D1
- ✅ Avoid debugging cascading breaks

**Option 2 takes the same time but leaves you with more complexity and technical debt.**

---

## Next Steps

### Ready to migrate?

1. **Create project structure:**
   ```bash
   mkdir earthdoom-v2
   cd earthdoom-v2
   ```

2. **Start with backend:**
   - Set up Hono
   - Configure D1/Postgres
   - Convert tRPC routers to Hono routes
   - Test with Postman/curl

3. **Build frontend:**
   - Set up Vite + React 19
   - Use Hono client for type-safe API calls
   - Copy components incrementally

4. **Deploy early:**
   - Backend to Cloudflare Workers
   - Frontend to Vercel

---

## Resources

- [Hono Documentation](https://hono.dev)
- [Hono RPC Guide](https://hono.dev/guides/rpc)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Cloudflare D1 + Prisma](https://developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm/)
- [Prisma Postgres](https://www.prisma.io/docs/orm/overview/databases/prisma-postgres)
- [Hono Discord](https://discord.gg/hono)
