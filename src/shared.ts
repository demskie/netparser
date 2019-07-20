import * as sort from "./sort";
import * as errors from "./errors";
import { Network } from "./network";
import { Address } from "./address";

export function getCIDR(s: string, throwErrors?: boolean) {
  const splitAddr = s.split("/");
  if (splitAddr.length === 2) {
    const val = Number(splitAddr[1]);
    if (Number.isInteger(val)) {
      const maxCIDR = splitAddr[0].search(":") >= 0 ? 128 : 32;
      if (0 < val && val <= maxCIDR) return val;
    }
  }
  if (throwErrors) throw errors.GenericGetCIDR;
  return null;
}

export function sortNetworks(networks: Network[]) {
  if (networks.length < 10000) {
    return sort.insertionSort(networks);
  }
  return sort.radixSort(networks);
}

export function summarizeSortedNetworks(sorted: Network[]) {
  const summarized = [] as Network[];
  for (let idx = 0; idx < sorted.length; idx++) {
    summarized.push(sorted[idx]);
    let skipped = 0;
    for (let i = idx + 1; i < sorted.length; i++) {
      if (sorted[idx].contains(sorted[i])) {
        skipped++;
        continue;
      }
      if (sorted[idx].cidr() === sorted[i].cidr()) {
        if (sorted[idx].adjacent(sorted[i])) {
          sorted[idx].setCIDR(sorted[idx].cidr() - 1);
          skipped++;
          continue;
        }
      }
      break;
    }
    idx += skipped;
  }
  return summarized;
}

export function findNetworkIntersection(network: Network, otherNetworks: Network[]) {
  for (var otherNet of otherNetworks) {
    if (network.intersects(otherNet)) {
      return otherNet;
    }
  }
  return null;
}

export function findNetworkWithoutIntersection(otherNetworks: Network[], position: Address, startingCIDR?: number) {
  if (!startingCIDR) startingCIDR = 0;
  const maxCIDR = position.bytes().length * 8;
  const canidate = new Network().from(position, startingCIDR);
  while (canidate.cidr() <= maxCIDR) {
    if (canidate.addr.isBaseAddress(canidate.cidr())) {
      if (!findNetworkIntersection(canidate, otherNetworks)) {
        return canidate;
      }
      if (canidate.cidr() >= maxCIDR) {
        if (!canidate.addr.next().isValid()) return null;
        canidate.setCIDR(startingCIDR);
      }
    }
    canidate.setCIDR(canidate.cidr() + 1);
  }
  return null;
}

export function parseBaseNetwork(s: string, strict?: boolean, throwErrors?: boolean) {
  const net = new Network(s, throwErrors);
  if (!net.isValid()) return null;
  if (!strict) {
    net.addr.applySubnetMask(net.cidr());
  } else {
    const original = net.addr.duplicate();
    net.addr.applySubnetMask(net.cidr());
    if (!net.addr.equals(original)) {
      if (throwErrors) throw errors.NotValidBaseNetworkAddress;
      return null;
    }
  }
  return net;
}
