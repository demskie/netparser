export const errorGenericRemoveCIDR = new Error("more than one '/' was detected");
export const errorGenericOffsetArrayWithCIDR = new Error("unable to offset array");
export const errorOverflowedAddressSpace = new Error("address space overflow detected");

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
  if (throwErrors) {
    throw errorGenericRemoveCIDR;
  }
  return null;
}

export function removeBrackets(s: string) {
  return s.replace(`\[|\]`, "");
}

export function duplicateArray(arr: number[]) {
  const arrCopy = new Array(arr.length);
  for (var i = 0; i < arr.length; i++) {
    arrCopy[i] = arr[i];
  }
  return arrCopy;
}

export function offsetArrayWithCIDR(arr: number[], cidr: number, throwErrors?: boolean): number[] | null {
  if (cidr > 0 && (arr.length === 4 || arr.length === 16)) {
    const targetByte = Math.floor((cidr - 1) / 8);
    if (targetByte < arr.length) {
      const increment = Math.pow(2, 8 - (cidr - targetByte * 8));
      arr[targetByte] += increment;
      if (arr[targetByte] >= 256) {
        arr[targetByte] %= 256;
        if (targetByte > 0) {
          const fixOverflowCIDR = targetByte * 8;
          return offsetArrayWithCIDR(arr, fixOverflowCIDR, throwErrors);
        }
        if (throwErrors) {
          throw errorOverflowedAddressSpace;
        }
        return null;
      }
      return arr;
    }
  }
  if (throwErrors) {
    throw errorGenericOffsetArrayWithCIDR;
  }
  return null;
}
