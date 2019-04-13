import * as v4 from "./IPv4";
import * as v6 from "./IPv6";
import * as common from "./common";

/**
 * Parse an IP address
 *
 * @remarks
 * Verify that an external source provided a valid IP address
 *
 * @param s - An address (192.168.0.0) or subnet (192.168.0.0/24)
 * @param throwErrors - Stop the library from failing silently
 * @returns The parsed IP address or null in case of error
 */
export function ip(s: string, throwErrors?: boolean) {
  if (s.search(":") >= 0) {
    s = common.removeBrackets(s);
    const ip = common.removeCIDR(s, throwErrors);
    if (ip !== null) {
      const bytes = v6.addrToBytes(ip, throwErrors);
      if (bytes !== null) {
        return v6.bytesToAddr(bytes, throwErrors);
      }
    }
    return null;
  }
  const ip = common.removeCIDR(s, throwErrors);
  if (ip !== null) {
    const bytes = v4.addrToBytes(s, throwErrors);
    if (bytes !== null) {
      return v4.bytesToAddr(bytes, throwErrors);
    }
  }
  return null;
}

/**
 * Given a random subnet address, what is it's network address
 *
 * @example
 * netparser.subnetZero("192.168.0.4/24") // returns 192.168.0.0
 *
 * @param s - The subnet (192.168.0.0/24)
 * @param throwErrors - Stop the library from failing silently
 * @returns The first address in a subnet or null in case of error
 */
export function subnetZero(s: string, throwErrors?: boolean) {
  if (s.search(":") >= 0) {
    s = common.removeBrackets(s);
    const ip = common.removeCIDR(s, throwErrors);
    const cidr = common.getCIDR(s, throwErrors);
    if (ip !== null && cidr !== null) {
      const bytes = v6.addrToBytes(ip, throwErrors);
      if (bytes === null) {
        return bytes;
      }
      common.applySubnetMask(bytes, cidr);
      return v6.bytesToAddr(bytes, throwErrors);
    }
    return null;
  }
  const ip = common.removeCIDR(s, throwErrors);
  const cidr = common.getCIDR(s, throwErrors);
  if (ip !== null && cidr !== null) {
    const bytes = v4.addrToBytes(s, throwErrors);
    if (bytes === null) {
      return bytes;
    }
    common.applySubnetMask(bytes, cidr);
    return v4.bytesToAddr(bytes, throwErrors);
  }
  return null;
}
