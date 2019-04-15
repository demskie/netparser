import * as shared from "./shared";
import * as ipv4 from "./IPv4";

test("sanity check IPv4 offset by /32", () => {
  const input = "192.168.0.0";
  const bytes = ipv4.addrToBytes(input, true);
  shared.increaseAddressWithCIDR(bytes, 32, true);
  const output = ipv4.bytesToAddr(bytes, true);
  const expected = "192.168.0.1";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("sanity check IPv4 negative offset by /32", () => {
  const input = "192.168.0.0";
  const bytes = ipv4.addrToBytes(input, true);
  shared.decreaseAddressWithCIDR(bytes, 32, true);
  const output = ipv4.bytesToAddr(bytes, true);
  const expected = "192.167.255.255";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("sanity check IPv4 offset by /24 with overflow", () => {
  const input = "192.168.255.0";
  const bytes = ipv4.addrToBytes(input, true);
  shared.increaseAddressWithCIDR(bytes, 24, true);
  const output = ipv4.bytesToAddr(bytes, true);
  const expected = "192.169.0.0";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("sanity check IPv4 offset by /25 with overflow", () => {
  const input = "192.168.0.248";
  const bytes = ipv4.addrToBytes(input, true);
  shared.increaseAddressWithCIDR(bytes, 25, true);
  const output = ipv4.bytesToAddr(bytes, true);
  const expected = "192.168.1.120";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("sanity check IPv4 recursion", () => {
  const input = "254.255.255.255";
  const bytes = ipv4.addrToBytes(input, true);
  shared.increaseAddressWithCIDR(bytes, 24, true);
  const output = ipv4.bytesToAddr(bytes, true);
  const expected = "255.0.0.255";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("throw IPv4 address space overflow error", () => {
  const input = "255.255.255.255";
  const bytes = ipv4.addrToBytes(input, true);
  let err: Error | undefined;
  try {
    shared.increaseAddressWithCIDR(bytes, 32, true);
  } catch (e) {
    err = e;
  }
  if (err.message !== shared.errorOverflowedAddressSpace.message) {
    throw new Error(`unexpected: ${err}`);
  }
});

test("sanity check IPv4 applySubnetMask()", () => {
  const input = "192.168.0.248";
  const bytes = ipv4.addrToBytes(input, true);
  shared.applySubnetMask(bytes, 16);
  const output = ipv4.bytesToAddr(bytes, true);
  const expected = "192.168.0.0";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});
