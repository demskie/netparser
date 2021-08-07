import * as errors from "./errors";
import * as weight from "./weight";
import { Network } from "./network";
import { Address } from "./address";

function findLongestZeroHextetChain(bytes: number[], throwErrors?: boolean) {
  if (bytes.length === 16) {
    const canidate = { start: 0, length: 0 };
    const longest = { start: 0, length: 0 };
    for (let i = 0; i < bytes.length; i += 2) {
      if (bytes[i] !== 0 || bytes[i + 1] !== 0) {
        canidate.start = 0;
        canidate.length = 0;
      } else {
        if (canidate.length === 0) {
          canidate.start = i;
        }
        canidate.length += 2;
        if (canidate.length > longest.length) {
          longest.start = canidate.start;
          longest.length = canidate.length;
        }
      }
    }
    return longest;
  }
  if (throwErrors) throw errors.GenericFindLongestZeroHextetChain;
  return null;
}

export function bytesToAddr(bytes: number[], throwErrors?: boolean) {
  const longestHextetChain = findLongestZeroHextetChain(bytes, throwErrors);
  if (longestHextetChain !== null) {
    let result = "";
    for (let i = 0; i < 16; i += 2) {
      if (i === longestHextetChain.start && longestHextetChain.length >= 4) {
        result += i === 0 ? "::" : ":";
        i += longestHextetChain.length - 2;
      } else {
        result += (bytes[i] * 256 + bytes[i + 1]).toString(16);
        result += i === 14 ? "" : ":";
      }
    }
    return result;
  }
  if (throwErrors) throw errors.GenericBytesToAddr;
  return null;
}

export function randomAddress() {
  return bytesToAddr(Array.from(Array(16), () => Math.floor(Math.random() * 256)));
}

const choices = Array.from(Array(127), (_, idx) => new weight.WeightedValue(Math.pow(2, idx), idx + 1));

export function randomNetwork() {
  const bytes = Array.from(Array(16), () => Math.floor(Math.random() * 256));
  const addr = new Address().setBytes(bytes);
  const cidr = weight.getValue(choices) as number;
  return new Network().from(addr, cidr);
}
