import * as shared from "./shared";
import * as sort from "./sort";

import { Network } from "./network";

export class Matcher {
  private readonly sorted = [] as Network[];

  public constructor(networks?: string[]) {
    var subnets = [] as Network[];
    if (networks) {
      for (var s of networks) {
        var net = shared.parseBaseNetwork(s, false, false);
        if (net && net.isValid()) subnets.push(net);
      }
    }
    shared.sortNetworks(subnets);
    this.sorted = shared.summarizeSortedNetworks(subnets);
  }

  public has(network: string) {
    var net = shared.parseBaseNetwork(network, false, false);
    if (!net || !net.isValid()) return false;
    var idx = sort.binarySearchForInsertionIndex(net, this.sorted);
    if (idx < 0) return false;
    if (idx < this.sorted.length && this.sorted[idx].contains(net)) return true;
    if (idx - 1 >= 0 && this.sorted[idx - 1].contains(net)) return true;
    return false;
  }
}
