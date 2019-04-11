import * as v4 from "./IPv4";
import * as v6 from "./IPv6";
import * as common from "./common";

export function parseIP(s: string, throwErrors?: boolean) {
  // glance at the string to see if it's an IPv6 address
  if (s.search(":") >= 0) {
    s = common.removeBrackets(s);
    const ip = common.removeCIDR(s, throwErrors);
    if (ip !== null) {
      const arr = v6.addrToArray(ip, throwErrors);
      if (arr !== null) {
        return v6.arrayToAddr(arr, throwErrors);
      }
    }
    return null;
  }
  // otherwise assume it's an IPv4 address
  const ip = common.removeCIDR(s, throwErrors);
  if (ip !== null) {
    const arr = v4.addrToArray(s, throwErrors);
    if (arr !== null) {
      return v4.arrayToAddr(arr, throwErrors);
    }
  }
  return null;
}
