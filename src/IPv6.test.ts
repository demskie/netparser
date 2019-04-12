import * as common from "./common";
import * as ipv6 from "./IPv6";

test("sanity check IPv6 offset by /128", () => {
  const input = "2001:db8:122:344::";
  let bytes = ipv6.addrToBytes(input, true);
  bytes = common.offsetAddressWithCIDR(bytes, 128, true);
  const output = ipv6.bytesToAddr(bytes, true);
  const expected = "2001:db8:122:344::1";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});
