# Day 2 – Generics, Utility Types & `fetch`

Day 2 builds on yesterday’s basics by introducing **generics**, **utility types**, and a real HTTP request using the global `fetch` API (Node ≥ 18). All exercises live in `backend/src` so you can run them with **ts-node**.

---

## 1 · Generic JSON helper

**File:** `src/fetchJson.ts`

```ts
/**
 * fetchJson<T> – tiny wrapper that returns parsed JSON typed as T.
 * T is constrained to `object` so primitives like number | string are rejected.
 */
export async function fetchJson<T extends object>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as unknown as T;
}
```

Why T extends object?
It blocks callers from passing primitives (string, number, etc.) but accepts normal interfaces like Pokemon, avoiding the earlier Record<string, unknown> constraint error.

## 2 · Real fetch: Pokémon client

**File:** `src/pokemonClient.ts`

```ts
import { fetchJson } from './fetchJson';

interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
}

void (async () => {
  const pikachu = await fetchJson<Pokemon>(
    'https://pokeapi.co/api/v2/pokemon/pikachu',
  );
  console.log(`#${pikachu.id} – ${pikachu.name}`);
  console.log('Sprite URL:', pikachu.sprites.front_default);
})();
```

`void` before the IIFE satisfies the `@typescript-eslint/no-floating-promises` rule.

## 3 · Utility Types demo

**File:** `src/utility-types-demo.ts`

```ts
interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
}

type UserPreview  = Pick<User, 'id' | 'name'>; // keep some keys
type PartialUser  = Partial<User>;             // all optional
type ReadonlyUser = Readonly<User>;            // immutable

// underscore => ESLint ignores "unused" in demo variables
const _preview: UserPreview  = { id: '42', name: 'Rosi' };
const _draft:   PartialUser  = { name: 'Draft Name' };
const _frozen:  ReadonlyUser = {
  id: '1',
  name: 'Admin',
  email: 'admin@example.com',
  admin: true,
};
```

## 4 · Commands executed (chronological)

```bash
# 1 – type-check everything
cd backend
npx tsc --noEmit
```

```bash
# 2 – run Pokémon demo
npx ts-node src/pokemonClient.ts
```

```bash
# 3 – auto-format Day 2 files
npx prettier --write src/{fetchJson.ts,pokemonClient.ts,utility-types-demo.ts}
```

```bash
# 4 – auto-fix lint issues
npx eslint --fix src
```

```bash
# 5 – verify zero compiler + zero linter errors
npx tsc --noEmit
npx eslint src --max-warnings 0
```

## 🛠 ESLint tweaks added

`void bootstrap();` in `main.ts`
Silences `no-floating-promises` for Nest’s entrypoint.

Root `eslint.config.mjs`:

```ts
'@typescript-eslint/no-unused-vars': [
  'error',
  { varsIgnorePattern: '^_' } // ignore _preview, _draft, _frozen
]
```

## 🔑 Concept checkpoints

| Concept                                   | File                  |
| ----------------------------------------- | --------------------- |
| Generics & constraint (`extends object`)  | `fetchJson.ts`        |
| Async/await with `fetch`                  | `pokemonClient.ts`    |
| Utility types (`Pick`, `Partial`, `Readonly`) | `utility-types-demo.ts` |
| Linter hygiene (`void`, underscore vars, Prettier) | all                   |

## ✅ Day 2 Complete

*   Safe generic fetch helper
*   Real API call (Pokémon)
*   Hands-on with key utility types
*   Clean build: 0 TS errors, 0 ESLint errors

Next up: Day 3 – Full-Stack Integration (Nest + React).
