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
  return `${addr}`;
}

/**
 * FindUnusedSubnets returns array of unused subnets given the aggregate and sibling subnets
 *
 * @example
 * netparser.findUnusedSubnets("192.168.0.0/24", ["192.168.0.0/25", "192.168.0.128/26"])  // returns ["192.168.0.224"]
 *
 * @param aggregate - An aggregate network like 192.168.0.0/24
 * @param subnets - Array of subnetworks like ["192.168.0.0/24", "192.168.0.128/26"]
 * @param strict - Do not automatically mask addresses to baseAddresses
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns A boolean or null in case of error
 */
export function findUnusedSubnets(aggregate: string, subnets: string[], strict?: boolean, throwErrors?: boolean) {
  if (subnets.length === 0) return aggregate;
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
  const aggnetworkEnd = shared.duplicateAddress(aggnetwork.bytes);
  shared.increaseAddressWithCIDR(aggnetworkEnd, aggnetwork.cidr);
  shared.decreaseAddressWithCIDR(aggnetworkEnd, aggnetwork.bytes.length * 8);
  const results = [] as string[];
  let currentSubnet: shared.Network | null = aggnetwork;
  while (currentSubnet) {
    currentSubnet = shared.findNetworkWithoutIntersection(currentSubnet, subnetworks);
    if (currentSubnet) {
      const addr = shared.bytesToAddr(currentSubnet.bytes, throwErrors);
      if (!addr) return null;
      results.push(`${addr}/${currentSubnet.cidr}`);
      if (
        !shared.increaseAddressWithCIDR(currentSubnet.bytes, currentSubnet.cidr) ||
        shared.compareAddresses(currentSubnet.bytes, aggnetworkEnd) > 0
      ) {
        break;
      }
      currentSubnet.cidr = aggnetwork.cidr;
    }
  }
  return results;
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
  const net = shared.parseNetworkString(network, strict, throwErrors);
  if (!net) return null;
  const otherNet = shared.parseNetworkString(otherNetwork, strict, throwErrors);
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
 * NetworkContainsAddress validates that the address is inside the network
 *
 * @example
 * netparser.networkContainsAddress("192.168.0.0/24", "192.168.0.100")  // returns true
 *
 * @param network - A network like 192.168.0.0/24
 * @param address - A network like 192.168.0.100
 * @param strict - Do not automatically mask addresses to baseAddresses
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns A boolean or null in case of error
 */
export function networkContainsAddress(network: string, address: string, strict?: boolean, throwErrors?: boolean) {
  const net = shared.parseNetworkString(network, strict, throwErrors);
  if (!net) return null;
  const addr = shared.parseAddressString(address, throwErrors);
  if (!addr) return null;
  return shared.networkContainsAddress(net, addr);
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
 * NetworksIntersect returns a bool showing if the networks overlap
 *
 * @example
 * netparser.networksIntersect("192.168.0.0/23", "192.168.1.0/24")  // returns true
 *
 * @param network - A network like 192.168.0.0/23
 * @param otherNetwork - A network like 192.168.1.0/24
 * @param strict - Do not automatically mask addresses to baseAddresses
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns A boolean or null in case of error
 */
export function networksIntersect(network: string, otherNetwork: string, strict?: boolean, throwErrors?: boolean) {
  const alphaNet = shared.parseNetworkString(network, strict, throwErrors);
  if (!alphaNet) return null;
  const bravoNet = shared.parseNetworkString(otherNetwork, strict, throwErrors);
  if (!bravoNet) return null;
  return shared.networksIntersect(alphaNet, bravoNet, throwErrors);
}

/**
 * NextAddress returns the next address
 *
 * @example
 * netparser.nextAddress("192.168.0.0")  // returns 192.168.0.1
 *
 * @param address - An address like 192.168.0.0
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns An address string or null in case of error
 */
export function nextAddress(address: string, throwErrors?: boolean) {
  const bytes = shared.parseAddressString(address, throwErrors);
  if (!bytes) return null;
  if (!shared.increaseAddressWithCIDR(bytes, bytes.length * 8, throwErrors)) return null;
  const addr = shared.bytesToAddr(bytes, throwErrors);
  if (!addr) return null;
  return `${addr}`;
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
 * @param startAddress - An address like 192.168.1.2
 * @param stopAddress - An address like 192.168.1.5
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
  const net = { bytes: startAddr, cidr: 1 };
  while (shared.compareAddresses(net.bytes, stopAddr) <= 0) {
    while (!shared.isValidNetworkAddress(net) || shared.networkGoesPastAddress(net, stopAddr)) {
      net.cidr++;
    }
    const addr = shared.bytesToAddr(net.bytes, throwErrors);
    results.push(`${addr}/${net.cidr}`);
    shared.increaseAddressWithCIDR(net.bytes, net.cidr, throwErrors);
    net.cidr = 1;
  }
  return results;
}

/**
 * Sort returns an array of sorted networks
 *
 * @example
 * netparser.sort(["255.255.255.255", "192.168.0.0/16", "192.168.2.3/31" ])  // returns ["192.168.0.0/16", "192.168.2.3/31", "255.255.255.255/32"]
 *
 * @param networkAddresses - An array of addresses or subnets
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns An array of networks or null in case of error
 */
export function sort(networkAddresses: string[], throwErrors?: boolean) {
  let subnets = new Array(networkAddresses.length) as shared.Network[];
  let foundCIDR = false;
  for (let i = 0; i < networkAddresses.length; i++) {
    const netString = networkAddresses[i];
    const addr = shared.parseAddressString(netString, throwErrors);
    if (!addr) return null;
    let cidr = shared.getCIDR(netString);
    if (!cidr) {
      if (addr.length == 4) {
        cidr = 32;
      } else {
        cidr = 128;
      }
    } else {
      foundCIDR = true;
    }
    subnets[i] = { bytes: addr, cidr: cidr };
  }
  shared.sortNetworks(subnets);
  const results = new Array(subnets.length) as string[];
  for (let i = 0; i < subnets.length; i++) {
    let s = shared.bytesToAddr(subnets[i].bytes, throwErrors);
    if (!s) return null;
    results[i] = foundCIDR ? `${s}/${subnets[i].cidr}` : `${s}`;
  }
  return results;
}

/**
 * Summarize returns an array of aggregates given a list of networks
 *
 * @example
 * netparser.summarize(["192.168.1.1", "192.168.0.0/16", "192.168.2.3/31"])  // returns ["192.168.0.0/16"]
 *
 * @param networks - An array of addresses or subnets
 * @param strict - Do not automatically mask addresses to baseAddresses
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns An array of networks or null in case of error
 */
export function summarize(networks: string[], strict?: boolean, throwErrors?: boolean) {
  let subnets = [] as shared.Network[];
  for (let i = 0; i < networks.length; i++) {
    const netString = networks[i];
    let net = shared.parseNetworkString(netString, strict, false);
    if (!net) {
      const addr = shared.parseAddressString(netString, throwErrors);
      if (!addr) return null;
      if (addr.length == 4) {
        net = { bytes: addr, cidr: 32 };
      } else {
        net = { bytes: addr, cidr: 128 };
      }
      if (subnets.length > 0 && subnets[0].bytes.length !== net.bytes.length) {
        if (throwErrors) throw errors.MixingIPv4AndIPv6;
        return null;
      }
    }
    subnets[i] = net;
  }
  shared.sortNetworks(subnets);
  const aggregates = [] as shared.Network[];
  for (let idx = 0; idx < subnets.length; idx++) {
    aggregates.push(subnets[idx]);
    let skipped = 0;
    for (let i = idx + 1; i < subnets.length; i++) {
      if (shared.networkContainsSubnet(subnets[idx], subnets[i])) {
        skipped++;
        continue;
      }
      if (subnets[idx].cidr === subnets[i].cidr) {
        if (shared.networksAreAdjacent(subnets[idx], subnets[i])) {
          subnets[idx].cidr--;
          skipped++;
          continue;
        }
      }
      break;
    }
    idx += skipped;
  }
  const results = new Array(aggregates.length) as string[];
  for (let i = 0; i < aggregates.length; i++) {
    let s = shared.bytesToAddr(aggregates[i].bytes, throwErrors);
    if (!s) return null;
    results[i] = `${s}/${aggregates[i].cidr}`;
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
  networkContainsAddress,
  networkContainsSubnet,
  networksIntersect,
  nextAddress,
  nextNetwork,
  rangeOfNetworks,
  sort,
  summarize
};

// The following functions are pending an implementation:

// IPv4ClassfulNetwork() eithers return the classful network given an IPv4 address or
// returns nil if given a multicast address or IPv6 address
