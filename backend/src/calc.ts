/* eslint-disable @typescript-eslint/restrict-template-expressions,
                  @typescript-eslint/no-unsafe-member-access */
const [, , /*node*/ /*script*/ op, a, b] = process.argv;

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
    case 'add':
      return x + y;
    case 'sub':
      return x - y;
    case 'mul':
      return x * y;
    case 'div':
      if (y === 0) {
        throw new Error('Cannot divide by zero.');
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
  console.error(
    `Invalid operation: ${String(op)}. Must be one of: ${validOperations.join(', ')}`,
  );
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
