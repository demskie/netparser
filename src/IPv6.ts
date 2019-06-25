import * as shared from "./shared";
import * as errors from "./errors";
import * as weight from "./weight";

function findLongestZeroHextetChain(bytes: number[], throwErrors?: boolean) {
  if (bytes.length === 16) {
    const canidate = { start: 0, length: 0 };
    const longest = { start: 0, length: 0 };
    for (var i = 0; i < bytes.length; i += 2) {
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
    var result = "";
    for (var i = 0; i < 16; i += 2) {
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
  return bytesToAddr(Array.from(Array(16), () => Math.random() * 255));
}

const choices = Array.from(Array(127), (_, idx) => new weight.WeightedValue(Math.pow(2, idx), idx + 1));

export function randomNetwork() {
  const bytes = Array.from(Array(16), () => Math.random() * 255);
  const cidr = weight.getValue(choices) as number;
  shared.applySubnetMask(bytes, cidr);
  return `${bytesToAddr(bytes)}/${cidr}`;
}
