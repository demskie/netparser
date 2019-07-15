import * as Benchmark from "benchmark";
import * as netparser from "../index";
import { Netmask } from "netmask";
import * as ipaddr from "ipaddr.js";
import * as ipaddress from "ip-address";
import { fixedWidth } from "./formatters";

new Benchmark.Suite("index.bench.ts")

  .add(fixedWidth("baseAddress (netparser)", 30), () => {
    netparser.baseAddress("192.168.0.4/24");
  })

  .add(fixedWidth("baseAddress (ip-address)", 30), () => {
    new ipaddress.Address4("192.168.0.4/24").startAddress;
  })

  .add(fixedWidth("baseAddress (ipaddr.js)", 30), () => {
    ipaddr.IPv4.networkAddressFromCIDR("192.168.0.4/24").toString();
  })

  .add(fixedWidth("baseAddress (netmask)", 30), () => {
    new Netmask("192.168.0.4/24").base;
  })

  .add(fixedWidth("contains (netparser)", 30), () => {
    netparser.networkContainsAddress("192.168.0.0/24", "192.168.0.4");
  })

  .add(fixedWidth("contains (ip-address)", 30), () => {
    new ipaddress.Address4("192.168.0.0/24").isInSubnet(new ipaddress.Address4("192.168.0.4"));
  })

  .add(fixedWidth("contains (ipaddr.js)", 30), () => {
    const addr = ipaddr.parse("192.168.0.4") as ipaddr.IPv4;
    addr.match(ipaddr.parseCIDR("192.168.0.0/24") as [ipaddr.IPv4, number]);
  })

  .add(fixedWidth("contains (netmask)", 30), () => {
    new Netmask("192.168.0.0/24").contains("192.168.0.4");
  })

  .on("complete", function() {
    console.log(`'${this.name}' output:`);
    this.forEach((bench: Benchmark) => {
      console.log(bench.toString());
    });
  })

  .run();
