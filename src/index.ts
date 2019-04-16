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
      const addr = shared.bytesToAddr(bytes, throwErrors);
      if (addr) return `${addr}/${cidr}`;
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
        case shared.Pos.equals:
          return [start];
        case shared.Pos.after:
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
          if (shared.compareAddresses(bytesCopy, stopBytes) !== shared.Pos.after) {
            shared.applySubnetMask(bytesCopy, cidr);
            if (shared.compareAddresses(bytesCopy, currentBytes) === shared.Pos.equals) break;
          }
          shared.setAddress(bytesCopy, currentBytes);
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
  const garbage = new Uint8Array(16);
  const net = shared.parseNetworkString(network, strict, throwErrors, garbage);
  if (!net) return null;
  const otherNet = shared.parseNetworkString(network, strict, throwErrors, garbage);
  if (!otherNet) return null;
  switch (shared.compareAddresses(net.bytes, otherNet.bytes)) {
    case shared.Pos.before:
      return true;
    case shared.Pos.after:
      return false;
  }
  if (net.cidr < otherNet.cidr) return true;
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
  const net = shared.parseNetworkString(network, strict, throwErrors);
  if (!net) return null;
  if (!shared.increaseAddressWithCIDR(net.bytes, net.cidr, throwErrors)) return null;
  const addr = shared.bytesToAddr(net.bytes, throwErrors);
  if (!addr) return null;
  return `${addr}/${net.cidr}`;
}

/**
 * BroadcastAddress returns the broadcast address for an IPv4 address.
 * Please note that IPv6 does not have broadcast addresses.
 *
 * @example
 * netparser.broadcastAddress("192.168.0.0/24")  // returns 192.168.0.255
 *
 * @param network - A network like 192.168.0.0/24
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns An IPv4 address or null in case of error
 */
export function broadcastAddress(network: string, throwErrors?: boolean) {
  const net = shared.parseNetworkString(network, false, throwErrors);
  if (!net) return null;
  if (!shared.increaseAddressWithCIDR(net.bytes, net.cidr, throwErrors)) return null;
  if (!shared.decreaseAddressWithCIDR(net.bytes, net.bytes.length * 8, throwErrors)) return null;
  const addr = shared.bytesToAddr(net.bytes, throwErrors);
  if (!addr) return null;
  return `${addr}/${net.cidr}`;
}

/**
 * NetworkContainsSubnet validates that the network is a valid supernet
 *
 * @example
 * netparser.networkContainsSubnet("192.168.0.0/16", "192.168.0.0/24")  // returns true
 *
 * @param network - A network like 192.168.0.0/16
 * @param subnet - A network like 192.168.0.0/24
 * @param strict - Do not automatically mask addresses to baseAddresses
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns A boolean or null in case of error
 */
export function networkContainsSubnet(network: string, subnet: string, strict?: boolean, throwErrors?: boolean) {
  const alphaNet = shared.parseNetworkString(network, strict, throwErrors);
  if (!alphaNet) return null;
  const bravoNet = shared.parseNetworkString(subnet, strict, throwErrors);
  if (!bravoNet) return null;
  return shared.networkContainsSubnet(alphaNet, bravoNet);
}

/**
 * FindUnusedSubnets returns array of unused subnets given the aggregate and sibling subnets
 *
 * @example
 * netparser.findUnusedSubnets("192.168.0.0/24", ["192.168.0.0/25", "192.168.0.128/26"])  // returns ["192.168.0.224"]
 *
 * @param aggregate - Am aggregate network like 192.168.0.0/24
 * @param subnets - Array of subnetworks like ["192.168.0.0/24", "192.168.0.128/26"]
 * @param strict - Do not automatically mask addresses to baseAddresses
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns A boolean or null in case of error
 */
export function findUnusedSubnets(aggregate: string, subnets: string[], strict?: boolean, throwErrors?: boolean) {
  const aggnetwork = shared.parseNetworkString(aggregate, throwErrors, strict);
  if (!aggnetwork) return null;
  const subnetworks = [] as shared.Network[];
  for (var s of subnets) {
    const net = shared.parseNetworkString(s, throwErrors, strict);
    if (!net) return null;
    if (aggnetwork.bytes.length === net.bytes.length) {
      subnetworks.push(net);
    }
  }
  // TODO
  return null;
}

module.exports = {
  ip,
  network,
  baseAddress,
  rangeOfNetworks,
  networkComesBefore,
  nextNetwork,
  broadcastAddress,
  networkContainsSubnet
};

// The following are pending an implementation:

// IPv4ClassfulNetwork() eithers return the classful network given an IPv4 address or
// returns nil if given a multicast address or IPv6 address
