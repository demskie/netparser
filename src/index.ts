import * as v4 from "./IPv4";
import * as v6 from "./IPv6";
import * as common from "./common";

/**
 * Parse an IP address
 *
 * @remarks
 * Verify that an external source provided a valid IP address
 *
 * @param address - An address (192.168.0.0) or subnet (192.168.0.0/24)
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns The parsed IP address or null in case of error
 */
export function ip(address: string, throwErrors?: boolean) {
  if (address.search(":") >= 0) {
    address = common.removeBrackets(address);
    const ip = common.removeCIDR(address, throwErrors);
    if (ip !== null) {
      const bytes = v6.addrToBytes(ip, throwErrors);
      if (bytes !== null) {
        return v6.bytesToAddr(bytes, throwErrors);
      }
    }
    return null;
  }
  const ip = common.removeCIDR(address, throwErrors);
  if (ip !== null) {
    const bytes = v4.addrToBytes(address, throwErrors);
    if (bytes !== null) {
      return v4.bytesToAddr(bytes, throwErrors);
    }
  }
  return null;
}

/**
 * Return the base address for a given subnet address
 *
 * @example
 * netparser.baseAddress("192.168.0.4/24")  // returns 192.168.0.0
 *
 * @param networkAddress - (192.168.0.4/24)
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns The first address in a subnet or null in case of error
 */
export function baseAddress(networkAddress: string, throwErrors?: boolean) {
  if (networkAddress.search(":") >= 0) {
    networkAddress = common.removeBrackets(networkAddress);
    const ip = common.removeCIDR(networkAddress, throwErrors);
    const cidr = common.getCIDR(networkAddress, throwErrors);
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
  const ip = common.removeCIDR(networkAddress, throwErrors);
  const cidr = common.getCIDR(networkAddress, throwErrors);
  if (ip !== null && cidr !== null) {
    const bytes = v4.addrToBytes(networkAddress, throwErrors);
    if (bytes === null) {
      return bytes;
    }
    common.applySubnetMask(bytes, cidr);
    return v4.bytesToAddr(bytes, throwErrors);
  }
  return null;
}
