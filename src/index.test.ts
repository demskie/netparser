import * as index from "./index";

test("sanity check IPv4", () => {
  const input = "255.255.255.255";
  const output = index.ip(input);
  if (input !== output) {
    throw new Error(`'${input}' !== '${output}'`);
  }
});

test("sanity check IPv6", () => {
  const input = "ffff:fc00::1:1234";
  const output = index.ip(input, true);
  if (input !== output) {
    throw new Error(`'${input}' !== '${output}'`);
  }
});

test("sanity check IPv4 baseAddress", () => {
  const input = "192.168.200.113/24";
  const output = index.baseAddress(input, true);
  const expected = "192.168.200.0";
  if (output !== expected) {
    throw new Error(`'${output}' !== '${expected}'`);
  }
});
