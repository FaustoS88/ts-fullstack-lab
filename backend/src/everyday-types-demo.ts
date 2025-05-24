export {};
// Primitive types
const greeting = 'Hola, TypeScript!';
const lucky = 7;

// Union + narrowing
function padLeft(value: string, padding: number | string) {
  return typeof padding === 'number'
    ? ' '.repeat(padding) + value
    : padding + value;
}

// Type alias vs interface
type Point = { x: number; y: number };
interface Labeled {
  label: string;
}
function print(pt: Point & Labeled) {
  console.log(`${pt.label}: (${pt.x}, ${pt.y})`);
}

// Enum
enum Language {
  ES = 'es',
  EN = 'en',
}
const current: Language = Language.EN;

// Demo use so ESLint doesn’t complain
print({ label: padLeft(greeting, 3), x: lucky, y: 0 });
console.log('Language:', current);
