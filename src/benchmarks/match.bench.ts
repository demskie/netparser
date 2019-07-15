import * as Benchmark from "benchmark";
import * as match from "../match";
import * as ipv6 from "../ipv6";
import * as ipaddr from "ipaddr.js";
import { default as cidrMatcher } from "cidr-matcher";
import { fixedWidth } from "./formatters";

const ipv6Addresses = Array.from(Array(1000), () => ipv6.randomAddress().toString());
const ipv6Subnets = Array.from(Array(10000), () => ipv6.randomNetwork().toString());

let netparserMatcherIPv6 = new match.Matcher();
let ipaddrRangeListIPv6 = { subnetRanges: [] };
let cidrMatcherIPv6 = new cidrMatcher(ipv6Subnets);

new Benchmark.Suite("match.bench.ts")

  .add(fixedWidth("create (netparser)", 30), () => {
    netparserMatcherIPv6 = new match.Matcher(ipv6Subnets);
  })

  .add(fixedWidth("create (cidr-matcher)", 30), () => {
    cidrMatcherIPv6 = new cidrMatcher(ipv6Subnets);
  })

  .add(fixedWidth("create (ipaddr.js)", 30), () => {
    for (var subnet of ipv6Subnets) {
      ipaddrRangeListIPv6.subnetRanges.push(ipaddr.parseCIDR(subnet));
    }
  })

  .add(fixedWidth("query (netparser)", 30), () => {
    netparserMatcherIPv6.has(ipv6Addresses[0]);
  })

  .add(fixedWidth("query (cidr-matcher)", 30), () => {
    cidrMatcherIPv6.contains(ipv6Addresses[0]);
  })

  .add(fixedWidth("query (ipaddr.js)", 30), () => {
    const parsedAddr = ipaddr.parse(ipv6Addresses[0]) as ipaddr.IPv6;
    ipaddr.subnetMatch(parsedAddr, ipaddrRangeListIPv6, "unknown");
  })

  .on("complete", function() {
    console.log(`'${this.name}' output:`);
    this.forEach((bench: Benchmark) => {
      console.log(bench.toString());
    });
  })

  .run();
