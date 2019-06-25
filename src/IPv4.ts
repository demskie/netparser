import * as errors from "./errors";
import * as shared from "./shared";
import * as weight from "./weight";

export function bytesToAddr(bytes: number[], throwErrors?: boolean) {
  if (bytes.length === 4) return `${bytes[0]}.${bytes[1]}.${bytes[2]}.${bytes[3]}`;
  if (throwErrors) throw errors.BytesNotFourElements;
  return null;
}

export function randomAddress() {
  return bytesToAddr(Array.from(Array(4), () => Math.random() * 255));
}

const choices = Array.from(Array(31), (_, idx) => new weight.WeightedValue(Math.pow(2, idx), idx + 1));

export function randomNetwork() {
  const bytes = Array.from(Array(4), () => Math.random() * 255);
  const cidr = weight.getValue(choices) as number;
  shared.applySubnetMask(bytes, cidr);
  return `${bytesToAddr(bytes)}/${cidr}`;
}
