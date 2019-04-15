import * as shared from "./shared";

export const errorMixingIPv4AndIPv6 = new Error("mixing IPv4 and IPv6 is invalid");

/**
 * Parse an IP address
 *
 * @remarks
 * Verify that an external source provided a valid IP address
 *
 * @param address - Either an address like 192.168.0.0 or subnet 192.168.0.0/24
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns The parsed IP address or null in case of error
 */
export function ip(address: string, throwErrors?: boolean) {
  address = address.trim();
  if (shared.hasColon(address)) {
    address = shared.removeBrackets(address);
  }
  const ip = shared.removeCIDR(address, throwErrors);
  if (ip !== null) {
    const bytes = shared.addrToBytes(ip, throwErrors);
    if (bytes !== null) {
      return shared.bytesToAddr(bytes, throwErrors);
    }
  }
  return null;
}

/**
 * Parse a network address
 *
 * @remarks
 * Verify that an external source provided a valid network address
 *
 * @param networkAddress - A network like 192.168.0.0/24
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns The parsed network address or null in case of error
 */
export function network(networkAddress: string, throwErrors?: boolean) {
  networkAddress = networkAddress.trim();
  if (shared.hasColon(networkAddress)) {
    networkAddress = shared.removeBrackets(networkAddress);
  }
  const ip = shared.removeCIDR(networkAddress, throwErrors);
  const cidr = shared.getCIDR(networkAddress, throwErrors);
  if (ip !== null && cidr !== null) {
    const bytes = shared.addrToBytes(ip, throwErrors);
    if (bytes !== null) {
      if (!shared.increaseAddressWithCIDR(bytes, cidr, throwErrors)) return null;
      return shared.bytesToAddr(bytes, throwErrors);
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
 * @param networkAddress - A network address like 192.168.0.4/24
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns The first address in a subnet or null in case of error
 */
export function baseAddress(networkAddress: string, throwErrors?: boolean) {
  networkAddress = networkAddress.trim();
  if (shared.hasColon(networkAddress)) {
    networkAddress = shared.removeBrackets(networkAddress);
  }
  const ip = shared.removeCIDR(networkAddress, throwErrors);
  const cidr = shared.getCIDR(networkAddress, throwErrors);
  if (ip !== null && cidr !== null) {
    const bytes = shared.addrToBytes(ip, throwErrors);
    if (bytes !== null) {
      shared.applySubnetMask(bytes, cidr);
      return shared.bytesToAddr(bytes, throwErrors);
    }
  }
  return null;
}

/**
 * Returns an array of networks given a range of addresses
 *
 * @example
 * netparser.rangeOfNetworks("192.168.1.2", "192.168.1.5")  // returns ["192.168.1.2/31", "192.168.1.4/31"]
 *
 * @param start - An address like 192.168.1.2
 * @param stop - An address like 192.168.1.5
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns An array of networks or null in case of error
 */
export function rangeOfNetworks(startAddress: string, stopAddress: string, throwErrors?: boolean) {
  let start = startAddress.trim();
  let stop = stopAddress.trim();
  const startHasColon = shared.hasColon(start);
  const stopHasColon = shared.hasColon(stop);
  if (startHasColon !== stopHasColon) {
    if (throwErrors) throw errorMixingIPv4AndIPv6;
    return null;
  }
  if (startHasColon && stopHasColon) {
    start = shared.removeBrackets(start);
    stop = shared.removeBrackets(stop);
  }
  const startIP = shared.removeCIDR(start, throwErrors);
  const stopIP = shared.removeCIDR(stop, throwErrors);
  if (startIP !== null && stopIP !== null) {
    let startBytes = shared.addrToBytes(startIP, throwErrors);
    let stopBytes = shared.addrToBytes(stopIP, throwErrors);
    if (startBytes !== null && stopBytes !== null) {
      switch (shared.compareAddresses(startBytes, stopBytes)) {
        case shared.cmp.equals:
          return [start];
        case shared.cmp.after:
          [startBytes, stopBytes] = [stopBytes, startBytes];
      }
      var results = [] as string[];
      const currentBytes = shared.duplicateAddress(startBytes);
      while (shared.compareAddresses(currentBytes, stopBytes) <= 0) {
        const addrString = shared.bytesToAddr(currentBytes, throwErrors);
        var cidr = 1;
        var bytesCopy = shared.duplicateAddress(currentBytes);
        while (cidr < bytesCopy.length * 8) {
          shared.increaseAddressWithCIDR(bytesCopy, cidr, throwErrors);
          shared.decreaseAddressWithCIDR(bytesCopy, bytesCopy.length * 8, throwErrors);
          if (shared.compareAddresses(bytesCopy, stopBytes) !== shared.cmp.after) {
            shared.applySubnetMask(bytesCopy, cidr);
            if (shared.compareAddresses(bytesCopy, currentBytes) === shared.cmp.equals) break;
          }
          shared.setAddress(currentBytes, bytesCopy);
          cidr++;
        }
        results.push(`${addrString}/${cidr}`);
        shared.increaseAddressWithCIDR(currentBytes, cidr, throwErrors);
      }
      return results;
    }
  }
  return null;
}
