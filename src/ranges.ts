/* eslint-disable @typescript-eslint/no-explicit-any */

import { Network } from "./network";
import { Address } from "./address";

var ipv4Ranges = undefined as any;

function createIPv4Ranges() {
  return {
    unspecified: [
      new Network("0.0.0.0/8", true) //
    ],
    broadcast: [
      new Network("255.255.255.255/32") //
    ],
    multicast: [
      new Network("224.0.0.0/4") // RFC3171
    ],
    linkLocal: [
      new Network("169.254.0.0/16") // RFC3927
    ],
    loopback: [
      new Network("127.0.0.0/8") // RFC5735
    ],
    carrierGradeNat: [
      new Network("100.64.0.0/10") //RFC6598
    ],
    private: [
      new Network("10.0.0.0/8"), // RFC1918
      new Network("172.16.0.0/12"),
      new Network("192.168.0.0/16")
    ],
    reserved: [
      new Network("192.0.0.0/24"), // RFC5735, RFC5737, RFC2544, RFC1700
      new Network("192.0.2.0/24"),
      new Network("192.88.99.0/24"),
      new Network("198.51.100.0/24"),
      new Network("203.0.113.0/24"),
      new Network("240.0.0.0/24")
    ]
  };
}

var ipv6Ranges = undefined as any;

function createIPv6Ranges() {
  return {
    unspecified: [
      new Network("::/128") // RFC4291
    ],
    linkLocal: [
      new Network("fe80::/10") // RFC4291
    ],
    multicast: [
      new Network("ff00::/8") // RFC4291
    ],
    loopback: [
      new Network("::1/128") // RFC4291
    ],
    uniqueLocal: [
      new Network("fc00::/7") // RFC4291
    ],
    ipv4Mapped: [
      new Network("::ffff:0:0/96") // RFC4291
    ],
    rfc6145: [
      new Network("::ffff:0:0:0/96") // RFC6145
    ],
    rfc6052: [
      new Network("64:ff9b::/96") // RFC6052
    ],
    "6to4": [
      new Network("2002::/16") // RFC3056
    ],
    teredo: [
      new Network("2001::/32") // RFC6052, RFC6146
    ],
    reserved: [
      new Network("2001:db8::/32") // RFC4291
    ]
  };
}

// https://dev.to/kingdaro/indexing-objects-in-typescript-1cgi
function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj;
}

export function check(address: Address, key: string) {
  if (address.isValid()) {
    if (address.isIPv4()) {
      var ranges = ipv4Ranges ? ipv4Ranges : createIPv4Ranges();
    } else {
      var ranges = ipv6Ranges ? ipv6Ranges : createIPv6Ranges();
    }
    if (hasKey(ranges, key)) {
      for (var net of ranges[key]) {
        if (net.contains(address.toNetwork())) return true;
      }
    }
  }
  return false;
}
