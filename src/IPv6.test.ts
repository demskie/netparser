import * as common from "./common";
import * as ipv6 from "./IPv6";

test("sanity check IPv6 offset by /128", () => {
  const input = "2001:db8:122:344::";
  const bytes = ipv6.addrToBytes(input, true);
  common.increaseAddressWithCIDR(bytes, 128, true);
  const output = ipv6.bytesToAddr(bytes, true);
  const expected = "2001:db8:122:344::1";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("sanity check IPv6 negative offset by /128", () => {
  const input = "2001:db8:122:344::";
  const bytes = ipv6.addrToBytes(input, true);
  common.decreaseAddressWithCIDR(bytes, 128, true);
  const output = ipv6.bytesToAddr(bytes, true);
  const expected = "2001:db8:122:343:ffff:ffff:ffff:ffff";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});

test("sanity check IPv6 applySubnetMask()", () => {
  const input = "b011:a2c2:7328:cc01:4ee7:e2ec:6269:babf";
  const bytes = ipv6.addrToBytes(input, true);
  common.applySubnetMask(bytes, 64);
  const output = ipv6.bytesToAddr(bytes, true);
  const expected = "b011:a2c2:7328:cc01::";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});
