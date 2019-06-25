import * as parse from "./parse";
import * as errors from "./errors";
import { Address } from "./address";

const BEFORE = -1;
const EQUALS = 0;
const AFTER = 1;

export class Network {
  private address = new Address();
  private cidr = -1;

  public constructor(network?: string, throwErrors?: boolean) {
    if (network) {
      var net = parse.network(network, throwErrors);
      if (net) {
        this.address.fromBytes(net.bytes);
        this.cidr = net.cidr;
      }
    }
  }

  public destroy() {
    this.address.destroy();
    this.cidr = -1;
  }

  public addr() {
    return this.address;
  }

  public setCIDR(cidr: number, throwErrors?: boolean) {
    if (!this.isValidNetwork() || !this.address.isValid()) {
      if (throwErrors) throw errors.InvalidSubnet;
      this.destroy();
    } else {
      cidr = Math.floor(cidr);
      if (cidr >= 0 && cidr <= this.address.size() * 8) {
        this.cidr = cidr;
      } else {
        if (throwErrors) throw errors.NotValidCIDR;
        this.destroy();
      }
    }
    return this;
  }

  public fromBytes(bytes: number[], cidr: number) {
    if (cidr >= 0 && cidr <= bytes.length * 8) {
      if (this.address.fromBytes(bytes).isValid()) {
        this.cidr = cidr;
      } else {
        this.destroy();
      }
    }
    return this;
  }

  public isValidNetwork() {
    return this.address.isValid() && this.cidr !== -1;
  }

  public toNetString() {
    if (this.isValidNetwork()) {
      return `${this.address.toString()}/${this.cidr}`;
    }
    return "";
  }

  public getCIDR() {
    if (this.isValidNetwork()) {
      return this.cidr;
    }
    return Number.NaN;
  }

  public duplicate() {
    var network = new Network();
    if (this.isValidNetwork()) {
      network.address = this.address.duplicate() as Address;
      network.cidr = this.cidr;
    }
    return network;
  }

  public size() {
    return this.address.size();
  }

  public next() {
    this.address.increase(this.cidr);
    return this;
  }

  public previous() {
    this.address.decrease(this.cidr);
    return this;
  }

  public compare(network: Network) {
    // check that both networks are valid
    if (!this.isValidNetwork() || !network.isValidNetwork()) return null;

    // compare addresses
    var cmp = this.address.compare(network.address);
    if (cmp !== EQUALS) return cmp;

    // compare subnet mask length
    if (this.cidr < network.cidr) return BEFORE;
    if (this.cidr > network.cidr) return AFTER;

    // otherwise they must be equal
    return EQUALS;
  }

  public contains(network: Network) {
    // check that both networks are valid
    if (!this.isValidNetwork() || !network.isValidNetwork()) return false;

    // ensure that both IPs are of the same type
    if (this.size() !== network.size()) return false;

    // handle edge cases
    if (this.cidr === 0) return true;
    if (network.cidr === 0) return false;

    // our base address should be less than or equal to the other base address
    if (this.address.compare(network.address) === AFTER) return false;

    // get the next network address for both
    var next = this.duplicate().next();
    var otherNext = network.duplicate().next();

    // handle edge case where our next network address overflows
    if (!next.isValidNetwork()) return true;

    // our address should be more than or equal to the other address
    if (next.address.compare(otherNext.address) === BEFORE) return false;

    // must be a child subnet
    return true;
  }

  public intersects(network: Network) {
    // check that both networks are valid
    if (!this.isValidNetwork() || !network.isValidNetwork()) return false;

    // ensure that both IPs are of the same type
    if (this.size() !== network.size()) return false;

    // handle edge cases
    if (this.cidr === 0 || network.cidr == 0) return true;
    var cmp = this.address.compare(network.address);
    if (cmp === EQUALS) return true;

    // ensure that alpha addr contains the baseAddress that comes first
    var alpha: Network, bravo: Network;
    if (cmp === BEFORE) {
      alpha = this.duplicate().next();
      bravo = network.duplicate().next();
    } else {
      alpha = network.duplicate().next();
      bravo = this.duplicate().next();
    }

    // if either addresses overflowed than an intersection has occured
    if (!alpha.isValidNetwork() || !bravo.isValidNetwork()) return true;

    // if alpha addr is now greater than or equal to bravo addr than we've intersected
    if (alpha.address.greaterThanOrEqual(bravo.address)) return true;

    // otherwise we haven't intersected
    return false;
  }

  public adjacent(network: Network) {
    // check that both networks are valid
    if (!this.isValidNetwork() || !network.isValidNetwork()) return false;

    // ensure that both IPs are of the same type
    if (this.size() !== network.size()) return false;

    // handle edge cases
    if (this.cidr === 0 || network.cidr == 0) return true;
    var cmp = this.address.compare(network.address);
    if (cmp === EQUALS) return false;

    // ensure that alpha addr contains the baseAddress that comes first
    var alpha: Network, bravo: Network;
    if (cmp === BEFORE) {
      alpha = this.duplicate().next();
      bravo = network;
    } else {
      alpha = network.duplicate().next();
      bravo = this;
    }

    // if alpha overflows then an adjacency is not possible
    if (!alpha.isValidNetwork()) return false;

    // alpha addr should equal bravo for them to be perfectly adjacent
    if (alpha.address.compare(bravo.address) === EQUALS) return true;

    // otherwise we aren't adjacent
    return false;
  }
}
