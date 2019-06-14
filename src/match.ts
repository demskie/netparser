import * as shared from "./shared";
import * as sort from "./sort";

export class Matcher {
  private readonly sorted = [] as shared.Network[];

  public constructor(networks?: string[]) {
    const subnets = [] as shared.Network[];
    if (networks) {
      for (let netString of networks) {
        let network = shared.parseNetworkString(netString, false, false);
        if (!network) continue;
        subnets.push(network);
      }
    }
    shared.sortNetworks(subnets);
    this.sorted = shared.summarizeSortedNetworks(subnets);
  }

  public has(network: string) {
    const net = shared.parseNetworkString(network, false, false);
    if (!net) return false;
    let s = shared.bytesToAddr(net.bytes, false);
    if (!s) return false;
    const idx = sort.binarySearchForInsertionIndex(net, this.sorted);
    if (idx < 0) return false;
    if (idx < this.sorted.length) {
      if (shared.networkContainsSubnet(this.sorted[idx], net)) return true;
    }
    if (idx - 1 >= 0) {
      if (shared.networkContainsSubnet(this.sorted[idx - 1], net)) return true;
    }
    return false;
  }
}
