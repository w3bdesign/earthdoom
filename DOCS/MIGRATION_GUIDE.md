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

## Top 2 Recommendations (Updated)

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
npm i @hono/trpc-server @trpc/server@11 zod@4 @prisma/client@7
npm i -D prisma@7
```

**Day 2-3: Copy and adapt tRPC routers**
```bash
# Copy Prisma
cp -r ../game/prisma .
npx prisma generate

# Copy routers
cp -r ../game/src/server/api/routers ./src/
```

```ts
// server/src/index.ts
import { Hono } from 'hono'
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from './api/root'
import { createTRPCContext } from './api/trpc'

const app = new Hono()

app.use('/api/trpc/*', trpcServer({
  router: appRouter,
  createContext: createTRPCContext,
}))

export default app
```

**Day 4: Update Zod schemas for v4**
```ts
// Zod v4 breaking changes:
// - .transform() now requires explicit typing
// - Some coercion behavior changed
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
            {/* Map from src/pages/* to routes */}
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
```

#### Week 3: Testing & Polish (Days 11-15)

**Day 11-12: Migrate tests to Vitest**
```bash
npm i -D vitest @testing-library/react@16 @testing-library/jest-dom
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

**Day 15: Deploy**
```bash
# Frontend
npm run build
vercel deploy

# Already deployed backend on Day 5
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
8. Jest → Vitest migration anyway

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
- Don't rewrite tests

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

---

## My Strong Recommendation: Option 1 (React + Hono)

Given that you're facing a **complete stack rewrite anyway**, might as well:
- ✅ Start with latest versions
- ✅ Avoid Next.js entirely  
- ✅ Get lighter, faster architecture
- ✅ Spend time building features, not debugging upgrades

**Option 2 (in-place upgrade) takes the same time but leaves you with technical debt.**

---

## Next Steps

### Ready to migrate to Hono?
1. Create repos: `earthdoom-server` and `earthdoom-client`
2. Start with backend (critical game logic)
3. Test API with Postman/Thunder Client
4. Build frontend incrementally

### Resources
- [Hono Documentation](https://hono.dev)
- [tRPC v11 Migration](https://trpc.io/docs/migrate-from-v10-to-v11)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Tailwind v4 Alpha Docs](https://tailwindcss.com/docs/v4-beta)
