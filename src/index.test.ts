import * as index from "./index";

test("sanity check IPv4", () => {
  const input = "255.255.255.255";
  const output = index.parseIP(input);
  if (input !== output) {
    throw new Error(`'${input}' !== '${output}'`);
  }
});

test("sanity check IPv6", () => {
  const input = "ffff:fc00::1:1234";
  const output = index.parseIP(input, true);
  if (input !== output) {
    throw new Error(`'${input}' !== '${output}'`);
  }
});
