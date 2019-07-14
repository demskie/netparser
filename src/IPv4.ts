import * as errors from "./errors";
import * as weight from "./weight";

import { Network } from "./network";
import { Address } from "./address";

export function bytesToAddr(bytes: number[], throwErrors?: boolean) {
  if (bytes.length === 4) return `${bytes[0]}.${bytes[1]}.${bytes[2]}.${bytes[3]}`;
  if (throwErrors) throw errors.BytesNotFourElements;
  return null;
}

export function randomAddress() {
  return bytesToAddr(Array.from(Array(4), () => Math.floor(Math.random() * 256)));
}

const choices = Array.from(Array(31), (_, idx) => new weight.WeightedValue(Math.pow(2, idx), idx + 1));

export function randomNetwork() {
  const bytes = Array.from(Array(4), () => Math.floor(Math.random() * 256));
  const addr = new Address().setBytes(bytes);
  const cidr = weight.getValue(choices) as number;
  return new Network().from(addr, cidr);
}
