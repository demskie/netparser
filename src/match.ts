import * as shared from "./shared";

export class Matcher {
  private readonly sorted = [] as shared.Network[];
  // private readonly addrToCIDR = new Map<string, number>();

  public constructor(networks?: string[]) {
    if (networks) {
      for (let netString of networks) {
        let network = shared.parseNetworkString(netString, false, false);
        if (!network) continue;
        this.sorted.push(network);
      }
    }
    shared.sortNetworks(this.sorted);
  }

  public has(network: string) {
    let net = shared.parseNetworkString(network, false, false);
    if (!net) return false;
    let s = shared.bytesToAddr(net.bytes, false);
    if (!s) return false;
    const netString = `${s}/${net.cidr}`;
    // TODO
  }
}
