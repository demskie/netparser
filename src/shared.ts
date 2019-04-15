import * as v4 from "./IPv4";
import * as v6 from "./IPv6";

export const errorGenericRemoveCIDR = new Error("more than one '/' was detected");
export const errorGenericGetCIDR = new Error("unable to get CIDR from subnet string");
export const errorGenericOffsetAddressWithCIDR = new Error("unable to offset address");
export const errorOverflowedAddressSpace = new Error("address space overflow detected");

export function hasColon(s: string) {
  return s.search(":") >= 0;
}

export function addrToBytes(addr: string, throwErrors?: boolean) {
  if (hasColon(addr)) {
    return v6.addrToBytes(addr, throwErrors);
  }
  return v4.addrToBytes(addr, throwErrors);
}

export function bytesToAddr(bytes: Uint8Array, throwErrors?: boolean) {
  if (bytes.length === 16) {
    return v6.bytesToAddr(bytes, throwErrors);
  }
  return v4.bytesToAddr(bytes, throwErrors);
}

export function repeatString(s: string, count: number) {
  var result = "";
  for (var i = 0; i < count; i++) {
    result += s;
  }
  return result;
}

export function removeCIDR(s: string, throwErrors?: boolean) {
  const splitAddr = s.split("/");
  switch (splitAddr.length) {
    case 0:
    case 1:
      return s;
    case 2:
      return splitAddr[0];
  }
  if (throwErrors) throw errorGenericRemoveCIDR;
  return null;
}

export function getCIDR(s: string, throwErrors?: boolean) {
  const splitAddr = s.split("/");
  if (splitAddr.length === 2) {
    const val = parseInt(splitAddr[1], 10);
    if (Number.isInteger(val)) {
      return val;
    }
  }
  if (throwErrors) throw errorGenericGetCIDR;
  return null;
}

export function removeBrackets(s: string) {
  return s.replace("[|]", "");
}

export function duplicateAddress(bytes: Uint8Array) {
  return bytes.slice();
}

export function setAddress(src: Uint8Array, dst: Uint8Array) {
  for (var i = 0; i < src.length; i++) {
    if (i < dst.length) {
      dst[i] = src[i];
    } else {
      return;
    }
  }
}

export enum cmp {
  before = -1,
  equals = 0,
  after = 1
}

export function compareAddresses(a: Uint8Array, b: Uint8Array) {
  if (a !== b) {
    if (a.length < b.length) {
      return cmp.before;
    } else if (a.length > b.length) {
      return cmp.after;
    }
    for (var i = 0; i < a.length; i++) {
      if (a[i] < b[i]) return cmp.before;
      if (a[i] > b[i]) return cmp.after;
    }
  }
  return cmp.equals;
}

function offsetAddress(bytes: Uint8Array, cidr: number, isPositive: boolean, throwErrors?: boolean): Uint8Array | null {
  const targetByte = Math.floor((cidr - 1) / 8);
  if (targetByte < bytes.length) {
    const increment = Math.pow(2, 8 - (cidr - targetByte * 8));
    const unconstrained = bytes[targetByte] + increment * (isPositive ? 1 : -1);
    bytes[targetByte] = unconstrained % 256;
    if (0 <= unconstrained && unconstrained <= 255) {
      return bytes;
    }
    if (targetByte > 0) {
      const supernetCIDR = targetByte * 8;
      return offsetAddress(bytes, supernetCIDR, isPositive, throwErrors);
    }
    if (throwErrors) throw errorOverflowedAddressSpace;
    return null;
  }
  if (throwErrors) throw errorGenericOffsetAddressWithCIDR;
  return null;
}

export function increaseAddressWithCIDR(bytes: Uint8Array, cidr: number, throwErrors?: boolean) {
  if (cidr > 0 && (bytes.length === 4 || bytes.length === 16)) {
    return offsetAddress(bytes, cidr, true, throwErrors);
  }
  if (throwErrors) throw errorGenericOffsetAddressWithCIDR;
  return null;
}

export function decreaseAddressWithCIDR(bytes: Uint8Array, cidr: number, throwErrors?: boolean) {
  if (cidr > 0 && (bytes.length === 4 || bytes.length === 16)) {
    return offsetAddress(bytes, cidr, false, throwErrors);
  }
  if (throwErrors) throw errorGenericOffsetAddressWithCIDR;
  return null;
}

export function applySubnetMask(bytes: Uint8Array, cidr: number) {
  let maskBits = bytes.length * 8 - cidr;
  for (var i = bytes.length - 1; i >= 0; i--) {
    switch (Math.max(0, Math.min(8, maskBits))) {
      case 0:
        return bytes;
      case 1:
        bytes[i] &= ~1;
        break;
      case 2:
        bytes[i] &= ~3;
        break;
      case 3:
        bytes[i] &= ~7;
        break;
      case 4:
        bytes[i] &= ~15;
        break;
      case 5:
        bytes[i] &= ~31;
        break;
      case 6:
        bytes[i] &= ~63;
        break;
      case 7:
        bytes[i] &= ~127;
        break;
      case 8:
        bytes[i] = 0;
        break;
    }
    maskBits -= 8;
  }
  return bytes;
}
