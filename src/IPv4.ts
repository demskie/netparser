import * as errors from "./errors";
import * as shared from "./shared";
import * as weight from "./weight";

export function addrToBytes(addr: string, throwErrors?: boolean) {
  const ip = addr.split(".");
  if (ip.length === 4) {
    const bytes = new Uint8Array(4);
    for (var i = 0; i < 4; i++) {
      const val = parseInt(ip[i], 10);
      if (val < 0 || val > 255) {
        if (throwErrors) throw errors.AddrInvalidInteger;
        return null;
      }
      bytes[i] = val;
    }
    return bytes;
  }
  if (throwErrors) throw errors.AddrNotFourElements;
  return null;
}

export function bytesToAddr(bytes: Uint8Array, throwErrors?: boolean) {
  if (bytes.length >= 4) {
    return bytes.slice(bytes.length - 4, bytes.length).join(".");
  }
  if (throwErrors) throw errors.BytesNotFourElements;
  return null;
}

export function randomAddress() {
  return bytesToAddr(Uint8Array.from(Array(4), () => Math.random() * 255));
}

const choices = Array.from(Array(31), (_, idx) => new weight.WeightedValue(Math.pow(2, idx), idx + 1));

export function randomNetwork() {
  const bytes = Uint8Array.from(Array(4), () => Math.random() * 255);
  const cidr = weight.getValue(choices) as number;
  shared.applySubnetMask(bytes, cidr);
  return `${bytesToAddr(bytes)}/${cidr}`;
}
