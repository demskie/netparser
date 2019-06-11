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
  if (!increaseAddressWithCIDR(subnetBytesEnd, subnet.cidr, throwErrors)) return false;
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

function radixSortNetworks(networks: Network[], start: number, stop: number, byteIndex: number) {
  const runningPrefixSum = new Array(256) as number[];
  const offsetPrefixSum = new Array(256) as number[];
  const counts = runningPrefixSum;
  for (let i = 0; i < counts.length; i++) {
    counts[i] = 0;
  }

  // count each occurance of byte value
  for (let i = start; i < stop; i++) {
    if (byteIndex === -1) {
      counts[networks[i].bytes.length]++;
    } else if (byteIndex < 16) {
      if (byteIndex < networks[i].bytes.length) {
        networks[i].bytes[byteIndex] = Math.min(Math.max(0, networks[i].bytes[byteIndex]), 255);
      }
      counts[networks[i].bytes[byteIndex]]++;
    } else {
      networks[i].cidr = Math.min(Math.max(0, networks[i].cidr), 8 * networks[i].bytes.length);
      counts[networks[i].cidr]++;
    }
  }
  let lastCount = counts[counts.length - 1];

  // initialize runningPrefixSum
  let total = 0;
  let oldCount = 0;
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
      offsetPrefixSum[i] = runningPrefixSum[i] + lastCount;
    }
  }

  // in place swap and sort by value
  let redIndex = start;
  let redValue = 0;
  while (redIndex < stop) {
    if (byteIndex === -1) {
      redValue = networks[redIndex].bytes.length;
    } else if (byteIndex < 16) {
      if (byteIndex < networks[redIndex].bytes.length) {
        redValue = networks[redIndex].bytes[byteIndex];
      } else {
        redValue = 0;
      }
    } else {
      redValue = networks[redIndex].cidr;
    }
    let blueIndex = start + runningPrefixSum[redValue];
    if (runningPrefixSum[redValue] < offsetPrefixSum[redValue]) {
      runningPrefixSum[redValue]++;
      if (redIndex === blueIndex) {
        redIndex++;
      } else {
        let oldRedNetwork = networks[redIndex];
        networks[redIndex] = networks[blueIndex];
        networks[blueIndex] = oldRedNetwork;
      }
    } else {
      redIndex++;
    }
  }

  // recurse and sort lower bits
  if (byteIndex < 16) {
    let lastPrefixSum = 0;
    for (var i = 0; i < runningPrefixSum.length; i++) {
      if (runningPrefixSum[i] !== lastPrefixSum) {
        radixSortNetworks(networks, start + lastPrefixSum, start + runningPrefixSum[i], byteIndex + 1);
      }
      lastPrefixSum = runningPrefixSum[i];
    }
  }
}

export function sortNetworks(networks: Network[]) {
  radixSortNetworks(networks, 0, networks.length, -1);
}
