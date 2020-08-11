import * as parse from "./parse";
import * as errors from "./errors";
import { Address } from "./address";

const BEFORE = -1;
const EQUALS = 0;
const AFTER = 1;

export class Network {
  public readonly addr = new Address();
  public readonly network?: string;
  private netbits = -1;

  public constructor(network?: string, throwErrors?: boolean) {
    this.network = network;

    if (network) {
      var net = parse.network(network, throwErrors);
      if (net) {
        this.addr.setBytes(net.bytes);
        this.netbits = net.cidr;
      }
    }
  }

  public from(address: Address, cidr: number) {
    this.addr.setBytes(address.bytes().slice());
    return this.setCIDR(cidr);
  }

  public destroy() {
    if (!this.addr.isValid()) {
      this.addr.destroy();
    }
    this.netbits = -1;
    return this;
  }

  public cidr() {
    if (this.isValid()) {
      return this.netbits;
    }
    return Number.NaN;
  }

  public isValid() {
    return this.addr.isValid() && this.netbits !== -1;
  }

  public duplicate() {
    var network = new Network();
    if (this.isValid()) {
      network.addr.setBytes(this.addr.bytes().slice());
      network.netbits = this.netbits;
    }
    return network;
  }

  public toString() {
    if (this.isValid()) {
      return `${this.addr.toString()}/${this.netbits}`;
    }
    return "";
  }

  public next() {
    this.addr.increase(this.netbits);
    return this;
  }

  public previous() {
    this.addr.decrease(this.netbits);
    return this;
  }

  public lastAddr() {
    var addr = this.addr.duplicate().applySubnetMask(this.netbits);
    var maxCIDR = this.addr.bytes().length * 8;
    for (var i = this.netbits + 1; i <= maxCIDR; i++) addr.increase(i);
    return addr;
  }

  public setCIDR(cidr: number, throwErrors?: boolean) {
    if (!this.addr.isValid()) {
      if (throwErrors) throw errors.InvalidSubnet;
      this.destroy();
    } else {
      cidr = Math.floor(cidr);
      if (cidr >= 0 && cidr <= this.addr.bytes().length * 8) {
        this.netbits = cidr;
      } else {
        if (throwErrors) throw errors.NotValidCIDR;
        this.destroy();
      }
    }
    return this;
  }

  public compare(network: Network) {
    // check that both networks are valid
    if (!this.isValid() || !network.isValid()) return null;

    // compare addresses
    var cmp = this.addr.compare(network.addr);
    if (cmp !== EQUALS) return cmp;

    // compare subnet mask length
    if (this.netbits < network.netbits) return BEFORE;
    if (this.netbits > network.netbits) return AFTER;

    // otherwise they must be equal
    return EQUALS;
  }

  public contains(network: Network) {
    // check that both networks are valid
    if (!this.isValid() || !network.isValid()) return false;

    // ensure that both IPs are of the same type
    if (this.addr.bytes().length !== network.addr.bytes().length) return false;

    // handle edge cases
    if (this.netbits === 0) return true;
    if (network.netbits === 0) return false;

    // our base address should be less than or equal to the other base address
    if (this.addr.compare(network.addr) === AFTER) return false;

    // get the next network address for both
    var next = this.duplicate().next();
    var otherNext = network.duplicate().next();

    // handle edge case where our next network address overflows
    if (!next.isValid()) return true;

    // our address should be more than or equal to the other address
    if (next.addr.compare(otherNext.addr) === BEFORE) return false;

    // must be a child subnet
    return true;
  }

  public intersects(network: Network) {
    // check that both networks are valid
    if (!this.isValid() || !network.isValid()) return false;

    // ensure that both IPs are of the same type
    if (this.addr.bytes().length !== network.addr.bytes().length) return false;

    // handle edge cases
    if (this.netbits === 0 || network.netbits == 0) return true;
    var cmp = this.addr.compare(network.addr);
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
    if (!alpha.isValid() || !bravo.isValid()) return true;

    // if alpha addr is now greater than or equal to bravo addr than we've intersected
    if (alpha.addr.greaterThanOrEqual(bravo.addr)) return true;

    // otherwise we haven't intersected
    return false;
  }

  public adjacent(network: Network) {
    // check that both networks are valid
    if (!this.isValid() || !network.isValid()) return false;

    // ensure that both IPs are of the same type
    if (this.addr.bytes().length !== network.addr.bytes().length) return false;

    // handle edge cases
    if (this.netbits === 0 || network.netbits == 0) return true;
    var cmp = this.addr.compare(network.addr);
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
    if (!alpha.isValid()) return false;

    // alpha addr should equal bravo for them to be perfectly adjacent
    if (alpha.addr.compare(bravo.addr) === EQUALS) return true;

    // otherwise we aren't adjacent
    return false;
  }
}
