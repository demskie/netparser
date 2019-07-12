import * as parse from "../parse";

test("sanity check v6AddrToBytes #1", () => {
  const output = parse.v6AddrToBytes("ffff:fc00::1:1234");
  expect(output).not.toEqual([]);
});
