import * as shared from "./shared";
import * as errors from "./errors";

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
 * NetworkComesBefore returns a bool with regards to numerical network order.
 * Please note that IPv4 comes before IPv6 and larger networks come before smaller ones.
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
  let startAddr = shared.parseAddressString(startAddress, throwErrors);
  if (!startAddr) return null;
  let stopAddr = shared.parseAddressString(stopAddress, throwErrors);
  if (!stopAddr) return null;
  if (startAddr.length !== stopAddr.length) {
    if (throwErrors) throw errors.MixingIPv4AndIPv6;
    return null;
  }
  switch (shared.compareAddresses(startAddr, stopAddr)) {
    case shared.Pos.equals:
      return [`${startAddress}/${startAddr.length}`];
    case shared.Pos.after:
      [startAddr, stopAddr] = [stopAddr, startAddr];
  }
  var results = [] as string[];
  const currentBytes = shared.duplicateAddress(startAddr);
  while (shared.compareAddresses(currentBytes, stopAddr) <= 0) {
    const addrString = shared.bytesToAddr(currentBytes, throwErrors);
    var cidr = 1;
    var bytesCopy = shared.duplicateAddress(currentBytes);
    while (cidr < bytesCopy.length * 8) {
      shared.increaseAddressWithCIDR(bytesCopy, cidr, throwErrors);
      shared.decreaseAddressWithCIDR(bytesCopy, bytesCopy.length * 8, throwErrors);
      if (shared.compareAddresses(bytesCopy, stopAddr) !== shared.Pos.after) {
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

module.exports = {
  baseAddress,
  broadcastAddress,
  findUnusedSubnets,
  ip,
  network,
  networkComesBefore,
  networkContainsSubnet,
  nextNetwork,
  rangeOfNetworks
};

// The following functions are pending an implementation:

// IPv4ClassfulNetwork() eithers return the classful network given an IPv4 address or
// returns nil if given a multicast address or IPv6 address
