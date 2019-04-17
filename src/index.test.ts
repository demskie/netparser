import * as index from "./index";
import * as subnets from "./mockdata/subnets";

test("sanity check IPv4", () => {
  const output = index.ip("255.255.255.255", true);
  expect(output).toEqual("255.255.255.255");
});

test("sanity check IPv6", () => {
  const output = index.ip("ffff:fc00::1:1234", true);
  expect(output).toEqual("ffff:fc00::1:1234");
});

test("sanity check network parsing", () => {
  for (var input of subnets.valid as string[]) {
    index.network(input, true);
  }
  for (var input of subnets.invalid as string[]) {
    expect(index.network(input)).toEqual(null);
  }
});

test("sanity check IPv4 baseAddress", () => {
  const output = index.baseAddress("192.168.200.113/24", true);
  expect(output).toEqual("192.168.200.0");
});

test("sanity check IPv4 rangeOfNetworks", () => {
  const output = index.rangeOfNetworks("192.168.1.2", "192.168.2.2");
  expect(output).toEqual([
    "192.168.1.2/31",
    "192.168.1.4/30",
    "192.168.1.8/29",
    "192.168.1.16/28",
    "192.168.1.32/27",
    "192.168.1.64/26",
    "192.168.1.128/25",
    "192.168.2.0/31",
    "192.168.2.2/32"
  ]);
});

test("sanity check IPv6 rangeOfNetworks", () => {
  const output = index.rangeOfNetworks("2001:400::", "2001:440:ffff:ffff:7fff:ffff:ffff:ffff");
  expect(output).toEqual([
    "2001:400::/26",
    "2001:440::/33",
    "2001:440:8000::/34",
    "2001:440:c000::/35",
    "2001:440:e000::/36",
    "2001:440:f000::/37",
    "2001:440:f800::/38",
    "2001:440:fc00::/39",
    "2001:440:fe00::/40",
    "2001:440:ff00::/41",
    "2001:440:ff80::/42",
    "2001:440:ffc0::/43",
    "2001:440:ffe0::/44",
    "2001:440:fff0::/45",
    "2001:440:fff8::/46",
    "2001:440:fffc::/47",
    "2001:440:fffe::/48",
    "2001:440:ffff::/49",
    "2001:440:ffff:8000::/50",
    "2001:440:ffff:c000::/51",
    "2001:440:ffff:e000::/52",
    "2001:440:ffff:f000::/53",
    "2001:440:ffff:f800::/54",
    "2001:440:ffff:fc00::/55",
    "2001:440:ffff:fe00::/56",
    "2001:440:ffff:ff00::/57",
    "2001:440:ffff:ff80::/58",
    "2001:440:ffff:ffc0::/59",
    "2001:440:ffff:ffe0::/60",
    "2001:440:ffff:fff0::/61",
    "2001:440:ffff:fff8::/62",
    "2001:440:ffff:fffc::/63",
    "2001:440:ffff:fffe::/64",
    "2001:440:ffff:ffff::/65"
  ]);
});
