export function fixedWidth(s: string, n: number) {
  return "    " + s + " ".repeat(Math.max(0, n - s.length));
}
