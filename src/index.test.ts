import * as index from "./index";
import * as subnets from "./mockdata/subnets.mock";

test("sanity check baseAddress", () => {
  const output = index.baseAddress("192.168.200.113/24", true);
  expect(output).toEqual("192.168.200.0");
});

test("sanity check broadcastAddress", () => {
  const output = index.broadcastAddress("192.168.0.0/24", true);
  expect(output).toEqual("192.168.0.255");
});

test("sanity check unusedSubnets", () => {
  const output = index.findUnusedSubnets("192.168.0.0/22", ["192.168.1.0/24", "192.168.2.32/30"], true, true);
  expect(output).toEqual([
    "192.168.0.0/24",
    "192.168.2.0/27",
    "192.168.2.36/30",
    "192.168.2.40/29",
    "192.168.2.48/28",
    "192.168.2.64/26",
    "192.168.2.128/25",
    "192.168.3.0/24"
  ]);
});

test("sanity check ip parsing", () => {
  let output = index.ip("255.255.255.255", true);
  expect(output).toEqual("255.255.255.255");
  output = index.ip("ffff:fc00::1:1234", true);
  expect(output).toEqual("ffff:fc00::1:1234");
});

test("sanity check network parsing", () => {
  for (var input of subnets.valid as string[]) {
    index.network(input, true);
  }
  for (var input of subnets.invalid as string[]) {
    expect(index.network(input, false)).toEqual(null);
  }
});

test("sanity check networkComesBefore", () => {
  const output = index.networkComesBefore("192.168.0.0/24", "192.168.1.0/24", true, true);
  expect(output).toEqual(true);
});

test("sanity check networkContainsAddress", () => {
  const output = index.networkContainsAddress("192.168.0.0/24", "192.168.0.100", true, true);
  expect(output).toEqual(true);
});

test("sanity check networkContainsSubnet", () => {
  const output = index.networkContainsSubnet("192.168.0.0/16", "192.168.0.0/24", true, true);
  expect(output).toEqual(true);
});

test("sanity check networksIntersect", () => {
  const output = index.networksIntersect("192.168.0.0/24", "192.168.1.0/24", true, true);
  expect(output).toEqual(false);
});

test("sanity check nextAddress", () => {
  const output = index.nextAddress("192.168.0.0", true);
  expect(output).toEqual("192.168.0.1");
});

test("sanity check nextNetwork", () => {
  const output = index.nextNetwork("192.168.0.0/24", true, true);
  expect(output).toEqual("192.168.1.0/24");
});

test("sanity check rangeOfNetworks IPv4", () => {
  const output = index.rangeOfNetworks("192.168.1.2", "192.168.2.2", true);
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

test("sanity check rangeOfNetworks IPv6", () => {
  const output = index.rangeOfNetworks("2001:400::", "2001:440:ffff:ffff:7fff:ffff:ffff:ffff", true);
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

test("sanity check sort", () => {
  const output = index.sort(["192.168.2.3/31", "255.255.255.255", "192.168.0.0/16"], true);
  expect(output).toEqual(["192.168.0.0/16", "192.168.2.3/31", "255.255.255.255/32"]);
});

test("sanity check summarize", () => {
  const output = index.summarize(["192.168.0.0/16", "192.168.1.1", "192.168.2.3/31"], true);
  expect(output).toEqual(["192.168.0.0/16"]);
});
