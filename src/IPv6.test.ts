import * as common from "./common";
import * as ipv6 from "./IPv6";

test("sanity check IPv6 offset by /128", () => {
  const input = "2001:db8:122:344::";
  let arr = ipv6.addrToArray(input, true);
  arr = common.offsetArrayWithCIDR(arr, 128, true);
  const output = ipv6.arrayToAddr(arr, true);
  const expected = "2001:db8:122:344::1";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});
