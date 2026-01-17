import * as ipv6 from "../ipv6";
import { Address } from "../address";
import { Network } from "../network";

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

test("sanity check IPv6 intersects() with non-overlapping networks", () => {
  // 100::/50 has range 100:0:0:0:0:0:0:0 - 100:0:0:3fff:ffff:ffff:ffff:ffff
  // ff00::/8 has range ff00:0:0:0:0:0:0:0 - ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff
  // These clearly do not overlap
  const alpha = new Network("100::/50");
  const bravo = new Network("ff00::/8");
  expect(alpha.intersects(bravo)).toEqual(false);
  expect(bravo.intersects(alpha)).toEqual(false);
});

test("sanity check IPv6 intersects() with overlapping networks", () => {
  const alpha = new Network("2001:db8::/32");
  const bravo = new Network("2001:db8:1::/48");
  expect(alpha.intersects(bravo)).toEqual(true);
  expect(bravo.intersects(alpha)).toEqual(true);
});
