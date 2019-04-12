import * as common from "./common";
import * as ipv4 from "./IPv4";

test("sanity check IPv4 offset by /32", () => {
  const input = "192.168.0.0";
  let arr = ipv4.addrToArray(input, true);
  arr = common.offsetArrayWithCIDR(arr, 32, true);
  const output = ipv4.arrayToAddr(arr, true);
  const expected = "192.168.0.1";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("sanity check IPv4 offset by /24 with overflow", () => {
  const input = "192.168.255.0";
  let arr = ipv4.addrToArray(input, true);
  arr = common.offsetArrayWithCIDR(arr, 24, true);
  const output = ipv4.arrayToAddr(arr, true);
  const expected = "192.169.0.0";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("sanity check IPv4 offset by /25 with overflow", () => {
  const input = "192.168.0.248";
  let arr = ipv4.addrToArray(input, true);
  arr = common.offsetArrayWithCIDR(arr, 25, true);
  const output = ipv4.arrayToAddr(arr, true);
  const expected = "192.168.1.120";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("sanity check IPv4 recursion", () => {
  const input = "254.255.255.255";
  let arr = ipv4.addrToArray(input, true);
  arr = common.offsetArrayWithCIDR(arr, 24, true);
  const output = ipv4.arrayToAddr(arr, true);
  const expected = "255.0.0.255";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("throw IPv4 address space overflow error", () => {
  const input = "255.255.255.255";
  let arr = ipv4.addrToArray(input, true);
  let err: Error | undefined;
  try {
    common.offsetArrayWithCIDR(arr, 32, true);
  } catch (e) {
    err = e;
  }
  if (err.message !== common.errorOverflowedAddressSpace.message) {
    throw new Error(`unexpected: ${err}`);
  }
});
