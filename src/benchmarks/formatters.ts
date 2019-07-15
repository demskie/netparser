export function fixedWidth(s: string, n: number) {
  return "\t" + s + " ".repeat(Math.max(0, n - s.length));
}
