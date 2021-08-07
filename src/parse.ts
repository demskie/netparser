/* eslint-disable @typescript-eslint/no-use-before-define */

import * as errors from "./errors";

export function network(s: string, throwErrors?: boolean) {
  s = s.trim();
  let parts = s.split("/");
  if (parts.length === 0 || parts.length > 2) return null;
  let isIPv4 = looksLikeIPv4(s);
  if (isIPv4 === null) {
    if (throwErrors) throw errors.GenericNetworkParse;
    return null;
  }
  let cidr = isIPv4 ? 32 : 128;
  if (parts.length === 2) {
    let x = parseIntRange(parts[1], 0, cidr);
    if (x === null) {
      if (throwErrors) throw errors.GenericNetworkParse;
      return null;
    }
    cidr = x;
  }
  let bytes = isIPv4 ? v4AddrToBytes(parts[0]) : v6AddrToBytes(parts[0]);
  if (bytes === null) {
    if (throwErrors) throw errors.GenericNetworkParse;
    return null;
  }
  return { bytes, cidr };
}

function looksLikeIPv4(s: string) {
  for (let c of s) {
    if (c === ".") return true;
    if (c === ":") return false;
  }
  return null;
}

function parseIntRange(old: string, min: number, max: number) {
  let s = "";
  for (let i = 0; i < old.length; i++) {
    if (Number.isNaN(parseInt(old[i], 10))) break;
    s += old[i];
  }
  let x = parseInt(s, 10);
  if (x >= min && x <= max) return x;
  return null;
}

export function v4AddrToBytes(old: string) {
  let bytes = new Array(4) as number[];
  let parts = old.split(".");
  if (parts.length === 4) {
    for (let i = 0; i < parts.length; i++) {
      let x = parseInt(parts[i], 10);
      if (x >= 0 && x <= 255) {
        bytes[i] = x;
      } else {
        return null;
      }
    }
    return bytes;
  }
  return null;
}

/* 
  https://tools.ietf.org/html/rfc4291
  https://tools.ietf.org/html/rfc5952#section-4
  https://tools.ietf.org/html/rfc3986
    ffff:fc00::1:1234/64
    [fde4:3510:269e:ffbd::]
    [2001:db8::1]:80
    2001:db8::1:80  // not valid!
    2001:db8::1.80
    2001:db8::1 port 80
    2001:db8::1p80
    2001:db8::1#80
*/

export function v6AddrToBytes(s: string) {
  const bytes = new Array(16).fill(0) as number[];
  if (s.length === 0) return null;
  s = removeBrackets(s);
  if (s === "::") return bytes;
  let halves = s.split("::");
  if (halves.length === 0 || halves.length > 2) return null;
  let leftByteIndex = parseLeftHalf(bytes, halves[0]);
  if (leftByteIndex === null) return null;
  if (halves.length === 2) {
    let rightByteIndex = parseRightHalf(bytes, halves[1], leftByteIndex);
    if (rightByteIndex === null) return null;
  }
  return bytes;
}

function removeBrackets(s: string) {
  if (s.startsWith("[")) {
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i] === "]") {
        return s.substring(1, i);
      }
    }
  }
  return s;
}

function parseHextet(s: string) {
  if (s.trim().length < 1 || s.trim().length > 4) return Number.NaN;
  let val = 0;
  for (let i = 0; i < s.length; i++) {
    let x = parseInt(s[i], 16);
    if (Number.isNaN(x)) return x;
    val += x * Math.pow(2, 4 * (s.length - i - 1));
  }
  return val;
}

function parseLeftHalf(bytes: number[], leftHalf: string) {
  let leftByteIndex = 0;
  if (leftHalf !== "") {
    let leftParts = leftHalf.split(":");
    for (let i = 0; i < leftParts.length; i++) {
      if (leftByteIndex >= 16) return null;
      let ipv4Parts = leftParts[i].split(".");
      if (ipv4Parts.length === 0) return null;
      if (ipv4Parts.length !== 4) {
        let x = parseHextet(leftParts[i]);
        if (Number.isNaN(x) || x < 0 || x > 65535) return null;
        bytes[leftByteIndex++] = Math.floor(x / 256);
        bytes[leftByteIndex++] = Math.floor(x % 256);
      } else {
        for (let j = 0; j < ipv4Parts.length; j++) {
          let x = Number(ipv4Parts[j]);
          if (Number.isNaN(x) || x < 0 || x > 255) return null;
          bytes[leftByteIndex++] = x;
        }
      }
    }
  }
  return leftByteIndex;
}

function removePortInfo(s: string) {
  return s.replace(/(#|p|\.).*/g, "").trim();
}

function parseRightHalf(bytes: number[], rightHalf: string, leftByteIndex: number) {
  let rightByteIndex = 15;
  if (rightHalf !== "") {
    let rightParts = rightHalf.split(":");
    for (let i = rightParts.length - 1; i >= 0; i--) {
      if (rightParts[i].trim() === "") return null;
      if (leftByteIndex > rightByteIndex) return null;
      let ipv4Parts = rightParts[i].split(".");
      if (ipv4Parts.length === 0) return null;
      if (ipv4Parts.length !== 4) {
        if (i === rightParts.length - 1) {
          rightParts[i] = removePortInfo(rightParts[i]);
        }
        let x = parseHextet(rightParts[i]);
        if (Number.isNaN(x) || x < 0 || x > 65535) return null;
        bytes[rightByteIndex--] = Math.floor(x % 256);
        bytes[rightByteIndex--] = Math.floor(x / 256);
      } else {
        for (let j = ipv4Parts.length - 1; j >= 0; j--) {
          let x = Number(ipv4Parts[j]);
          if (Number.isNaN(x) || x < 0 || x > 255) return null;
          bytes[rightByteIndex--] = x;
        }
      }
    }
  }
  return rightByteIndex;
}
