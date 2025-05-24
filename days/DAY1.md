# Day 1: Everyday Types & Simple CLI

This day focused on exploring TypeScript's basic type system and applying it by building a small command-line calculator. The goal was to gain hands-on experience with primitive types, unions, enums, and basic type declarations.

---

## 1. Everyday Types Demo

**File Created:** [`src/everyday-types-demo.ts`](ts-fullstack-lab/src/everyday-types-demo.ts:7)

```typescript
export {}; // marks file as a module
// Primitive types
let greeting: string = 'Hola, TypeScript!';
let lucky: number = 7;
let cards: blackjack: boolean = true;

// Union + narrowing
function padLeft(value: string, padding: number | string) {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + value;
  }
  return padding + value; // padding must be string here
}

// Type alias vs. interface
type Point = { x: number; y: number };
interface Labeled { label: string }

function print(pt: Point & Labeled) {
  console.log(`${pt.label}: (${pt.x}, ${pt.y})`);
}

// Enum
enum Language { ES = 'es', EN = 'en' }
const current: Language = Language.EN;
```

**Learned:**

-   How to use primitive types explicitly (`string`, `number`, `boolean`).
-   The difference between `type` and `interface` (generally, `type` for unions/aliases, `interface` for object shapes/contracts).
-   Basic function parameter narrowing using `typeof`.
-   Using `enum` for creating readable sets of named constants.

---

## 2. Simple CLI Calculator

**File Created:** [`src/calc.ts`](ts-fullstack-lab/src/calc.ts:42)

```typescript
/* eslint-disable prettier/prettier,
                  @typescript-eslint/restrict-template-expressions,
                  @typescript-eslint/no-unsafe-member-access */
const [/*node*/, /*script*/, op, a, b] = process.argv;

function toNumber(str: string | undefined): number {
  const n = Number(str);
  if (Number.isNaN(n)) {
    throw new Error(`Argument '${str}' is not a valid number.`);
  }
  return n;
}

// Define a type for the allowed operations
type Operation = 'add' | 'sub' | 'mul' | 'div';

function calculate(operation: Operation, x: number, y: number): number {
  switch (operation) {
    case 'add': return x + y;
    case 'sub': return x - y;
    case 'mul': return x * y;
    case 'div':
      if (y === 0) {
        throw new Error("Cannot divide by zero.");
      }
      return x / y;
    default:
      // This case should ideally be unreachable if 'operation' is correctly typed
      throw new Error(`Invalid operation: ${operation}`);
  }
}

// Validate operation input
const validOperations: Operation[] = ['add', 'sub', 'mul', 'div'];
if (!validOperations.includes(op as Operation)) {
  console.error(`Invalid operation: ${String(op)}. Must be one of: ${validOperations.join(', ')}`);
  process.exit(1);
}

try {
  const numA = toNumber(a);
  const numB = toNumber(b);
  const result = calculate(op as Operation, numA, numB);
  console.log(result);
} catch (error: any) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
```

**How to Run:**

```bash
ts-node src/calc.ts add 5 3   # Output: 8
ts-node src/calc.ts mul 4 2   # Output: 8
ts-node src/calc.ts div 10 0  # Output: Error: Cannot divide by zero.
ts-node src/calc.ts sub 5 foo # Output: Error: Argument 'foo' is not a valid number.
```

**Learned:**

-   Reading command-line arguments using `process.argv`.
-   Implementing type guards using `Number.isNaN`.
-   Using literal union types (e.g., `'add' | 'sub'`) to constrain string values for operations.
-   Basic error handling and exiting the process with a status code.
-   The importance of validating inputs (though `as any` was initially used for `op`, the revised code shows better practice with explicit validation). Further improvements could involve CLI argument parsing libraries like `yargs` or `commander`, or schema validation with `Zod`.

---

## 🔍 Key TypeScript Concepts Covered

-   Primitive types: `string`, `number`, `boolean`
-   Union types: `number | string`, `'add' | 'sub' | 'mul' | 'div'`
-   Function parameter type narrowing (e.g., with `typeof`)
-   Type aliases (`type Point = ...`) vs. Interfaces (`interface Labeled { ... }`)
-   Enum declarations and usage (`enum Language { ... }`)
-   Type casting (e.g., `op as Operation`, though used cautiously)
-   Accessing `process.argv` for CLI arguments

---

## 🧪 Health Check

Ensure no compilation errors:

```bash
npx tsc --noEmit
```
*(Run this command from the root of the `backend` or relevant project directory where `tsconfig.json` is configured for these files.)*

---

## ✅ Day 1 Complete

Practiced basic TypeScript syntax, built a working (and slightly more robust) CLI calculator, and tested concepts like union types, type narrowing, and type declarations.

**Next Steps:** Explore generics and `fetch` usage in Day 2.