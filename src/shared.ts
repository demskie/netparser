import * as v4 from "./ipv4";
import * as v6 from "./ipv6";
import * as sort from "./sort";
import * as errors from "./errors";
import { Network } from "./network";

export function repeatString(s: string, count: number) {
  var result = "";
  for (var i = 0; i < count; i++) {
    result += s;
  }
  return result;
}

export function sortNetworks(networks: Network[]) {
  if (networks && networks.length > 1) {
    sort.radixSortNetworks(networks, 0, networks.length, -1);
  }
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
      if (sorted[idx].getCIDR() === sorted[i].getCIDR()) {
        if (sorted[idx].adjacent(sorted[i])) {
          var cidr = sorted[idx].getCIDR() - 1;
          sorted[idx].setCIDR(cidr);
        }
      }
      break;
    }
    idx += skipped;
  }
  return summarized;
}
