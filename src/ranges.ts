import { Network } from "./network";

export const specialIPv4 = [
  {
    name: "unspecified", //
    network: new Network("0.0.0.0/8")
  },
  {
    name: "broadcast", //
    network: new Network("255.255.255.255/32")
  },
  {
    name: "multicast", // RFC3171
    network: new Network("224.0.0.0/4")
  },
  {
    name: "link local", // RFC3927
    network: new Network("169.254.0.0/16")
  },
  {
    name: "loopback", // RFC5735
    network: new Network("127.0.0.0/8")
  },
  {
    name: "carrier grade nat", // RFC6598
    network: new Network("100.64.0.0/10")
  },
  {
    name: "private", // RFC1918
    network: new Network("10.0.0.0/8")
  },
  {
    name: "private", // RFC1918
    network: new Network("172.16.0.0/12")
  },
  {
    name: "private", // RFC1918
    network: new Network("192.168.0.0/16")
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    network: new Network("192.0.0.0/24")
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    network: new Network("192.0.2.0/24")
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    network: new Network("192.88.99.0/24")
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    network: new Network("198.51.100.0/24")
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    network: new Network("203.0.113.0/24")
  },
  {
    name: "reserved", // 5735, 5737, 2544, 1700
    network: new Network("240.0.0.0/24")
  }
];

export const specialIPv6 = [
  {
    name: "unspecified", // RFC4291
    network: new Network("::/128")
  },
  {
    name: "link local", // RFC4291
    network: new Network("fe80::/10")
  },
  {
    name: "multicast", // RFC4291
    network: new Network("ff00::/8")
  },
  {
    name: "loopback", // RFC4291
    network: new Network("::1/128")
  },
  {
    name: "unique local", // RFC4291
    network: new Network("fc00::/7")
  },
  {
    name: "ipv4 mapped", // RFC4291
    network: new Network("::ffff:0:0/96")
  },
  {
    name: "rfc6145", // RFC6145
    network: new Network("::ffff:0:0:0/96")
  },
  {
    name: "rfc6052", // RFC6052
    network: new Network("64:ff9b::/96")
  },
  {
    name: "6to4", // RFC3056
    network: new Network("2002::/16")
  },
  {
    name: "teredo", // RFC6052, RFC6146
    network: new Network("2001::/32")
  },
  {
    name: "reserved", // RFC4291
    network: new Network("2001:db8::/32")
  }
];
