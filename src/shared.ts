import * as sort from "./sort";
import * as errors from "./errors";
import { Network } from "./network";

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
  sort.nativeSort(networks);
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

export function findNetworkGaps(aggregate: Network, sortedSubnets: Network[]) {
  let idx = 0;
  const results = [] as Network[];
  const canidate = aggregate.duplicate();
  const lastAddr = aggregate.lastAddr();
  while (canidate.addr.lessThanOrEqual(lastAddr)) {
    // decrease network size until baseAddress is valid and fits inside aggregate
    while (!canidate.addr.isBaseAddress(canidate.cidr()) || !aggregate.contains(canidate)) {
      canidate.setCIDR(canidate.cidr() + 1);
    }
    // does this network intersect with it's nearest neighbor?
    if (idx < sortedSubnets.length && canidate.intersects(sortedSubnets[idx])) {
      // either shrink network or find the next address after nearest neighbor
      if (canidate.cidr() < 8 * aggregate.addr.bytes().length) {
        canidate.setCIDR(canidate.cidr() + 1);
      } else {
        let sn = sortedSubnets[idx].duplicate();
        canidate.addr.setBytes(sn.next().addr.bytes());
        canidate.setCIDR(aggregate.cidr());
        idx++;
      }
    } else {
      // otherwise we've found a valid entry
      let net = canidate.duplicate();
      results.push(net);
      canidate.next().setCIDR(aggregate.cidr());
    }
  }
  return results;
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
