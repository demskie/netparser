import * as v4 from "./IPv4";
import * as v6 from "./IPv6";
import * as common from "./common";

export function parseIP(s: string, throwErrors?: boolean) {
  // glance at the string to see if it's an IPv6 address
  if (s.search(":") >= 0) {
    s = common.removeBrackets(s);
    const ip = common.removeCIDR(s, throwErrors);
    if (ip !== null) {
      const bytes = v6.addrToBytes(ip, throwErrors);
      if (bytes !== null) {
        return v6.bytesToAddr(bytes, throwErrors);
      }
    }
    return null;
  }
  // otherwise assume it's an IPv4 address
  const ip = common.removeCIDR(s, throwErrors);
  if (ip !== null) {
    const bytes = v4.addrToBytes(s, throwErrors);
    if (bytes !== null) {
      return v4.bytesToAddr(bytes, throwErrors);
    }
  }
  return null;
}

export function subnetZero(s: string, throwErrors?: boolean) {
  // glance at the string to see if it's an IPv6 address
  if (s.search(":") >= 0) {
    s = common.removeBrackets(s);
    const ip = common.removeCIDR(s, throwErrors);
    const cidr = common.getCIDR(s, throwErrors);
    if (ip !== null && cidr !== null) {
      const bytes = v6.addrToBytes(ip, throwErrors);
      if (bytes === null) {
        return bytes;
      }
      common.applySubnetMask(bytes, cidr);
      return v6.bytesToAddr(bytes, throwErrors);
    }
    return null;
  }
  // otherwise assume it's an IPv4 address
  const ip = common.removeCIDR(s, throwErrors);
  const cidr = common.getCIDR(s, throwErrors);
  if (ip !== null && cidr !== null) {
    const bytes = v4.addrToBytes(s, throwErrors);
    if (bytes === null) {
      return bytes;
    }
    common.applySubnetMask(bytes, cidr);
    return v4.bytesToAddr(bytes, throwErrors);
  }
  return null;
}
