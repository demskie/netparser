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

function increaseSizeByOneBit(network: Network): Network {
  const wider = network.setCIDR(network.cidr() - 1);
  wider.addr.applySubnetMask(wider.cidr());
  return wider;
}

export function summarizeSortedNetworks(sorted: Network[]): Network[] {
  const summarized: Network[] = [sorted[0]];
  for (let idx = 1; idx < sorted.length; idx++) {
    if (summarized[summarized.length - 1].contains(sorted[idx])) {
      continue;
    }
    summarized.push(sorted[idx]);
    while (summarized.length >= 2) {
      const a = summarized[summarized.length - 2];
      const b = summarized[summarized.length - 1];
      if (a.cidr() != b.cidr() || !a.addr.isBaseAddress(a.cidr() - 1) || !a.adjacent(b)) {
        break;
      }
      increaseSizeByOneBit(a);
      summarized.pop();
    }
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
