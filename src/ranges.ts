import * as v4 from "./ipv4";
import * as v6 from "./ipv6";

export const ipv4SpecialRanges = [
  {
    name: "unspecified", //
    bytes: v4.addrToBytes("0.0.0.0"),
    cidr: 8
  },
  {
    name: "broadcast", //
    bytes: v4.addrToBytes("255.255.255.255"),
    cidr: 32
  },
  {
    name: "multicast", // RFC3171
    bytes: v4.addrToBytes("224.0.0.0"),
    cidr: 4
  },
  {
    name: "link local", // RFC3927
    bytes: v4.addrToBytes("169.254.0.0"),
    cidr: 16
  },
  {
    name: "loopback", // RFC5735
    bytes: v4.addrToBytes("127.0.0.0"),
    cidr: 8
  },
  {
    name: "carrier grade nat", // RFC6598
    bytes: v4.addrToBytes("100.64.0.0"),
    cidr: 10
  },
  {
    name: "private", // RFC1918
    bytes: v4.addrToBytes("10.0.0.0"),
    cidr: 8
  },
  {
    name: "private", // RFC1918
    bytes: v4.addrToBytes("172.16.0.0"),
    cidr: 12
  },
  {
    name: "private", // RFC1918
    bytes: v4.addrToBytes("192.168.0.0"),
    cidr: 16
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    bytes: v4.addrToBytes("192.0.0.0"),
    cidr: 24
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    bytes: v4.addrToBytes("192.0.2.0"),
    cidr: 24
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    bytes: v4.addrToBytes("192.88.99.0"),
    cidr: 24
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    bytes: v4.addrToBytes("198.51.100.0"),
    cidr: 24
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    bytes: v4.addrToBytes("203.0.113.0"),
    cidr: 24
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    bytes: v4.addrToBytes("240.0.0.0"),
    cidr: 24
  }
];

export const ipv6SpecialRanges = [
  {
    name: "unspecified", // RFC4291
    bytes: v6.addrToBytes("::"),
    cidr: 128
  },
  {
    name: "link local", // RFC4291
    bytes: v6.addrToBytes("fe80::"),
    cidr: 10
  },
  {
    name: "multicast", // RFC4291
    bytes: v6.addrToBytes("ff00::"),
    cidr: 8
  },
  {
    name: "loopback", // RFC4291
    bytes: v6.addrToBytes("::1"),
    cidr: 128
  },
  {
    name: "unique local", // RFC4291
    bytes: v6.addrToBytes("fc00::"),
    cidr: 7
  },
  {
    name: "ipv4 mapped", // RFC4291
    bytes: v6.addrToBytes("::ffff:0:0"),
    cidr: 96
  },
  {
    name: "rfc6145", // RFC6145
    bytes: v6.addrToBytes("::ffff:0:0:0"),
    cidr: 96
  },
  {
    name: "rfc6052", // RFC6052
    bytes: v6.addrToBytes("64:ff9b::"),
    cidr: 96
  },
  {
    name: "6to4", // RFC3056
    bytes: v6.addrToBytes("2002::"),
    cidr: 16
  },
  {
    name: "teredo", // RFC6052, RFC6146
    bytes: v6.addrToBytes("2001::"),
    cidr: 32
  },
  {
    name: "reserved", // RFC4291
    bytes: v6.addrToBytes("2001:db8::"),
    cidr: 32
  }
];
