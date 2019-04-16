import * as shared from "./shared";
import * as errors from "./errors";

function padZeros(addr: string, throwErrors?: boolean) {
  if (addr.length >= 2) {
    if (addr.slice(0, 2) === "::") {
      addr = "0" + addr;
    }
    if (addr.slice(addr.length - 2) === "::") {
      addr += "0";
    }
  }
  const splitAddr = addr.split("::");
  if (splitAddr.length === 1) {
    return addr;
  } else if (splitAddr.length === 2) {
    const hextetCount = splitAddr[0].split(":").length + splitAddr[1].split(":").length;
    splitAddr[0] += shared.repeatString(":0", 8 - hextetCount);
    return splitAddr.join(":");
  }
  if (throwErrors) throw errors.GenericPadZeros;
  return null;
}

// Network-Specific Prefix   IPv4          IPv4-embedded IPv6 address
// 2001:db8:122:344::/96     192.0.2.33    2001:db8:122:344::192.0.2.33
// https://tools.ietf.org/html/rfc6052

export function convertEmbeddedIPv4(addr: string) {
  let hextets = addr.split(":");
  const octets = hextets[hextets.length - 1].split(".");
  if (octets.length === 4) {
    const a = parseInt(octets[0], 10).toString(16);
    const b = parseInt(octets[1], 10).toString(16);
    const c = parseInt(octets[2], 10).toString(16);
    const d = parseInt(octets[3], 10).toString(16);
    hextets = hextets.slice(0, hextets.length - 1);
    hextets.push(parseInt(a + b, 16).toString(16));
    hextets.push(parseInt(c + d, 16).toString(16));
    addr = hextets.join(":");
  }
  return addr;
}

export function addrToBytes(addr: string, throwErrors?: boolean) {
  const padded = padZeros(addr);
  if (padded !== null) {
    const hextets = padded.split(":");
    if (hextets.length === 8) {
      const arr = new Uint8Array(16);
      for (var j = 0; j < 8; j++) {
        const hextet = hextets[j];
        switch (hextet.length) {
          case 1:
          case 2:
            arr[2 * j] = 0;
            arr[2 * j + 1] = parseInt(hextet, 16);
            break;
          case 3:
          case 4:
            const val = parseInt(hextet, 16);
            arr[2 * j] = Math.floor(val / 256);
            arr[2 * j + 1] = val % 256;
            break;
          default:
            if (throwErrors) throw errors.GenericAddrToBytes;
            return null;
        }
      }
      return arr;
    }
  }
  if (throwErrors) throw errors.GenericAddrToBytes;
  return null;
}

function findLongestZeroHextetChain(bytes: Uint8Array, throwErrors?: boolean) {
  if (bytes.length >= 16) {
    bytes = bytes.subarray(bytes.length - 16);
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

export function bytesToAddr(bytes: Uint8Array, throwErrors?: boolean) {
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
