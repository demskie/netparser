/* eslint-disable prefer-const */
import * as shared from "./shared";
import * as sort from "./sort";
import { Network } from "./network";

/**
 * Create a collection of networks to query for matches
 *
 * @example
 * var matcher = new netparser.Matcher(["192.168.0.0/24", "192.168.4.0/23"]);
 * matcher.has("192.168.5.0"); // returns true
 *
 * @returns an object for adding and querying for network matches
 */
export class Matcher {
  private readonly sorted = [] as Network[];

  public constructor(networks?: string[]) {
    let subnets = [] as Network[];
    if (networks) {
      for (let s of networks) {
        let net = shared.parseBaseNetwork(s, false, false);
        if (net && net.isValid()) subnets.push(net);
      }
      shared.sortNetworks(subnets);
      this.sorted = shared.summarizeSortedNetworks(subnets);
    }
  }

  /**
   * Query for the given network
   *
   * @example
   * var matcher = new netparser.Matcher();
   * matcher.add("10.0.0.0/24");
   * matcher.has("192.168.5.0"); // returns false
   *
   * @param network - An address or subnet
   *
   * @returns A boolean
   */
  public has(network: string) {
    let net = shared.parseBaseNetwork(network, false, false);
    if (!net || !net.isValid()) return false;
    let idx = sort.binarySearchForInsertionIndex(net, this.sorted);
    if (idx < 0) return false;
    if (idx < this.sorted.length && this.sorted[idx].contains(net)) return true;
    if (idx - 1 >= 0 && this.sorted[idx - 1].contains(net)) return true;
    return false;
  }

  /**
   * Insert the given network into the Matcher
   *
   * @example
   * var matcher = new netparser.Matcher();
   * matcher.add("10.0.0.0/24");
   * matcher.add("255.255.255.255");
   *
   * @param network - An address or subnet
   *
   * @returns the Matcher object for chaining purposes
   */
  public add(network: string) {
    let net = shared.parseBaseNetwork(network, false, false);
    if (!net || !net.isValid()) return this;
    let idx = sort.binarySearchForInsertionIndex(net, this.sorted);
    if (idx < this.sorted.length && this.sorted[idx].compare(net) === 0) return this;
    this.sorted.splice(idx, 0, net);
    return this;
  }
}
