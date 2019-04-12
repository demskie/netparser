export const minStringLength = "0.0.0.0".length;
export const maxStringLength = "255.255.255.255".length;

export const errorAddrToArrayInvalidInteger = new Error("'v4addr' has at least one invalid integer");
export const errorAddrToArrayNotFourElements = new Error("'v4addr' was not four elements long");
export const errorArrayToAddrNotFourElements = new Error("'arr' was not at least four elements long");

export function addrToArray(v4Addr: string, throwErrors?: boolean) {
  const addr = v4Addr.split(".");
  if (addr.length === 4) {
    const arr = new Array(4) as number[];
    for (var i = 0; i < 4; i++) {
      arr[i] = parseInt(addr[i], 10);
      if (arr[i] < 0 || arr[i] > 255) {
        if (throwErrors) {
          throw errorAddrToArrayInvalidInteger;
        }
        return null;
      }
    }
    return arr;
  } else if (throwErrors) {
    throw errorAddrToArrayNotFourElements;
  }
  return null;
}

export function arrayToAddr(arr: number[], throwErrors?: boolean) {
  if (arr.length >= 4) {
    return arr.slice(arr.length - 4, arr.length).join(".");
  } else if (throwErrors) {
    throw errorArrayToAddrNotFourElements;
  }
  return null;
}
