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

function parseHextet(s: string) {
  if (s.trim().length < 1 || s.trim().length > 4) return Number.NaN;
  var val = 0;
  for (var i = 0; i < s.length; i++) {
    if (i >= 4) return Number.NaN;
    var p = 4 * (s.length - i - 1);
    switch (s[i]) {
      case "0":
        break;
      case "1":
        val += 1 * Math.pow(2, p);
        break;
      case "2":
        val += 2 * Math.pow(2, p);
        break;
      case "3":
        val += 3 * Math.pow(2, p);
        break;
      case "4":
        val += 4 * Math.pow(2, p);
        break;
      case "5":
        val += 5 * Math.pow(2, p);
        break;
      case "6":
        val += 6 * Math.pow(2, p);
        break;
      case "7":
        val += 7 * Math.pow(2, p);
        break;
      case "8":
        val += 8 * Math.pow(2, p);
        break;
      case "9":
        val += 9 * Math.pow(2, p);
        break;
      case "a":
        val += 10 * Math.pow(2, p);
        break;
      case "b":
        val += 11 * Math.pow(2, p);
        break;
      case "c":
        val += 12 * Math.pow(2, p);
        break;
      case "d":
        val += 13 * Math.pow(2, p);
        break;
      case "e":
        val += 14 * Math.pow(2, p);
        break;
      case "f":
        val += 15 * Math.pow(2, p);
        break;
      default:
        return Number.NaN;
    }
  }
  return val;
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
  var leftByteIndex = parseLeftHalf(bytes, halves[0]);
  if (leftByteIndex === null) return null;
  if (halves.length === 2) {
    var rightByteIndex = parseRightHalf(bytes, halves[1], leftByteIndex);
    if (rightByteIndex === null) return null;
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

function parseLeftHalf(bytes: number[], leftHalf: string) {
  var leftByteIndex = 0;
  if (leftHalf !== "") {
    var leftParts = leftHalf.split(":");
    for (var i = 0; i < leftParts.length; i++) {
      if (leftByteIndex >= 16) return null;
      var ipv4Parts = leftParts[i].split(".");
      if (ipv4Parts.length === 0) return null;
      if (ipv4Parts.length !== 4) {
        var x = parseHextet(leftParts[i]);
        if (Number.isNaN(x) || x < 0 || x > 65535) return null;
        bytes[leftByteIndex++] = Math.floor(x / 256);
        bytes[leftByteIndex++] = Math.floor(x % 256);
      } else {
        for (var j = 0; j < ipv4Parts.length; j++) {
          var x = Number(ipv4Parts[j]);
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
  var rightByteIndex = 15;
  if (rightHalf !== "") {
    var rightParts = rightHalf.split(":");
    for (var i = rightParts.length - 1; i >= 0; i--) {
      if (rightParts[i].trim() === "") return null;
      if (leftByteIndex > rightByteIndex) return null;
      var ipv4Parts = rightParts[i].split(".");
      if (ipv4Parts.length === 0) return null;
      if (ipv4Parts.length !== 4) {
        if (i === rightParts.length - 1) {
          rightParts[i] = removePortInfo(rightParts[i]);
        }
        var x = parseHextet(rightParts[i]);
        if (Number.isNaN(x) || x < 0 || x > 65535) return null;
        bytes[rightByteIndex--] = Math.floor(x % 256);
        bytes[rightByteIndex--] = Math.floor(x / 256);
      } else {
        for (var j = ipv4Parts.length - 1; j >= 0; j--) {
          var x = Number(ipv4Parts[j]);
          if (Number.isNaN(x) || x < 0 || x > 255) return null;
          bytes[rightByteIndex--] = x;
        }
      }
    }
  }
  return rightByteIndex;
}
