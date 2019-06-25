import * as ipv4 from "./ipv4";
import * as ipv6 from "./ipv6";
import * as parse from "./parse";
import * as errors from "./errors";

const BEFORE = -1;
const EQUALS = 0;
const AFTER = 1;

export class Address {
  private bytes?: number[];

  public constructor(address?: string, throwErrors?: boolean) {
    if (address) {
      var net = parse.network(address, throwErrors);
      if (net) {
        this.bytes = net.bytes;
      }
    }
  }

  public destroy() {
    this.bytes = undefined;
  }

  public isValid() {
    return this.bytes !== undefined;
  }

  public getByte(index: number) {
    if (this.bytes && index < this.bytes.length) {
      return this.bytes[index];
    }
    return Number.NaN;
  }

  public setByte(index: number, value: number) {
    if (this.bytes && index < this.bytes.length) {
      this.bytes[index] = Math.min(Math.max(0, Math.floor(value)), 255);
    }
    return this;
  }

  public setBytes(bytes: number[]) {
    if (bytes.length === 4 || bytes.length === 16) {
      this.bytes = new Array(bytes.length);
      for (var i = 0; i < bytes.length; i++) {
        this.bytes[i] = Math.min(Math.max(0, Math.floor(bytes[i])), 255);
      }
    }
    return this;
  }

  public fromBytes(bytes: number[]) {
    if (bytes.length === 4 || bytes.length === 16) {
      this.bytes = bytes;
    }
    return this;
  }

  public toString() {
    if (!this.bytes) return "";
    if (this.bytes.length === 4) {
      return `${ipv4.bytesToAddr(this.bytes)}`;
    }
    return `${ipv6.bytesToAddr(this.bytes)}`;
  }

  public duplicate() {
    if (this.bytes) {
      return new Address().fromBytes(this.bytes.slice());
    }
    return null;
  }

  public size() {
    if (this.bytes) {
      return this.bytes.length;
    }
    return 0;
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
    if (!this.bytes || !address.bytes) return null;

    // handle edge cases like mixing IPv4 and IPv6
    if (this === address) return EQUALS;
    if (this.bytes.length < address.bytes.length) return BEFORE;
    if (this.bytes.length > address.bytes.length) return AFTER;

    // compare addresses
    for (var i = 0; i < this.bytes.length; i++) {
      if (this.bytes[i] < address.bytes[i]) return BEFORE;
      if (this.bytes[i] > address.bytes[i]) return AFTER;
    }

    // otherwise they must be equal
    return EQUALS;
  }

  public applySubnetMask(cidr: number) {
    if (!this.bytes) return this;
    var maskBits = this.bytes.length * 8 - cidr;
    for (var i = this.bytes.length - 1; i >= 0; i--) {
      switch (Math.max(0, Math.min(8, maskBits))) {
        case 0:
          return this;
        case 1:
          this.bytes[i] &= ~1;
          break;
        case 2:
          this.bytes[i] &= ~3;
          break;
        case 3:
          this.bytes[i] &= ~7;
          break;
        case 4:
          this.bytes[i] &= ~15;
          break;
        case 5:
          this.bytes[i] &= ~31;
          break;
        case 6:
          this.bytes[i] &= ~63;
          break;
        case 7:
          this.bytes[i] &= ~127;
          break;
        case 8:
          this.bytes[i] = 0;
          break;
      }
      maskBits -= 8;
    }
    return this;
  }

  public isBaseAddress(cidr: number) {
    if (!this.bytes || cidr < 0 || cidr > this.bytes.length * 8) return false;
    if (cidr === this.bytes.length * 8) return true;
    var maskBits = this.bytes.length * 8 - cidr;
    for (var i = this.bytes.length - 1; i >= 0; i--) {
      switch (Math.max(0, Math.min(8, maskBits))) {
        case 0:
          return true;
        case 1:
          if (this.bytes[i] !== (this.bytes[i] & ~1)) return false;
          break;
        case 2:
          if (this.bytes[i] !== (this.bytes[i] & ~3)) return false;
          break;
        case 3:
          if (this.bytes[i] !== (this.bytes[i] & ~7)) return false;
          break;
        case 4:
          if (this.bytes[i] !== (this.bytes[i] & ~15)) return false;
          break;
        case 5:
          if (this.bytes[i] !== (this.bytes[i] & ~31)) return false;
          break;
        case 6:
          if (this.bytes[i] !== (this.bytes[i] & ~63)) return false;
          break;
        case 7:
          if (this.bytes[i] !== (this.bytes[i] & ~127)) return false;
          break;
        case 8:
          if (this.bytes[i] !== 0) return false;
          break;
      }
    }
    return true;
  }

  public increase(cidr: number, throwErrors?: boolean) {
    if (this.bytes) {
      this.offsetAddress(cidr, true, throwErrors);
    } else {
      if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
      this.destroy();
    }
    return this;
  }

  public decrease(cidr: number, throwErrors?: boolean) {
    if (this.bytes) {
      this.offsetAddress(cidr, false, throwErrors);
    } else {
      if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
      this.destroy();
    }
    return this;
  }

  private offsetAddress(cidr: number, forwards: boolean, throwErrors?: boolean) {
    var targetByte = Math.floor((cidr - 1) / 8);
    if (this.bytes && targetByte >= 0 && targetByte < this.bytes.length) {
      var increment = Math.pow(2, 8 - (cidr - targetByte * 8));
      this.bytes[targetByte] += increment * (forwards ? 1 : -1);
      if (this.bytes[targetByte] < 0 || this.bytes[targetByte] > 255) {
        if (targetByte > 0) {
          this.bytes[targetByte] %= 256;
          this.offsetAddress(targetByte * 8, forwards, throwErrors);
        } else {
          if (throwErrors) throw errors.OverflowedAddressSpace;
          this.destroy();
        }
      }
    } else {
      if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
      this.destroy();
    }
  }
}
