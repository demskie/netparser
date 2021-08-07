export class WeightedValue {
  public weight: number;
  public value: unknown;
  public constructor(weight?: number, value?: unknown) {
    this.weight = weight ? weight : 0;
    this.value = value ? value : null;
  }
}

export function getValue(choices: WeightedValue[]) {
  let max = 0;
  for (let choice of choices) {
    max += Math.max(0, choice.weight);
  }
  let num = Math.floor(Math.random() * max);
  for (let choice of choices) {
    num -= Math.max(0, choice.weight);
    if (num < 0) {
      return choice.value;
    }
  }
  return null;
}
