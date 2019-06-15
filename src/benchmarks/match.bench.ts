import * as Benchmark from "benchmark";
import * as match from "../match";
import * as ipv4 from "../ipv4";
import * as ipv6 from "../ipv6";
import * as ipaddr from "ipaddr.js";
import { default as cidrMatcher } from "cidr-matcher";

const ipv4Addresses = Array.from(Array(1000), () => ipv4.randomAddress());
const ipv4Subnets = Array.from(Array(10000), () => ipv4.randomNetwork());

let netparserMatcherIPv4 = new match.Matcher();
let ipaddrRangeListIPv4 = { subnetRanges: [] };
let cidrMatcherIPv4 = new cidrMatcher(ipv4Subnets);

const ipv6Addresses = Array.from(Array(1000), () => ipv6.randomAddress());
const ipv6Subnets = Array.from(Array(10000), () => ipv6.randomNetwork());

let netparserMatcherIPv6 = new match.Matcher();
let ipaddrRangeListIPv6 = { subnetRanges: [] };
let cidrMatcherIPv6 = new cidrMatcher(ipv4Subnets);

new Benchmark.Suite("match.bench.ts")

  .add("\tIPv4 matcher creation (netparser)", () => {
    netparserMatcherIPv4 = new match.Matcher(ipv4Subnets);
  })

  .add("\tIPv4 matcher creation (ipaddr.js)", () => {
    for (var subnet of ipv4Subnets) {
      ipaddrRangeListIPv4.subnetRanges.push(ipaddr.parseCIDR(subnet));
    }
  })

  .add("\tIPv4 matcher creation (cidr-matcher)", () => {
    cidrMatcherIPv4 = new cidrMatcher(ipv4Subnets);
  })

  .add("\tIPv4 matcher query (netparser)", () => {
    netparserMatcherIPv4.has(ipv4Addresses[0]);
  })

  .add("\tIPv4 matcher query (ipaddr.js)", () => {
    let parsedAddr = ipaddr.parse(ipv4Addresses[0]) as ipaddr.IPv4;
    ipaddr.subnetMatch(parsedAddr, ipaddrRangeListIPv4, "unknown");
  })

  .add("\tIPv4 matcher query (cidr-matcher)", () => {
    cidrMatcherIPv4.contains(ipv4Addresses[0]);
  })

  .add("\tIPv6 matcher creation (netparser)", () => {
    netparserMatcherIPv6 = new match.Matcher(ipv6Subnets);
  })

  .add("\tIPv6 matcher creation (ipaddr.js)", () => {
    for (var subnet of ipv6Subnets) {
      ipaddrRangeListIPv6.subnetRanges.push(ipaddr.parseCIDR(subnet));
    }
  })

  .add("\tIPv6 matcher creation (cidr-matcher)", () => {
    cidrMatcherIPv6 = new cidrMatcher(ipv6Subnets);
  })

  .add("\tIPv6 matcher query (netparser)", () => {
    netparserMatcherIPv6.has(ipv6Addresses[0]);
  })

  .add("\tIPv6 matcher query (ipaddr.js)", () => {
    const parsedAddr = ipaddr.parse(ipv6Addresses[0]) as ipaddr.IPv6;
    ipaddr.subnetMatch(parsedAddr, ipaddrRangeListIPv6, "unknown");
  })

  .add("\tIPv6 matcher query (cidr-matcher)", () => {
    cidrMatcherIPv6.contains(ipv6Addresses[0]);
  })

  .on("complete", function() {
    console.log(`'${this.name}' output:`);
    this.forEach((bench: Benchmark) => {
      console.log(bench.toString());
    });
  })

  .run();
