import * as shared from "./shared";
import * as sort from "./sort";

test("sanity check setAddress #1", () => {
  shared.setAddress(new Uint8Array(4), new Uint8Array(16));
});

test("sanity check setAddress #2", () => {
  shared.setAddress(new Uint8Array(16), new Uint8Array(4));
});

test("sanity check compareAddresses #1", () => {
  const output = shared.compareAddresses(new Uint8Array(4), new Uint8Array(16));
  expect(output).toEqual(shared.Pos.before);
});

test("sanity check compareAddresses #2", () => {
  const output = shared.compareAddresses(new Uint8Array(16), new Uint8Array(4));
  expect(output).toEqual(shared.Pos.after);
});

test("sanity check increaseAddressWithCIDR #1", () => {
  const output = shared.increaseAddressWithCIDR(new Uint8Array([255, 255, 255, 255]), 32);
  expect(output).toEqual(null);
});

test("sanity check decreaseAddressWithCIDR #1", () => {
  const output = shared.decreaseAddressWithCIDR(new Uint8Array([0, 0, 0, 0]), 32);
  expect(output).toEqual(null);
});

test("sanity check parseAddressString #1", () => {
  const output = shared.parseAddressString("foobar");
  expect(output).toEqual(null);
});

test("sanity check binarySearchForIndex #1", () => {
  const input = [
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
  const output = sort.binarySearchForIndex(shared.parseNetworkString("192.168.0.122/32"), input);
  expect(output).toEqual(4);
});
