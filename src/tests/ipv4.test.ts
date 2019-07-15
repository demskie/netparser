import * as index from "../index";
import * as ipv4 from "../ipv4";
import { Network } from "../network";
import { Address } from "../address";

test("sanity check IPv4 offset by /32", () => {
  const addr = new Address("192.168.0.0");
  expect(addr.next().toString()).toEqual("192.168.0.1");
});

test("sanity check IPv4 negative offset by /32", () => {
  const addr = new Address("192.168.0.0");
  expect(addr.previous().toString()).toEqual("192.167.255.255");
});

test("sanity check IPv4 offset by /24 with overflow", () => {
  const addr = new Network("192.168.255.0/24");
  expect(addr.next().toString()).toEqual("192.169.0.0/24");
});

test("sanity check IPv4 offset by /25 with overflow", () => {
  const addr = new Address("192.168.0.248");
  expect(addr.increase(25).toString()).toEqual("192.168.1.120");
});

test("sanity check IPv4 recursion", () => {
  const addr = new Address("254.255.255.255", true);
  expect(addr.increase(24, true).toString()).toEqual("255.0.0.255");
});

test("sanity check IPv4 address space overflow error", () => {
  const addr = new Address("255.255.255.255", true);
  expect(addr.next().toString()).toEqual("");
});

test("sanity check IPv4 applySubnetMask()", () => {
  const addr = new Address("192.168.0.248", true);
  expect(addr.applySubnetMask(16).toString()).toEqual("192.168.0.0");
});

test("sanity check IPv4 intersects() #1", () => {
  const alpha = new Network("192.168.0.0/22");
  const bravo = new Network("192.168.1.0/24");
  expect(alpha.intersects(bravo)).toEqual(true);
});

test("sanity check IPv4 intersects() #2", () => {
  const alpha = new Network("192.168.0.0/24");
  const bravo = new Network("192.168.1.0/24");
  expect(alpha.intersects(bravo)).toEqual(false);
});

test("sanity check IPv4 intersects() #3", () => {
  const alpha = new Network("192.168.1.0/24");
  const bravo = new Network("192.168.0.0/24");
  expect(alpha.intersects(bravo)).toEqual(false);
});

test("sanity check ipv4.randomAddress", () => {
  const output = ipv4.randomAddress();
  expect(index.ip(output)).toBeTruthy();
});

test("sanity check ipv4.randomNetwork", () => {
  expect(ipv4.randomNetwork().toString()).toBeTruthy();
});
