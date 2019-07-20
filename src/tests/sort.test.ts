import * as sort from "../sort";
import * as ipv4 from "../ipv6";
import { Network } from "../network";
import { sortBy } from "lodash";

export function nativeSort(networks: Network[]) {
  return sortBy(networks, [
    o => o.addr.bytes().length,
    o => (o.addr.bytes()[0] ? o.addr.bytes()[0] : 0),
    o => (o.addr.bytes()[1] ? o.addr.bytes()[1] : 0),
    o => (o.addr.bytes()[2] ? o.addr.bytes()[2] : 0),
    o => (o.addr.bytes()[3] ? o.addr.bytes()[3] : 0),
    o => (o.addr.bytes()[4] ? o.addr.bytes()[4] : 0),
    o => (o.addr.bytes()[5] ? o.addr.bytes()[5] : 0),
    o => (o.addr.bytes()[6] ? o.addr.bytes()[6] : 0),
    o => (o.addr.bytes()[7] ? o.addr.bytes()[7] : 0),
    o => (o.addr.bytes()[8] ? o.addr.bytes()[8] : 0),
    o => (o.addr.bytes()[9] ? o.addr.bytes()[9] : 0),
    o => (o.addr.bytes()[10] ? o.addr.bytes()[10] : 0),
    o => (o.addr.bytes()[11] ? o.addr.bytes()[11] : 0),
    o => (o.addr.bytes()[12] ? o.addr.bytes()[12] : 0),
    o => (o.addr.bytes()[13] ? o.addr.bytes()[13] : 0),
    o => (o.addr.bytes()[14] ? o.addr.bytes()[14] : 0),
    o => (o.addr.bytes()[15] ? o.addr.bytes()[15] : 0),
    o => o.cidr()
  ]);
}

test("sanity check binarySearchForInsertionIndex #1", () => {
  const inputNetwork = new Network("192.168.0.122/32");
  const inputArray = [
    new Network("192.168.0.0/32"),
    new Network("192.168.0.3/32"),
    new Network("192.168.0.24/32"),
    new Network("192.168.0.52/32"),
    new Network("192.168.0.123/32"),
    new Network("192.168.0.124/32"),
    new Network("192.168.0.125/32"),
    new Network("192.168.0.170/32"),
    new Network("192.168.0.171/32"),
    new Network("192.168.0.222/32"),
    new Network("192.168.0.234/32"),
    new Network("192.168.0.255/32")
  ];
  const output = sort.binarySearchForInsertionIndex(inputNetwork, inputArray);
  expect(output).toEqual(4);
});

test("sanity check binarySearchForInsertionIndex #2", () => {
  const inputNetwork = new Network("192.168.0.255/32");
  const inputArray = [
    new Network("192.168.0.0/32"),
    new Network("192.168.0.3/32"),
    new Network("192.168.0.24/32"),
    new Network("192.168.0.52/32"),
    new Network("192.168.0.123/32"),
    new Network("192.168.0.124/32"),
    new Network("192.168.0.125/32"),
    new Network("192.168.0.170/32"),
    new Network("192.168.0.171/32"),
    new Network("192.168.0.222/32"),
    new Network("192.168.0.234/32"),
    new Network("192.168.0.254/31")
  ];
  const output = sort.binarySearchForInsertionIndex(inputNetwork, inputArray);
  expect(output).toEqual(12);
});

test("sanity check binarySearchForInsertionIndex #3", () => {
  const inputNetwork = new Network("192.168.0.255/32");
  const inputArray = [
    new Network("192.168.0.0/32"),
    new Network("192.168.0.3/32"),
    new Network("192.168.0.24/32"),
    new Network("192.168.0.52/32"),
    new Network("192.168.0.123/32"),
    new Network("192.168.0.124/32"),
    new Network("192.168.0.125/32"),
    new Network("192.168.0.170/32"),
    new Network("192.168.0.171/32"),
    new Network("192.168.0.222/32"),
    new Network("192.168.0.234/32"),
    new Network("192.168.0.255/32")
  ];
  const output = sort.binarySearchForInsertionIndex(inputNetwork, inputArray);
  expect(output).toEqual(11);
});

test("sanity check binarySearchForInsertionIndex #4", () => {
  const before = [
    new Network("45.153.242.35/31"),
    new Network("143.80.146.80/28"),
    new Network("192.238.208.227/29"),
    new Network("160.187.236.173/29"),
    new Network("18.47.206.111/30"),
    new Network("29.141.134.6/26"),
    new Network("91.216.183.86/26"),
    new Network("23.232.169.130/31"),
    new Network("28.118.179.165/30"),
    new Network("116.112.231.148/30")
  ];
  const after = [];
  before.forEach((net: Network) => {
    var idx = sort.binarySearchForInsertionIndex(net, after);
    after.splice(idx, 0, net);
  });
  expect(after).toEqual([
    new Network("18.47.206.111/30"),
    new Network("23.232.169.130/31"),
    new Network("28.118.179.165/30"),
    new Network("29.141.134.6/26"),
    new Network("45.153.242.35/31"),
    new Network("91.216.183.86/26"),
    new Network("116.112.231.148/30"),
    new Network("143.80.146.80/28"),
    new Network("160.187.236.173/29"),
    new Network("192.238.208.227/29")
  ]);
});

test("cross check all sorting methods", () => {
  const alpha = Array.from(Array(10000), () => ipv4.randomNetwork());
  const bravo = Array.from(alpha, (net: Network) => net.duplicate());
  const charlie = Array.from(alpha, (net: Network) => net.duplicate());

  const sortedAlpha = sort.insertionSort(alpha);
  const sortedBravo = sort.radixSort(bravo);
  const sortedCharlie = nativeSort(charlie);

  const sortedAlphaStrings = Array.from(sortedAlpha, (net: Network) => net.toString());
  const sortedBravoStrings = Array.from(sortedBravo, (net: Network) => net.toString());
  const sortedCharlieStrings = Array.from(sortedCharlie, (net: Network) => net.toString());

  expect(sortedAlphaStrings).toEqual(sortedBravoStrings);
  expect(sortedAlphaStrings).toEqual(sortedCharlieStrings);
});
