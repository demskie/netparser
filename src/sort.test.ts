import * as shared from "./shared";
import * as sort from "./sort";

test("sanity check binarySearchForInsertionIndex #1", () => {
  const inputNetwork = shared.parseNetworkString("192.168.0.122/32");
  const inputArray = [
    shared.parseNetworkString("192.168.0.0/32"),
    shared.parseNetworkString("192.168.0.3/32"),
    shared.parseNetworkString("192.168.0.24/32"),
    shared.parseNetworkString("192.168.0.52/32"),
    shared.parseNetworkString("192.168.0.123/32"),
    shared.parseNetworkString("192.168.0.124/32"),
    shared.parseNetworkString("192.168.0.125/32"),
    shared.parseNetworkString("192.168.0.170/32"),
    shared.parseNetworkString("192.168.0.171/32"),
    shared.parseNetworkString("192.168.0.222/32"),
    shared.parseNetworkString("192.168.0.234/32"),
    shared.parseNetworkString("192.168.0.255/32")
  ];
  const output = sort.binarySearchForInsertionIndex(inputNetwork, inputArray);
  expect(output).toEqual(4);
});

test("sanity check binarySearchForInsertionIndex #2", () => {
  const inputNetwork = shared.parseNetworkString("192.168.0.255/32");
  const inputArray = [
    shared.parseNetworkString("192.168.0.0/32"),
    shared.parseNetworkString("192.168.0.3/32"),
    shared.parseNetworkString("192.168.0.24/32"),
    shared.parseNetworkString("192.168.0.52/32"),
    shared.parseNetworkString("192.168.0.123/32"),
    shared.parseNetworkString("192.168.0.124/32"),
    shared.parseNetworkString("192.168.0.125/32"),
    shared.parseNetworkString("192.168.0.170/32"),
    shared.parseNetworkString("192.168.0.171/32"),
    shared.parseNetworkString("192.168.0.222/32"),
    shared.parseNetworkString("192.168.0.234/32"),
    shared.parseNetworkString("192.168.0.254/31")
  ];
  const output = sort.binarySearchForInsertionIndex(inputNetwork, inputArray);
  expect(output).toEqual(12);
});

test("sanity check binarySearchForInsertionIndex #3", () => {
  const inputNetwork = shared.parseNetworkString("192.168.0.255/32");
  const inputArray = [
    shared.parseNetworkString("192.168.0.0/32"),
    shared.parseNetworkString("192.168.0.3/32"),
    shared.parseNetworkString("192.168.0.24/32"),
    shared.parseNetworkString("192.168.0.52/32"),
    shared.parseNetworkString("192.168.0.123/32"),
    shared.parseNetworkString("192.168.0.124/32"),
    shared.parseNetworkString("192.168.0.125/32"),
    shared.parseNetworkString("192.168.0.170/32"),
    shared.parseNetworkString("192.168.0.171/32"),
    shared.parseNetworkString("192.168.0.222/32"),
    shared.parseNetworkString("192.168.0.234/32"),
    shared.parseNetworkString("192.168.0.255/32")
  ];
  const output = sort.binarySearchForInsertionIndex(inputNetwork, inputArray);
  expect(output).toEqual(11);
});
