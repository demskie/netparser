import * as shared from "./shared";

export const errorMixingIPv4AndIPv6 = new Error("mixing IPv4 and IPv6 is invalid");
export const errorNotValidBaseNetworkAddress = new Error("not a valid base network address");
export const errorIPv6DoesNotHaveBroadcast = new Error("IPv6 does not have broadcast addresses");

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
 * BaseAddress returns the base address for a given subnet address
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
 * RangeOfNetworks returns an array of networks given a range of addresses
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

/**
 * NetworkComesBefore returns a bool with regards to numerical network order.
 * Please mote that IPv4 comes before IPv6 and larger networks come before smaller ones.
 *
 * @example
 * netparser.networkComesBefore("192.168.0.0/24", "192.168.1.0/24")  // returns true
 *
 * @param network - A network like 192.168.0.0/24
 * @param otherNetwork - A network like 192.168.1.0/24
 * @param strict - Do not automatically mask addresses to baseAddresses
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns A boolean or null in case of error
 */
export function networkComesBefore(network: string, otherNetwork: string, strict?: boolean, throwErrors?: boolean) {
  let alpha = network.trim();
  let bravo = otherNetwork.trim();
  if (shared.hasColon(alpha)) {
    alpha = shared.removeBrackets(alpha);
  }
  if (shared.hasColon(bravo)) {
    bravo = shared.removeBrackets(bravo);
  }
  if (alpha === bravo) return false;
  const alphaIP = shared.removeCIDR(alpha, throwErrors);
  if (!alphaIP) return null;
  const bravoIP = shared.removeCIDR(bravo, throwErrors);
  if (!bravoIP) return null;
  const alphaCIDR = shared.getCIDR(alpha, throwErrors);
  if (!alphaCIDR) return null;
  const bravoCIDR = shared.getCIDR(bravo, throwErrors);
  if (!bravoCIDR) return null;
  const alphaBytes = shared.addrToBytes(alphaIP);
  if (!alphaBytes) return null;
  const bravoBytes = shared.addrToBytes(bravoIP);
  if (!bravoBytes) return null;
  if (!strict) {
    shared.applySubnetMask(alphaBytes, alphaCIDR);
    shared.applySubnetMask(bravoBytes, bravoCIDR);
  } else {
    const alphaBytesCopy = shared.duplicateAddress(alphaBytes);
    const bravoBytesCopy = shared.duplicateAddress(bravoBytes);
    shared.applySubnetMask(alphaBytes, alphaCIDR);
    shared.applySubnetMask(bravoBytes, bravoCIDR);
    if (
      shared.compareAddresses(alphaBytes, alphaBytesCopy) !== 0 ||
      shared.compareAddresses(bravoBytes, bravoBytesCopy) !== 0
    ) {
      if (throwErrors) throw errorNotValidBaseNetworkAddress;
      return null;
    }
  }
  switch (shared.compareAddresses(alphaBytes, bravoBytes)) {
    case shared.cmp.before:
      return true;
    case shared.cmp.after:
      return false;
  }
  if (alphaCIDR < bravoCIDR) return true;
  return false;
}

/**
 * NextNetwork returns the next network of the same size.
 *
 * @example
 * netparser.nextNetwork("192.168.0.0/24")  // returns 192.168.1.0/24
 *
 * @param network - A network like 192.168.0.0/24
 * @param strict - Do not automatically mask addresses to baseAddresses
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns A network string or null in case of error
 */
export function nextNetwork(network: string, strict?: boolean, throwErrors?: boolean) {
  network = network.trim();
  if (shared.hasColon(network)) {
    network = shared.removeBrackets(network);
  }
  const ip = shared.removeCIDR(network, throwErrors);
  const cidr = shared.getCIDR(network, throwErrors);
  if (ip !== null && cidr !== null) {
    const bytes = shared.addrToBytes(ip, throwErrors);
    if (bytes !== null) {
      if (!strict) {
        shared.applySubnetMask(bytes, cidr);
      } else {
        const bytesCopy = shared.duplicateAddress(bytes);
        shared.applySubnetMask(bytes, cidr);
        if (shared.compareAddresses(bytes, bytesCopy) !== 0) {
          if (throwErrors) throw errorNotValidBaseNetworkAddress;
          return null;
        }
      }
      if (!shared.increaseAddressWithCIDR(bytes, cidr, throwErrors)) return null;
      const addr = shared.bytesToAddr(bytes, throwErrors);
      if (addr) return `${addr}/${cidr}`;
    }
  }
  return null;
}

/**
 * BroadcastAddress returns the broadcast address for an IPv4 address.
 * Please note that IPv6 does not have broadcast addresses.
 *
 * @example
 * netparser.broadcastAddress("192.168.0.0/24")  // returns 192.168.1.255
 *
 * @param network - A network like 192.168.0.0/24
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns An IPv4 address or null in case of error
 */
export function broadcastAddress(network: string, throwErrors?: boolean) {
  if (shared.hasColon(network)) {
    if (throwErrors) throw errorIPv6DoesNotHaveBroadcast;
    return null;
  }
  network = network.trim();
  const ip = shared.removeCIDR(network, throwErrors);
  const cidr = shared.getCIDR(network, throwErrors);
  if (ip !== null && cidr !== null) {
    const bytes = shared.addrToBytes(ip, throwErrors);
    if (bytes !== null) {
      shared.applySubnetMask(bytes, cidr);
      if (!shared.increaseAddressWithCIDR(bytes, cidr, throwErrors)) return null;
      if (!shared.decreaseAddressWithCIDR(bytes, bytes.length * 8, throwErrors)) return null;
      const addr = shared.bytesToAddr(bytes, throwErrors);
      if (addr) return `${addr}/${cidr}`;
    }
  }
  return null;
}

module.exports = {
  ip,
  network,
  baseAddress,
  rangeOfNetworks,
  networkComesBefore,
  nextNetwork,
  broadcastAddress
};

// The following are pending an implementation:

// NetworkContainsSubnet() validates that the network is a valid supernet

// FindUnusedSubnets() returns a slice of unused subnets given the aggregate and sibling subnets

// IPv4ClassfulNetwork() eithers return the classful network given an IPv4 address or
// returns nil if given a multicast address or IPv6 address
