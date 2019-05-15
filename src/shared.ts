import * as v4 from "./IPv4";
import * as v6 from "./IPv6";
import * as errors from "./errors";

export type Address = Uint8Array;

export interface Network {
  bytes: Address;
  cidr: number;
}

export function hasColon(s: string) {
  return s.search(":") >= 0;
}

export function addrToBytes(addr: string, throwErrors?: boolean) {
  if (hasColon(addr)) {
    return v6.addrToBytes(addr, throwErrors);
  }
  return v4.addrToBytes(addr, throwErrors);
}

export function bytesToAddr(bytes: Uint8Array, throwErrors?: boolean) {
  if (bytes.length === 16) {
    return v6.bytesToAddr(bytes, throwErrors);
  }
  return v4.bytesToAddr(bytes, throwErrors);
}

export function repeatString(s: string, count: number) {
  var result = "";
  for (var i = 0; i < count; i++) {
    result += s;
  }
  return result;
}

export function removeCIDR(s: string, throwErrors?: boolean) {
  const splitAddr = s.split("/");
  switch (splitAddr.length) {
    case 0:
    case 1:
      return s;
    case 2:
      return splitAddr[0];
  }
  if (throwErrors) throw errors.GenericRemoveCIDR;
  return null;
}

export function getCIDR(s: string, throwErrors?: boolean) {
  const splitAddr = s.split("/");
  if (splitAddr.length === 2) {
    const val = parseInt(splitAddr[1], 10);
    if (Number.isInteger(val)) {
      if (hasColon(splitAddr[0]) && 0 < val && val <= 128) return val;
      if (0 < val && val <= 32) return val;
    }
  }
  if (throwErrors) throw errors.GenericGetCIDR;
  return null;
}

export function removeBrackets(s: string) {
  return s.replace(/[[\]]/g, "");
}

export function duplicateAddress(address: Address) {
  return address.slice();
}

export function duplicateNetwork(network: Network) {
  return { bytes: network.bytes.slice(), cidr: network.cidr } as Network;
}

export function subarrayAddress(address: Address, begin: number, end?: number) {
  return address.subarray(begin, end);
}

export function setAddress(dst: Uint8Array, src: Uint8Array) {
  for (var i = 0; i < src.length; i++) {
    if (i < dst.length) {
      dst[i] = src[i];
    } else {
      return;
    }
  }
}

export enum Pos {
  before = -1,
  equals = 0,
  after = 1
}

export function compareAddresses(a: Uint8Array, b: Uint8Array) {
  if (a !== b) {
    if (a.length < b.length) {
      return Pos.before;
    } else if (a.length > b.length) {
      return Pos.after;
    }
    for (var i = 0; i < a.length; i++) {
      if (a[i] < b[i]) return Pos.before;
      if (a[i] > b[i]) return Pos.after;
    }
  }
  return Pos.equals;
}

function offsetAddress(bytes: Uint8Array, cidr: number, isPositive: boolean, throwErrors?: boolean): Uint8Array | null {
  const targetByte = Math.floor((cidr - 1) / 8);
  if (targetByte < bytes.length) {
    const increment = Math.pow(2, 8 - (cidr - targetByte * 8));
    const unconstrained = bytes[targetByte] + increment * (isPositive ? 1 : -1);
    bytes[targetByte] = unconstrained % 256;
    if (0 <= unconstrained && unconstrained <= 255) {
      return bytes;
    }
    if (targetByte > 0) {
      const supernetCIDR = targetByte * 8;
      return offsetAddress(bytes, supernetCIDR, isPositive, throwErrors);
    }
    if (throwErrors) throw errors.OverflowedAddressSpace;
    return null;
  }
  if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
  return null;
}

export function increaseAddressWithCIDR(bytes: Uint8Array, cidr: number, throwErrors?: boolean) {
  if (cidr > 0 && (bytes.length === 4 || bytes.length === 16)) {
    return offsetAddress(bytes, cidr, true, throwErrors);
  }
  if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
  return null;
}

export function decreaseAddressWithCIDR(bytes: Uint8Array, cidr: number, throwErrors?: boolean) {
  if (cidr > 0 && (bytes.length === 4 || bytes.length === 16)) {
    return offsetAddress(bytes, cidr, false, throwErrors);
  }
  if (throwErrors) throw errors.GenericOffsetAddressWithCIDR;
  return null;
}

export function applySubnetMask(bytes: Uint8Array, cidr: number) {
  let maskBits = bytes.length * 8 - cidr;
  for (var i = bytes.length - 1; i >= 0; i--) {
    switch (Math.max(0, Math.min(8, maskBits))) {
      case 0:
        return bytes;
      case 1:
        bytes[i] &= ~1;
        break;
      case 2:
        bytes[i] &= ~3;
        break;
      case 3:
        bytes[i] &= ~7;
        break;
      case 4:
        bytes[i] &= ~15;
        break;
      case 5:
        bytes[i] &= ~31;
        break;
      case 6:
        bytes[i] &= ~63;
        break;
      case 7:
        bytes[i] &= ~127;
        break;
      case 8:
        bytes[i] = 0;
        break;
    }
    maskBits -= 8;
  }
  return bytes;
}

export function parseAddressString(s: string, throwErrors?: boolean) {
  s = s.trim();
  const isIPv6 = hasColon(s);
  if (isIPv6) {
    s = removeBrackets(s);
  }
  const ip = removeCIDR(s, throwErrors);
  if (ip !== null) {
    return addrToBytes(ip, throwErrors) as Address;
  }
  return null;
}

export function parseNetworkString(s: string, strict?: boolean, throwErrors?: boolean) {
  s = s.trim();
  const isIPv6 = hasColon(s);
  if (isIPv6) {
    s = removeBrackets(s);
  }
  const ip = removeCIDR(s, throwErrors);
  const cidr = getCIDR(s, throwErrors);
  if (ip !== null && cidr !== null) {
    const bytes = addrToBytes(ip, throwErrors);
    if (bytes !== null) {
      if (!strict) {
        applySubnetMask(bytes, cidr);
      } else {
        const bytesCopy = new Uint8Array(bytes.length);
        setAddress(bytesCopy, bytes);
        applySubnetMask(bytes, cidr);
        if (compareAddresses(bytes, bytesCopy) !== 0) {
          if (throwErrors) throw errors.NotValidBaseNetworkAddress;
          return null;
        }
      }
      return { bytes, cidr } as Network;
    }
  }
  return null;
}

export function networkGoesPastAddress(net: Network, addr: Address) {
  const netBytesEnd = duplicateAddress(net.bytes);
  increaseAddressWithCIDR(netBytesEnd, net.cidr);
  decreaseAddressWithCIDR(netBytesEnd, net.bytes.length * 8);
  if (compareAddresses(netBytesEnd, addr) > 0) return true;
  return false;
}

export function networkContainsSubnet(net: Network, subnet: Network, throwErrors?: boolean) {
  if (net.bytes.length !== subnet.bytes.length) return false;
  if (compareAddresses(net.bytes, subnet.bytes) > 0) return false;
  const netBytesEnd = duplicateAddress(net.bytes);
  if (!increaseAddressWithCIDR(netBytesEnd, net.cidr, throwErrors)) return false;
  const subnetBytesEnd = duplicateAddress(subnet.bytes);
  if (!increaseAddressWithCIDR(subnet.bytes, subnet.cidr, throwErrors)) return false;
  if (compareAddresses(netBytesEnd, subnetBytesEnd) < 0) return false;
  return true;
}

export function networkContainsAddress(net: Network, addr: Address, throwErrors?: boolean) {
  if (net.bytes.length !== addr.length) return false;
  if (compareAddresses(net.bytes, addr) > 0) return false;
  const netBytesEnd = duplicateAddress(net.bytes);
  if (!increaseAddressWithCIDR(netBytesEnd, net.cidr, throwErrors)) return false;
  if (compareAddresses(netBytesEnd, addr) > 0) return true;
  return false;
}

export function networksIntersect(net: Network, otherNet: Network, throwErrors?: boolean) {
  if (net.bytes.length !== otherNet.bytes.length) return false;
  let alphaStart = net.bytes;
  let alphaEnd = duplicateAddress(net.bytes);
  if (!increaseAddressWithCIDR(alphaEnd, net.cidr, throwErrors)) return false;
  decreaseAddressWithCIDR(alphaEnd, net.bytes.length * 8);
  let bravoStart = otherNet.bytes;
  let bravoEnd = duplicateAddress(otherNet.bytes);
  if (!increaseAddressWithCIDR(bravoEnd, otherNet.cidr, throwErrors)) return false;
  decreaseAddressWithCIDR(bravoEnd, otherNet.bytes.length * 8);
  if (compareAddresses(alphaStart, bravoStart) > 0) {
    [alphaStart, alphaEnd, bravoStart, bravoEnd] = [bravoStart, bravoEnd, alphaStart, alphaEnd];
  }
  if (compareAddresses(alphaEnd, bravoStart) < 0) return false;
  return true;
}

export function networksAreAdjacent(net: Network, otherNet: Network, throwErrors?: boolean) {
  if (net.bytes.length !== otherNet.bytes.length) return false;
  const netBytes = duplicateAddress(net.bytes);
  if (!increaseAddressWithCIDR(netBytes, net.cidr, throwErrors)) return false;
  if (compareAddresses(netBytes, otherNet.bytes) === 0) return true;
  return false;
}

export function findNetworkIntersection(network: Network, otherNetworks: Network[]) {
  for (var otherNet of otherNetworks) {
    if (networksIntersect(network, otherNet)) {
      return otherNet;
    }
  }
  return null;
}

export function isValidNetworkAddress(net: Network) {
  const netBaseBytes = duplicateAddress(net.bytes);
  applySubnetMask(netBaseBytes, net.cidr);
  return compareAddresses(net.bytes, netBaseBytes) === 0;
}

export function findNetworkWithoutIntersection(network: Network, otherNetworks: Network[]) {
  const currentNetwork = duplicateNetwork(network);
  while (currentNetwork.cidr <= network.bytes.length * 8) {
    if (isValidNetworkAddress(currentNetwork)) {
      if (!findNetworkIntersection(currentNetwork, otherNetworks)) {
        return currentNetwork;
      }
      if (currentNetwork.cidr >= network.bytes.length * 8) {
        if (!increaseAddressWithCIDR(currentNetwork.bytes, network.bytes.length * 8)) return null;
        currentNetwork.cidr = network.cidr;
      }
    }
    currentNetwork.cidr++;
  }
  return null;
}

enum IPVersion {
  v4,
  v6
}

function specificNetworks(networks: Network[], version: IPVersion) {
  const results = [] as Network[];
  if (version === IPVersion.v4) {
    for (let network of networks) {
      if (network.bytes.length === 4) {
        results.push(network);
      }
    }
  } else if (version === IPVersion.v6) {
    for (let network of networks) {
      if (network.bytes.length === 16) {
        results.push(network);
      }
    }
  }
  return results;
}

function radixSortNetworks(networks: Network[], version: IPVersion) {
  if (networks.length > 0 || version === IPVersion.v4 || version === IPVersion.v6) {
    const counts = new Array(256) as number[];
    const offsetPrefixSum = new Array(256) as number[];
    const byteLength = version === IPVersion.v4 ? 4 : 16;
    const maxCIDR = version === IPVersion.v4 ? 32 : 128;

    // in place swap and sort for every byte (including CIDR)
    for (let byteIndex = 0; byteIndex <= byteLength; byteIndex++) {
      for (let i = 0; i < counts.length; i++) {
        counts[i] = 0;
      }

      // count each occurance of byte value
      for (let net of networks) {
        if (byteIndex < byteLength) {
          net.bytes[byteIndex] = Math.min(Math.max(0, net.bytes[byteIndex]), 255);
          counts[net.bytes[byteIndex]]++;
        } else {
          net.cidr = Math.min(Math.max(0, net.cidr), maxCIDR);
          counts[net.cidr]++;
        }
      }

      // initialize runningPrefixSum
      let total = 0;
      let oldCount = 0;
      const runningPrefixSum = counts;
      for (let i = 0; i < 256; i++) {
        oldCount = counts[i];
        runningPrefixSum[i] = total;
        total += oldCount;
      }

      // initialize offsetPrefixSum (american flag sort)
      for (let i = 0; i < 256; i++) {
        if (i < 255) {
          offsetPrefixSum[i] = runningPrefixSum[i + 1];
        } else {
          offsetPrefixSum[i] = runningPrefixSum[i];
        }
      }

      // in place swap and sort by value
      let idx = 0;
      let value = 0;
      while (idx < networks.length) {
        if (byteIndex < byteLength) {
          value = networks[idx].bytes[byteIndex];
        } else {
          value = networks[idx].cidr;
        }
        if (runningPrefixSum[value] !== idx) {
          if (runningPrefixSum[value] < offsetPrefixSum[value]) {
            let x = networks[runningPrefixSum[value]];
            networks[runningPrefixSum[value]] = networks[idx];
            networks[idx] = x;
          } else {
            idx++;
          }
        } else {
          idx++;
        }
        runningPrefixSum[value]++;
      }
    }
  }
  return networks;
}

export function sortNetworks(networks: Network[]) {
  const v4 = specificNetworks(networks, IPVersion.v4);
  const v6 = specificNetworks(networks, IPVersion.v6);
  radixSortNetworks(v4, IPVersion.v4);
  radixSortNetworks(v6, IPVersion.v6);
  return [...v4, ...v6];
}
