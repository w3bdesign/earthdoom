# Zod v4 Migration Plan for EarthDoom Game

## Current State Analysis

**Current Version**: `zod@^3.25.76`  
**Target Version**: `zod@^4.0.0`

### Files Using Zod

#### Core Files
1. [`game/src/env.mjs`](../game/src/env.mjs:1) - Environment variable validation
2. [`game/src/server/api/trpc.ts`](../game/src/server/api/trpc.ts:64) - Error handling

#### tRPC Router Files
1. [`game/src/server/api/routers/paUsers.ts`](../game/src/server/api/routers/paUsers.ts:1)
2. [`game/src/server/api/routers/paTag.ts`](../game/src/server/api/routers/paTag.ts:1)
3. [`game/src/server/api/routers/paSpying.ts`](../game/src/server/api/routers/paSpying.ts:1)
4. [`game/src/server/api/routers/paNews.ts`](../game/src/server/api/routers/paNews.ts:3)
5. [`game/src/server/api/routers/paMilitary.ts`](../game/src/server/api/routers/paMilitary.ts:1)
6. [`game/src/server/api/routers/paMail.ts`](../game/src/server/api/routers/paMail.ts:4)
7. [`game/src/server/api/routers/paConstruct.ts`](../game/src/server/api/routers/paConstruct.ts:1)

#### Test Files
1. [`game/src/__tests__/server/api/routers/paUsers.test.ts`](../game/src/__tests__/server/api/routers/paUsers.test.ts:12)

---

## Breaking Changes That Affect This Codebase

### 🔴 HIGH IMPACT - Requires Code Changes

#### 1. `.merge()` Method Deprecated
**Location**: [`game/src/env.mjs:35`](../game/src/env.mjs:35)

**Current Code**:
```javascript
const merged = server.merge(client);
```

**Issue**: `.merge()` is deprecated in Zod v4 in favor of `.extend()`

**Migration Options**:
- **Option A**: Use `.extend()` with `.shape`
- **Option B**: Use object destructuring (best TypeScript performance)

**Recommended Fix** (Option B):
```javascript
const merged = z.object({
  ...server.shape,
  ...client.shape,
});
```

---

#### 2. `.flatten()` Method Deprecated
**Location**: [`game/src/env.mjs:55`](../game/src/env.mjs:55)

**Current Code**:
```javascript
parsed.error.flatten().fieldErrors
```

**Issue**: `.flatten()` is deprecated, should use `z.treeifyError()`

**Recommended Fix**:
```javascript
z.treeifyError(parsed.error).fieldErrors
```

---

### 🟡 MEDIUM IMPACT - Deprecated But Still Works

#### 3. `z.string().url()` Deprecated Format
**Location**: [`game/src/env.mjs:8`](../game/src/env.mjs:8)

**Current Code**:
```javascript
DATABASE_URL: z.string().url(),
```

**Issue**: String format methods are deprecated (but still functional)

**Recommended Fix**:
```javascript
DATABASE_URL: z.url(),
```

---

### ✅ LOW/NO IMPACT - Not Used in Codebase

The following breaking changes **do not affect** this codebase:

- ❌ Error customization (`message`, `invalid_type_error`, `required_error`, `errorMap`) - **Not used**
- ❌ String format methods (`.email()`, `.uuid()`, etc.) - **Not used**
- ❌ `z.nativeEnum()` - **Not used**
- ❌ `z.number()` infinite values - **Not used**
- ❌ `.refine()` / `.superRefine()` - **Not used**
- ❌ `z.promise()` - **Not used**
- ❌ `z.function()` - **Not used**
- ❌ `z.record()` - **Not used**
- ❌ `z.intersection()` / `.and()` - **Not used**
- ❌ `.default()` / `.prefault()` - **Not used**
- ❌ `z.coerce` input type changes - **Not used**

---

## Migration Steps

### Step 1: Update package.json
```bash
npm install zod@^4.0.0
```

### Step 2: Fix env.mjs
Apply the three code changes identified above in [`game/src/env.mjs`](../game/src/env.mjs:1)

### Step 3: Run Tests
```bash
cd game
npm test
```

### Step 4: Manual Testing
- Test environment validation on startup
- Test tRPC endpoints with validation
- Test error scenarios to ensure proper error handling

---

## Required Code Changes

### File: [`game/src/env.mjs`](../game/src/env.mjs:1)

#### Change 1: Update DATABASE_URL validation (Line 8)
```diff
- DATABASE_URL: z.string().url(),
+ DATABASE_URL: z.url(),
```

#### Change 2: Replace .merge() with object destructuring (Line 35)
```diff
- const merged = server.merge(client);
+ const merged = z.object({
+   ...server.shape,
+   ...client.shape,
+ });
```

#### Change 3: Replace .flatten() with z.treeifyError() (Line 55)
```diff
  console.error(
    "❌ Invalid environment variables:",
-   parsed.error.flatten().fieldErrors
+   z.treeifyError(parsed.error).fieldErrors
  );
```

---

## Testing Strategy

### Unit Tests
- ✅ Existing test suite should pass without modification
- ✅ No test-specific Zod APIs are used
- ✅ All tRPC router tests use standard validation patterns

### Integration Tests
1. **Environment Validation**
   - Test with valid env vars → should pass
   - Test with invalid DATABASE_URL → should fail with proper error
   - Test with missing NODE_ENV → should fail with proper error

2. **tRPC Input Validation**
   - Test all router endpoints with valid inputs
   - Test with invalid inputs to ensure proper error messages
   - Verify error format compatibility with existing error handling

### Manual Testing Checklist
- [ ] Application starts successfully
- [ ] Database connection works
- [ ] All tRPC endpoints validate inputs correctly
- [ ] Error messages are still user-friendly
- [ ] No console errors related to Zod

---

## Risk Assessment

### Low Risk ✅
- Minimal code changes (1 file, 3 locations)
- No usage of complex deprecated features
- Mostly basic schema validation patterns
- Well-tested codebase

### Potential Issues 🚨
1. **Error Object Structure**: The error format from `z.treeifyError()` might differ slightly from `.flatten()`. Need to verify error handling works as expected.

2. **Type Changes**: The merged schema type inference might behave slightly differently. If TypeScript errors appear, may need to adjust type annotations.

3. **Runtime Behavior**: While unlikely, validation behavior could have subtle differences. Comprehensive testing is important.

---

## Rollback Plan

If issues arise after upgrade:

1. **Quick Rollback**:
   ```bash
   npm install zod@^3.25.76
   git checkout game/src/env.mjs
   ```

2. **Alternative**: Pin to last v3 version temporarily while investigating issues

---

## Benefits of Upgrading

1. **Performance**: Zod v4 has significant performance improvements
2. **Better APIs**: More intuitive and consistent error handling
3. **Tree-shaking**: Better bundle size optimization
4. **Future-proof**: Stay current with latest Zod features and fixes
5. **Ecosystem**: Better compatibility with tools building on Zod v4

---

## Additional Notes

### Why These Changes Are Safe

1. **`.merge()` → object destructuring**: Functionally identical, just more explicit
2. **`.flatten()` → `z.treeifyError()`**: Same output structure, different API
3. **`z.string().url()` → `z.url()`**: New method is more tree-shakable and efficient

### Backwards Compatibility

The old APIs are **deprecated but not removed** in early v4 versions, so the migration can be gradual if needed. However, it's best to update all at once to avoid future deprecation warnings.

---

## Timeline Estimate

- **Code Changes**: 15 minutes
- **Testing**: 30-45 minutes
- **Total**: ~1 hour

---

## References

- [Zod v4 Migration Guide](https://zod.dev/migration)
- [Zod v4 Introductory Post](https://zod.dev/v4)
- [Error Formatting Documentation](https://zod.dev/error-formatting)
