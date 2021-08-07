import * as shared from "./shared";
import * as errors from "./errors";
import { Network } from "./network";
import { Address } from "./address";
import { Matcher } from "./match";

const BEFORE = -1;
const EQUALS = 0;
const AFTER = 1;

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
  const net = new Network(networkAddress, throwErrors);
  if (!net.isValid()) return null;
  net.addr.applySubnetMask(net.cidr());
  return net.addr.toString();
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
  const net = new Network(network, throwErrors);
  if (!net.isValid() || net.addr.bytes().length === 16) return null;
  net.addr.applySubnetMask(net.cidr());
  return net.lastAddr().toString();
}

/**
 * FindUnusedSubnets returns array of unused subnets given the aggregate and sibling subnets
 *
 * @example
 * netparser.findUnusedSubnets("192.168.0.0/24", ["192.168.0.0/25", "192.168.0.128/26"])  // returns ["192.168.0.192/26"]
 *
 * @param aggregate - An aggregate network like 192.168.0.0/24
 * @param subnets - Array of subnetworks like ["192.168.0.0/24", "192.168.0.128/26"]
 * @param strict - Do not automatically mask addresses to baseAddresses
 * @param throwErrors - Stop the library from failing silently
 *
 * @returns A boolean or null in case of error
 */
export function findUnusedSubnets(aggregate: string, subnets: string[], strict?: boolean, throwErrors?: boolean) {
  const agg = shared.parseBaseNetwork(aggregate, strict, throwErrors);
  if (!agg || !agg.isValid()) return null;
  let subnetworks = [] as Network[];
  for (let s of subnets) {
    const net = shared.parseBaseNetwork(s, strict, throwErrors);
    if (!net || !net.isValid()) {
      if (strict) return null;
      continue;
    }
    if (agg.addr.bytes().length === net.addr.bytes().length) {
      subnetworks.push(net);
    }
  }
  shared.sortNetworks(subnetworks);
  const unused = shared.findNetworkGaps(agg, subnetworks);
  return Array.from(unused, (net: Network) => net.toString());
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
  const addr = new Address(address, throwErrors).toString();
  return addr.length > 0 ? addr : null;
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
  const net = new Network(networkAddress, throwErrors).toString();
  return net.length > 0 ? net : null;
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
  const alphaNet = shared.parseBaseNetwork(network, strict, throwErrors);
  if (!alphaNet || !alphaNet.isValid()) return null;
  const bravoNet = shared.parseBaseNetwork(otherNetwork, strict, throwErrors);
  if (!bravoNet || !bravoNet.isValid()) return null;
  switch (alphaNet.compare(bravoNet)) {
    case BEFORE:
      return true;
    case AFTER:
      return false;
  }
  if (alphaNet.cidr() < bravoNet.cidr()) return true;
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
  const net = shared.parseBaseNetwork(network, strict, throwErrors);
  if (!net || !net.isValid()) return null;
  const addrNet = new Network(address, throwErrors);
  if (!addrNet.isValid()) return null;
  if (addrNet.cidr() !== addrNet.addr.bytes().length * 8) {
    if (throwErrors) throw errors.InvalidAddress;
    return null;
  }
  return net.contains(addrNet);
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
  const alphaNet = shared.parseBaseNetwork(network, strict, throwErrors);
  if (!alphaNet) return null;
  const bravoNet = shared.parseBaseNetwork(subnet, strict, throwErrors);
  if (!bravoNet) return null;
  return alphaNet.contains(bravoNet);
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
  const alphaNet = shared.parseBaseNetwork(network, strict, throwErrors);
  if (!alphaNet) return null;
  const bravoNet = shared.parseBaseNetwork(otherNetwork, strict, throwErrors);
  if (!bravoNet) return null;
  return alphaNet.intersects(bravoNet);
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
  const addr = new Address(address, throwErrors);
  if (!addr.isValid()) return null;
  if (!addr.next().isValid()) {
    if (throwErrors) throw errors.OverflowedAddressSpace;
    return null;
  }
  return addr.toString();
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
  const net = shared.parseBaseNetwork(network, strict, throwErrors);
  if (!net || !net.isValid()) return null;
  if (!net.next().isValid()) {
    if (throwErrors) throw errors.OverflowedAddressSpace;
    return null;
  }
  return net.toString();
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
  let startAddr = new Address(startAddress, throwErrors);
  if (!startAddr) return null;
  let stopAddr = new Address(stopAddress, throwErrors);
  if (!stopAddr) return null;
  if (startAddr.bytes().length !== stopAddr.bytes().length) {
    if (throwErrors) throw errors.MixingIPv4AndIPv6;
    return null;
  }
  switch (startAddr.compare(stopAddr)) {
    case EQUALS:
      return [`${startAddress}/${startAddr.bytes().length * 8}`];
    case AFTER:
      [startAddr, stopAddr] = [stopAddr, startAddr];
  }
  let results = [] as string[];
  const net = new Network().from(startAddr, 0);
  while (net.addr.lessThanOrEqual(stopAddr)) {
    while (!net.addr.isBaseAddress(net.cidr()) || net.lastAddr().greaterThan(stopAddr)) {
      net.setCIDR(net.cidr() + 1);
    }
    results.push(net.toString());
    net.next().setCIDR(0);
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
  let subnets = new Array(networkAddresses.length) as Network[];
  let foundCIDR = false;
  for (let i = 0; i < networkAddresses.length; i++) {
    const addr = new Address(networkAddresses[i], throwErrors);
    if (!addr) return null;
    let cidr = shared.getCIDR(networkAddresses[i]);
    if (!cidr) {
      if (addr.bytes().length == 4) {
        cidr = 32;
      } else {
        cidr = 128;
      }
    } else {
      foundCIDR = true;
    }
    subnets[i] = new Network().from(addr, cidr);
  }
  shared.sortNetworks(subnets);
  const results = new Array(subnets.length) as string[];
  for (let i = 0; i < subnets.length; i++) {
    if (foundCIDR) {
      results[i] = subnets[i].toString();
    } else {
      results[i] = subnets[i].addr.toString();
    }
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
  let subnets = [] as Network[];
  for (let i = 0; i < networks.length; i++) {
    const net = shared.parseBaseNetwork(networks[i], strict, false);
    if (net) {
      if (net.isValid()) {
        subnets.push(net);
      }
    } else if (strict) {
      if (throwErrors) throw errors.NotValidBaseNetworkAddress;
      return null;
    }
  }
  shared.sortNetworks(subnets);
  subnets = shared.summarizeSortedNetworks(subnets);
  const results = new Array(subnets.length) as string[];
  for (let i = 0; i < subnets.length; i++) {
    results[i] = subnets[i].toString();
  }
  return results;
}

export { Matcher } from "./match";

module.exports = {
  Matcher,
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
