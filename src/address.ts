import * as ipv4 from "./ipv4";
import * as ipv6 from "./ipv6";
import * as parse from "./parse";
import * as errors from "./errors";
import * as ranges from "./ranges";

import { Network } from "./network";

const BEFORE = -1;
const EQUALS = 0;
const AFTER = 1;

export class Address {
  private arr: number[];

  public constructor(address?: string, throwErrors?: boolean) {
    if (address) {
      var net = parse.network(address, throwErrors);
      if (net) {
        this.arr = net.bytes;
        return;
      }
    }
    this.arr = [];
  }

  public bytes() {
    return this.arr ? this.arr : [];
  }

  public setBytes(bytes: number[]) {
    if (bytes.length === 4 || bytes.length === 16) {
      this.arr = bytes;
    } else {
      this.arr = [];
    }
    return this;
  }

  public destroy() {
    if (this.isValid()) {
      this.arr = [];
    }
    return this;
  }

  public isValid() {
    return this.arr.length > 0;
  }

  public is6to4() {
    return ranges.check(this, "6to4");
  }

  public isIPv4() {
    return this.arr.length === 4;
  }

  public isIPv6() {
    return this.arr.length === 16;
  }

  public isLinkLocal() {
    return ranges.check(this, "linkLocal");
  }

  public isLoopback() {
    return ranges.check(this, "loopback");
  }

  public isMulticast() {
    return ranges.check(this, "multicast");
  }

  public isTeredo() {
    return ranges.check(this, "teredo");
  }

  public toString() {
    if (!this.isValid()) return "";
    if (this.arr.length === 4) {
      return `${ipv4.bytesToAddr(this.arr)}`;
    }
    return `${ipv6.bytesToAddr(this.arr)}`;
  }

  public toNetwork() {
    return new Network().from(new Address().setBytes(this.arr), this.arr.length * 8);
  }

  public duplicate() {
    return new Address().setBytes(this.arr.slice());
  }

  public lessThan(address: Address) {
    return this.compare(address) === BEFORE;
  }

  public lessThanOrEqual(address: Address) {
    var result = this.compare(address);
    if (result === null) return false;
    return result <= EQUALS;
  }

  public equals(address: Address) {
    return this.compare(address) === EQUALS;
  }

  public greaterThanOrEqual(address: Address) {
    var result = this.compare(address);
    if (result === null) return false;
    return result >= EQUALS;
  }

  public greaterThan(address: Address) {
    return this.compare(address) === AFTER;
  }

  public compare(address: Address) {
    // check that both addresses are valid
    if (!this.isValid() || !address.isValid()) return null;

    // handle edge cases like mixing IPv4 and IPv6
    if (this === address) return EQUALS;
    if (this.arr.length < address.arr.length) return BEFORE;
    if (this.arr.length > address.arr.length) return AFTER;

    // compare addresses
    for (var i = 0; i < this.arr.length; i++) {
      if (this.arr[i] < address.arr[i]) return BEFORE;
      if (this.arr[i] > address.arr[i]) return AFTER;
    }

    // otherwise they must be equal
    return EQUALS;
  }

  public applySubnetMask(cidr: number) {
    if (!this.isValid()) return this;
    var maskBits = this.arr.length * 8 - cidr;
    for (var i = this.arr.length - 1; i >= 0; i--) {
      switch (Math.max(0, Math.min(maskBits, 8))) {
        case 0:
          return this;
        case 1:
          this.arr[i] &= ~1;
          break;
        case 2:
          this.arr[i] &= ~3;
          break;
        case 3:
          this.arr[i] &= ~7;
          break;
        case 4:
          this.arr[i] &= ~15;
          break;
        case 5:
          this.arr[i] &= ~31;
          break;
        case 6:
          this.arr[i] &= ~63;
          break;
        case 7:
          this.arr[i] &= ~127;
          break;
        case 8:
          this.arr[i] = 0;
          break;
      }
      maskBits -= 8;
    }
    return this;
  }

  public isBaseAddress(cidr: number) {
    if (!this.isValid() || cidr < 0 || cidr > this.arr.length * 8) return false;
    if (cidr === this.arr.length * 8) return true;
    var maskBits = this.arr.length * 8 - cidr;
    for (var i = this.arr.length - 1; i >= 0; i--) {
      switch (Math.max(0, Math.min(maskBits, 8))) {
        case 0:
          return true;
        case 1:
          if (this.arr[i] !== (this.arr[i] & ~1)) return false;
          break;
        case 2:
          if (this.arr[i] !== (this.arr[i] & ~3)) return false;
          break;
        case 3:
          if (this.arr[i] !== (this.arr[i] & ~7)) return false;
          break;
        case 4:
          if (this.arr[i] !== (this.arr[i] & ~15)) return false;
          break;
        case 5:
          if (this.arr[i] !== (this.arr[i] & ~31)) return false;
          break;
        case 6:
          if (this.arr[i] !== (this.arr[i] & ~63)) return false;
          break;
        case 7:
          if (this.arr[i] !== (this.arr[i] & ~127)) return false;
          break;
        case 8:
          if (this.arr[i] !== 0) return false;
          break;
      }
      maskBits -= 8;
    }
    return true;
  }

  public increase(cidr: number, throwErrors?: boolean) {
    if (this.isValid()) {
      this.offsetAddress(cidr, true, throwErrors);
    } else {
      if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
      this.destroy();
    }
    return this;
  }

  public decrease(cidr: number, throwErrors?: boolean) {
    if (this.isValid()) {
      this.offsetAddress(cidr, false, throwErrors);
    } else {
      if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
      this.destroy();
    }
    return this;
  }

  public next(throwErrors?: boolean) {
    if (this.isValid()) {
      this.offsetAddress(this.arr.length * 8, true, throwErrors);
    } else {
      if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
      this.destroy();
    }
    return this;
  }

  public previous(throwErrors?: boolean) {
    if (this.isValid()) {
      this.offsetAddress(this.arr.length * 8, false, throwErrors);
    } else {
      if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
      this.destroy();
    }
    return this;
  }

  private offsetAddress(cidr: number, forwards: boolean, throwErrors?: boolean) {
    var targetByte = Math.floor((cidr - 1) / 8);
    if (this.isValid() && targetByte >= 0 && targetByte < this.arr.length) {
      var increment = Math.pow(2, 8 - (cidr - targetByte * 8));
      this.arr[targetByte] += increment * (forwards ? 1 : -1);
      if (targetByte >= 0) {
        if (this.arr[targetByte] < 0) {
          this.arr[targetByte] = 256 + (this.arr[targetByte] % 256);
          this.offsetAddress(targetByte * 8, forwards, throwErrors);
        } else if (this.arr[targetByte] > 255) {
          this.arr[targetByte] %= 256;
          this.offsetAddress(targetByte * 8, forwards, throwErrors);
        }
      } else {
        if (throwErrors) throw errors.OverflowedAddressSpace;
        this.destroy();
      }
    } else {
      if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
      this.destroy();
    }
  }
}
