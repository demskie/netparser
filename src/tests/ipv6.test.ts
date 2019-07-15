import * as ipv6 from "../ipv6";
import { Address } from "../address";

test("sanity check IPv6 offset by /128", () => {
  const addr = new Address("2001:db8:122:344::");
  expect(addr.next().toString()).toEqual("2001:db8:122:344::1");
});

test("sanity check IPv6 negative offset by /128", () => {
  const addr = new Address("2001:db8:122:344::");
  expect(addr.previous().toString()).toEqual("2001:db8:122:343:ffff:ffff:ffff:ffff");
});

test("sanity check IPv6 applySubnetMask()", () => {
  const addr = new Address("b011:a2c2:7328:cc01:4ee7:e2ec:6269:babf");
  expect(addr.applySubnetMask(64).toString()).toEqual("b011:a2c2:7328:cc01::");
});

test("sanity check embedded IPv4", () => {
  const addr = new Address("2001:db8:122:344::192.0.2.33", true);
  expect(addr.toString()).toEqual("2001:db8:122:344::c000:221");
});

test("sanity check ipv6.randomAddress", () => {
  const addr = ipv6.randomAddress();
  expect(addr.toString()).not.toEqual("");
});

test("sanity check ipv6.randomNetwork", () => {
  const addr = ipv6.randomNetwork();
  expect(addr.toString()).not.toEqual("");
});
