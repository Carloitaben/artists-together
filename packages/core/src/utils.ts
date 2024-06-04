/**
 * Randomly selects and returns one element from the provided array.
 */
export function oneOf<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]!
}

/**
 * Throws an error and shows a TypeScript error
 * when a value is encountered that should be of type `never`.
 */
export function unreachable(
  value: never,
  message = "Unreachable value",
): never {
  throw new Error(`${message}: '${value}'`)
}

/**
 * Returns a random integer
 * between the specified minimum and maximum values (inclusive).
 */
export function between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Resolves a promise after the specified number of milliseconds.
 */
export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
