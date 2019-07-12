/* eslint-disable @typescript-eslint/no-use-before-define */

import * as errors from "./errors";

export function network(s: string, throwErrors?: boolean) {
  s = s.trim();
  var parts = s.split("/");
  if (parts.length === 0 || parts.length > 2) return null;
  var isIPv4 = looksLikeIPv4(s);
  if (isIPv4 === null) {
    if (throwErrors) throw errors.GenericNetworkParse;
    return null;
  }
  var cidr = isIPv4 ? 32 : 128;
  if (parts.length === 2) {
    var x = parseIntRange(parts[1], 0, cidr);
    if (x === null) {
      if (throwErrors) throw errors.GenericNetworkParse;
      return null;
    }
    cidr = x;
  }
  var bytes = isIPv4 ? v4AddrToBytes(parts[0]) : v6AddrToBytes(parts[0]);
  if (bytes === null) {
    if (throwErrors) throw Error(`could not convert string to bytes`); //errors.GenericNetworkParse;
    return null;
  }
  return { bytes, cidr };
}

function looksLikeIPv4(s: string) {
  for (var c of s) {
    if (c === ".") return true;
    if (c === ":") return false;
  }
  return null;
}

function parseIntRange(old: string, min: number, max: number) {
  var s = "";
  for (var i = 0; i < old.length; i++) {
    if (!isOneDigit(old[i])) break;
    s += old[i];
  }
  var x = parseInt(s, 10);
  if (x >= min && x <= max) return x;
  return null;
}

function isOneDigit(s: string) {
  switch (s) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      return true;
    default:
      return false;
  }
}

export function v4AddrToBytes(old: string) {
  var bytes = new Array(4) as number[];
  var parts = old.split(".");
  if (parts.length === 4) {
    for (var i = 0; i < parts.length; i++) {
      var x = parseInt(parts[i], 10);
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
  https://tools.ietf.org/html/rfc3986
    ffff:fc00::1:1234/64
    [fde4:3510:269e:ffbd::/64]
  https://tools.ietf.org/html/rfc4291
  https://tools.ietf.org/html/rfc5952#section-4
    [2001:db8::1]:80
    2001:db8::1:80
    2001:db8::1.80
    2001:db8::1 port 80
    2001:db8::1p80
    2001:db8::1#80
*/

export function v6AddrToBytes(old: string) {
  const bytes = new Array(16).fill(0) as number[];
  if (old.length === 0) return null;
  if (old[0] === "[") {
    old = removeBrackets(old);
  }
  if (old === "::") return bytes;
  var halves = old.split("::");
  if (halves.length === 0 || halves.length > 2) return null;
  var leftByteIndex = 0;
  if (halves[0] !== "") {
    var leftParts = halves[0].split(":");
    for (var i = 0; i < leftParts.length; i++) {
      if (leftByteIndex >= 16) return bytes;
      var x = parseInt(leftParts[i], 16);
      if (Number.isNaN(x)) {
        var ipv4Parts = leftParts[i].split(".");
        if (ipv4Parts.length !== 4) return null;
        for (var j = 0; j < ipv4Parts.length; j++) {
          x = parseInt(ipv4Parts[j], 10);
          if (Number.isNaN(x) || x < 0 || x > 255) return null;
          bytes[leftByteIndex++] = x;
        }
        continue;
      }
      if (x < 0 || x > 65535) return null;
      bytes[leftByteIndex++] = Math.floor(x / 256);
      bytes[leftByteIndex++] = Math.floor(x % 256);
    }
  }
  if (halves.length === 2 && halves[1] !== "") {
    return parseRightHalf(bytes, leftByteIndex, halves[1].split(":"));
  }
  return bytes;
}

function removeBrackets(s: string) {
  for (var i = s.length - 1; i >= 0; i--) {
    if (s[i] === "]") {
      return s.substring(1, i);
    }
  }
  return s.substring(1);
}

function parseRightHalf(bytes: number[], leftByteIndex: number, rightParts: string[]) {
  var rightByteIndex = 15;
  for (var i = rightParts.length - 1; i >= 0; i--) {
    if (leftByteIndex > rightByteIndex) return null;
    var x = parseInt(rightParts[i], 16);
    if (Number.isNaN(x)) {
      var ipv4Parts = rightParts[i].split(".");
      if (ipv4Parts.length !== 4) return null;
      for (var j = ipv4Parts.length - 1; j >= 0; j--) {
        x = parseInt(ipv4Parts[j], 10);
        if (Number.isNaN(x) || x < 0 || x > 255) return null;
        bytes[rightByteIndex--] = x;
      }
      continue;
    }
    if (x < 0 || x > 65535) return null;
    bytes[rightByteIndex--] = Math.floor(x % 256);
    bytes[rightByteIndex--] = Math.floor(x / 256);
  }
  return bytes;
}
