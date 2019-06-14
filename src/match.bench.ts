import * as Benchmark from "benchmark";
import * as match from "./match";
import * as ipv4 from "./ipv4";
import * as ipv6 from "./ipv6";
import { default as cidrMatcher } from "cidr-matcher";

const addrsIPv4 = new Array(10000) as string[];
for (var i = 0; i < addrsIPv4.length; i++) {
  addrsIPv4[i] = ipv4.random();
}

const addrsIPv6 = new Array(10000) as string[];
for (var i = 0; i < addrsIPv6.length; i++) {
  addrsIPv6[i] = ipv6.random();
}

const subnetsIPv4 = require("./mockdata/subnets.mock").amazonIPv4 as string[];
const subnetsIPv6 = require("./mockdata/subnets.mock").amazonIPv6 as string[];

new Benchmark.Suite("match.bench.ts")

  .add("\tnetparser.Matcher IPv4", () => {
    const matcher = new match.Matcher(subnetsIPv4);
    for (var addr of addrsIPv4) {
      matcher.has(addr);
    }
  })

  .add("\tnetparser.Matcher IPv6", () => {
    const matcher = new match.Matcher(subnetsIPv6);
    for (var addr of addrsIPv6) {
      matcher.has(addr);
    }
  })

  .add("\tcidr-matcher IPv4", () => {
    const matcher = new cidrMatcher(subnetsIPv4);
    for (var addr of addrsIPv4) {
      matcher.contains(addr);
    }
  })

  .add("\tcidr-matcher IPv6", () => {
    const matcher = new cidrMatcher(subnetsIPv6);
    for (var addr of addrsIPv6) {
      matcher.contains(addr);
    }
  })

  .on("complete", function() {
    console.log(`'${this.name}' output:`);
    this.forEach((bench: Benchmark) => {
      console.log(bench.toString());
    });
  })

  .run();
