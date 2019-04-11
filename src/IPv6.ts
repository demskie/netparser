import * as common from "./common";

export const errorGenericAddrToArray = new Error("unable to convert IPv6 string to an array");
export const errorGenericArrayToAddr = new Error("unable to convert IPv6 array to string");
export const errorGenericFindLongestZeroHextetChain = new Error("unable to findLongestZeroHextetChain");
export const errorGenericPadZeros = new Error("unable to padZeros for IPv6 address");

function padZeros(v6Addr: string, throwErrors?: boolean) {
  if (v6Addr.length >= 2) {
    if (v6Addr.slice(0, 2) === "::") {
      v6Addr = "0" + v6Addr;
    }
    if (v6Addr.slice(v6Addr.length - 2) === "::") {
      v6Addr += "0";
    }
  }
  const splitAddr = v6Addr.split("::");
  if (splitAddr.length === 1) {
    return v6Addr;
  } else if (splitAddr.length === 2) {
    const hextetCount = splitAddr[0].split(":").length + splitAddr[1].split(":").length;
    splitAddr[0] += common.repeatString(":0", 8 - hextetCount);
    return splitAddr.join(":");
  }
  if (throwErrors) {
    throw errorGenericPadZeros;
  }
  return null;
}

export function addrToArray(v6Addr: string, throwErrors?: boolean) {
  const padded = padZeros(v6Addr);
  if (padded !== null) {
    const hextets = padded.split(":");
    if (hextets.length === 8) {
      const arr = new Array(16);
      for (var j = 0; j < 8; j++) {
        switch (hextets[j].length) {
          case 1:
          case 2:
            arr[2 * j] = 0;
            arr[2 * j + 1] = parseInt(hextets[j], 16);
            break;
          case 3:
          case 4:
            arr[2 * j] = parseInt(hextets[j].slice(0, 2), 16);
            arr[2 * j + 1] = parseInt(hextets[j].slice(2), 16);
            break;
          default:
            if (throwErrors) {
              throw errorGenericAddrToArray;
            }
            return null;
        }
      }
      return arr;
    }
  }
  if (throwErrors) {
    throw errorGenericAddrToArray;
  }
  return null;
}

function findLongestZeroHextetChain(arr: number[], throwErrors?: boolean) {
  if (arr.length >= 16) {
    arr = arr.slice(arr.length - 16);
    const canidate = { start: 0, length: 0 };
    const longest = { start: 0, length: 0 };
    for (var i = 0; i < arr.length; i += 2) {
      if (arr[i] !== 0 || arr[i + 1] !== 0) {
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
  if (throwErrors) {
    throw errorGenericFindLongestZeroHextetChain;
  }
  return null;
}

export function arrayToAddr(arr: number[], throwErrors?: boolean) {
  const longestHextetChain = findLongestZeroHextetChain(arr, throwErrors);
  if (longestHextetChain !== null) {
    var result = "";
    for (var i = 0; i < 16; i += 2) {
      if (i === longestHextetChain.start && longestHextetChain.length >= 4) {
        result += i === 0 ? "::" : ":";
        i += longestHextetChain.length - 2;
      } else {
        result += (arr[i] * 256 + arr[i + 1]).toString(16);
        result += i === 14 ? "" : ":";
      }
    }
    return result;
  }
  if (throwErrors) {
    throw errorGenericArrayToAddr;
  }
  return null;
}
