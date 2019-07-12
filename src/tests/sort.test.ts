import * as sort from "../sort";
import { Network } from "../network";

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
