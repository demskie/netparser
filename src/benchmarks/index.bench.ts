import * as Benchmark from "benchmark";
import * as netparser from "../index";
import { Netmask } from "netmask";
import * as ipaddr from "ipaddr.js";
import * as ipaddress from "ip-address";

new Benchmark.Suite("index.bench.ts")

  .add("\tbaseAddress (netparser)", () => {
    netparser.baseAddress("192.168.0.4/24");
  })

  .add("\tbaseAddress (ip-address)", () => {
    new ipaddress.Address4("192.168.0.4/24").startAddress;
  })

  .add("\tbaseAddress (ipaddr.js)", () => {
    ipaddr.IPv4.networkAddressFromCIDR("192.168.0.4/24").toString();
  })

  .add("\tbaseAddress (netmask)", () => {
    new Netmask("192.168.0.4/24").base;
  })

  .add("\tnetworkContainsAddress (netparser)", () => {
    netparser.networkContainsAddress("192.168.0.0/24", "192.168.0.4");
  })

  .add("\tnetworkContainsAddress (ip-address)", () => {
    new ipaddress.Address4("192.168.0.0/24").isInSubnet(new ipaddress.Address4("192.168.0.4"));
  })

  .add("\tnetworkContainsAddress (ipaddr.js)", () => {
    const addr = ipaddr.parse("192.168.0.4") as ipaddr.IPv4;
    addr.match(ipaddr.parseCIDR("192.168.0.0/24") as [ipaddr.IPv4, number]);
  })

  .add("\tnetworkContainsAddress (netmask)", () => {
    new Netmask("192.168.0.0/24").contains("192.168.0.4");
  })

  .on("complete", function() {
    console.log(`'${this.name}' output:`);
    this.forEach((bench: Benchmark) => {
      console.log(bench.toString());
    });
  })

  .run();
