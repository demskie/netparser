import * as index from "../index";

expect.extend({
  toContainAddresses(received: string[], addresses: string[]) {
    const notFound = addresses.filter((i: string) => {
      return undefined === received.find((value: string) => index.networkContainsAddress(value, i));
    });
    if (notFound.length > 0) {
      return { message: () => `expected to find ${notFound} in ${received}`, pass: false };
    } else {
      return { message: () => `expected not to find ${addresses} in ${received}`, pass: true };
    }
  }
});

test("sanity check baseAddress #1", () => {
  const output = index.baseAddress("192.168.200.113/24", true);
  expect(output).toEqual("192.168.200.0");
});

test("sanity check baseAddress #2", () => {
  const output = index.baseAddress("ffff:fc00::1:1234/64", true);
  expect(output).toEqual("ffff:fc00::");
});

test("sanity check baseAddress #3", () => {
  const output = index.baseAddress("foobar");
  expect(output).toEqual(null);
});

test("sanity check broadcastAddress #1", () => {
  const output = index.broadcastAddress("192.168.0.0/24", true);
  expect(output).toEqual("192.168.0.255");
});

test("sanity check broadcastAddress #2", () => {
  const output = index.broadcastAddress("foobar");
  expect(output).toEqual(null);
});

test("sanity check findUnusedSubnets #1", () => {
  const output = index.findUnusedSubnets("192.168.0.0/22", ["192.168.2.32/30", "192.168.1.0/24"], true, true);
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

test("sanity check findUnusedSubnets #2", () => {
  const output = index.findUnusedSubnets("192.168.0.0/22", []);
  expect(output).toEqual(["192.168.0.0/22"]);
});

test("sanity check findUnusedSubnets #3", () => {
  const output = index.findUnusedSubnets("foobar", ["foo", "bar"]);
  expect(output).toEqual(null);
});

test("sanity check findUnusedSubnets #4", () => {
  const output = index.findUnusedSubnets("192.168.0.0/24", ["192.168.0.0/25", "192.168.0.128/26"], true, true);
  expect(output).toEqual(["192.168.0.192/26"]);
});

test("sanity check findUnusedSubnets #5", () => {
  const output = index.findUnusedSubnets("0.0.0.0/0", ["192.168.0.0/25", "192.168.0.128/26"], true, true);
  expect(output).toEqual([
    "0.0.0.0/1",
    "128.0.0.0/2",
    "192.0.0.0/9",
    "192.128.0.0/11",
    "192.160.0.0/13",
    "192.168.0.192/26",
    "192.168.1.0/24",
    "192.168.2.0/23",
    "192.168.4.0/22",
    "192.168.8.0/21",
    "192.168.16.0/20",
    "192.168.32.0/19",
    "192.168.64.0/18",
    "192.168.128.0/17",
    "192.169.0.0/16",
    "192.170.0.0/15",
    "192.172.0.0/14",
    "192.176.0.0/12",
    "192.192.0.0/10",
    "193.0.0.0/8",
    "194.0.0.0/7",
    "196.0.0.0/6",
    "200.0.0.0/5",
    "208.0.0.0/4",
    "224.0.0.0/3"
  ]);
});

test("sanity check ip parsing #1", () => {
  const output = index.ip("255.255.255.255", true);
  expect(output).toEqual("255.255.255.255");
});

test("sanity check ip parsing #2", () => {
  const output = index.ip("ffff:fc00::1:1234", true);
  expect(output).toEqual("ffff:fc00::1:1234");
});

test("sanity check ip parsing #3", () => {
  const output = index.ip("foobar");
  expect(output).toEqual(null);
});

test("sanity check network parsing", () => {
  const validSubnets = require("../mockdata/subnets.mock").valid as string[];
  for (var input of validSubnets) {
    index.network(input, true);
  }
  const invalidSubnets = require("../mockdata/subnets.mock").invalid as string[];
  for (var input of invalidSubnets) {
    expect(index.network(input, false)).toEqual(null);
  }
});

test("sanity check networkComesBefore #1", () => {
  const output = index.networkComesBefore("192.168.0.0/24", "192.168.1.0/24", true, true);
  expect(output).toEqual(true);
});

test("sanity check networkComesBefore #2", () => {
  const output = index.networkComesBefore("192.168.1.0/24", "192.168.0.0/24", true, true);
  expect(output).toEqual(false);
});

test("sanity check networkComesBefore #3", () => {
  const output = index.networkComesBefore("192.168.0.0/23", "192.168.0.0/24", true, true);
  expect(output).toEqual(true);
});

test("sanity check networkComesBefore #4", () => {
  const output = index.networkComesBefore("192.168.0.0/24", "192.168.0.0/23", true, true);
  expect(output).toEqual(false);
});

test("sanity check networkComesBefore #5", () => {
  const output = index.networkComesBefore("foobar", "192.168.0.0/23");
  expect(output).toEqual(null);
});

test("sanity check networkComesBefore #6", () => {
  const output = index.networkComesBefore("192.168.0.0/24", "foobar");
  expect(output).toEqual(null);
});

test("sanity check networkContainsAddress #1", () => {
  const output = index.networkContainsAddress("192.168.0.0/24", "192.168.0.100", true, true);
  expect(output).toEqual(true);
});

test("sanity check networkContainsAddress #2", () => {
  const output = index.networkContainsAddress("foobar", "192.168.0.100");
  expect(output).toEqual(null);
});

test("sanity check networkContainsAddress #3", () => {
  const output = index.networkContainsAddress("192.168.0.0/24", "foobar");
  expect(output).toEqual(null);
});

test("sanity check networkContainsSubnet #1", () => {
  const output = index.networkContainsSubnet("192.168.0.0/16", "192.168.0.0/24", true, true);
  expect(output).toEqual(true);
});

test("sanity check networkContainsSubnet #2", () => {
  const output = index.networkContainsSubnet("foobar", "192.168.0.0/24");
  expect(output).toEqual(null);
});

test("sanity check networkContainsSubnet #3", () => {
  const output = index.networkContainsSubnet("192.168.0.0/16", "foobar");
  expect(output).toEqual(null);
});

test("sanity check networksIntersect #1", () => {
  const output = index.networksIntersect("192.168.0.0/24", "192.168.1.0/24", true, true);
  expect(output).toEqual(false);
});

test("sanity check networksIntersect #2", () => {
  const output = index.networksIntersect("foobar", "192.168.1.0/24");
  expect(output).toEqual(null);
});

test("sanity check networksIntersect #3", () => {
  const output = index.networksIntersect("192.168.0.0/24", "foobar");
  expect(output).toEqual(null);
});

test("sanity check nextAddress #1", () => {
  const output = index.nextAddress("192.168.0.0", true);
  expect(output).toEqual("192.168.0.1");
});

test("sanity check nextAddress #2", () => {
  const output = index.nextAddress("foobar");
  expect(output).toEqual(null);
});

test("sanity check nextNetwork #1", () => {
  const output = index.nextNetwork("192.168.0.0/24", true, true);
  expect(output).toEqual("192.168.1.0/24");
});

test("sanity check nextNetwork #2", () => {
  const output = index.nextNetwork("foobar");
  expect(output).toEqual(null);
});

test("sanity check rangeOfNetworks #1", () => {
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

test("sanity check rangeOfNetworks #2", () => {
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

test("sanity check rangeOfNetworks #3", () => {
  const output = index.rangeOfNetworks("192.168.1.2", "2001:400::");
  expect(output).toEqual(null);
});

test("sanity check rangeOfNetworks #4", () => {
  const output = index.rangeOfNetworks("192.168.1.2", "192.168.1.2");
  expect(output).toEqual(["192.168.1.2/32"]);
});

test("sanity check rangeOfNetworks #5", () => {
  const output = index.rangeOfNetworks("192.168.1.6", "192.168.1.2");
  expect(output).toEqual(["192.168.1.2/31", "192.168.1.4/31", "192.168.1.6/32"]);
});

test("sanity check rangeOfNetworks #6", () => {
  const output = index.rangeOfNetworks("foobar", "192.168.1.2");
  expect(output).toEqual(null);
});

test("sanity check rangeOfNetworks #7", () => {
  const output = index.rangeOfNetworks("192.168.1.6", "foobar");
  expect(output).toEqual(null);
});

test("sanity check rangeOfNetworks #8", () => {
  const output = index.rangeOfNetworks("0.0.0.0", "255.255.255.255");
  expect(output).toEqual(["0.0.0.0/0"]);
});

test("sanity check sort #1", () => {
  const input = ["3.0.0.0", "6.0.0.0", "2.0.0.0", "7.0.0.0", "7.0.0.0", "4.0.0.0", "0.0.0.0", "6.0.0.0", "0.0.0.0"];
  const output = index.sort(input, true);
  expect(output).toEqual([
    "0.0.0.0",
    "0.0.0.0",
    "2.0.0.0",
    "3.0.0.0",
    "4.0.0.0",
    "6.0.0.0",
    "6.0.0.0",
    "7.0.0.0",
    "7.0.0.0"
  ]);
});

test("sanity check sort #2", () => {
  const input = [
    "18.208.0.0/13",
    "52.95.245.0/24",
    "52.194.0.0/15",
    "54.155.0.0/16",
    "54.196.0.0/15",
    "52.94.22.0/24",
    "52.95.255.112/28",
    "13.210.0.0/15",
    "52.94.17.0/24",
    "52.95.154.0/23",
    "251.120.15.229",
    "228.175.125.225",
    "171.117.8.80",
    "182.82.25.39",
    "174.141.91.231",
    "212.66.80.141",
    "153.145.237.150",
    "117.97.42.75",
    "125.47.180.182",
    "88.77.177.149"
  ];
  const output = index.sort(input, true);
  expect(output).toEqual([
    "13.210.0.0/15",
    "18.208.0.0/13",
    "52.94.17.0/24",
    "52.94.22.0/24",
    "52.95.154.0/23",
    "52.95.245.0/24",
    "52.95.255.112/28",
    "52.194.0.0/15",
    "54.155.0.0/16",
    "54.196.0.0/15",
    "88.77.177.149/32",
    "117.97.42.75/32",
    "125.47.180.182/32",
    "153.145.237.150/32",
    "171.117.8.80/32",
    "174.141.91.231/32",
    "182.82.25.39/32",
    "212.66.80.141/32",
    "228.175.125.225/32",
    "251.120.15.229/32"
  ]);
});

test("sanity check sort #3", () => {
  const input = [
    "3.0.0.0",
    "6.0.0.0",
    "::1",
    "2.0.0.0",
    "7.0.0.0",
    "7.0.0.0",
    "4.0.0.0",
    "0.0.0.0",
    "6.0.0.0",
    "0.0.0.0",
    "::80"
  ];
  const output = index.sort(input, true);
  expect(output).toEqual([
    "0.0.0.0",
    "0.0.0.0",
    "2.0.0.0",
    "3.0.0.0",
    "4.0.0.0",
    "6.0.0.0",
    "6.0.0.0",
    "7.0.0.0",
    "7.0.0.0",
    "::1",
    "::80"
  ]);
});

test("sanity check summarize #1", () => {
  const output = index.summarize(["192.168.0.0/16", "192.168.1.1", "192.168.2.3/31"], false, true);
  expect(output).toEqual(["192.168.0.0/16"]);
});

test("sanity check summarize #2", () => {
  const output = index.summarize(["192.168.0.0/16", "::1", "192.168.1.1", "192.168.2.3/31"], false, true);
  expect(output).toEqual(["192.168.0.0/16", "::1/128"]);
});

test("sanity check summarize #3", () => {
  const output = index.summarize(["192.168.0.0", "192.168.0.2/31", "192.168.0.3", "192.168.0.4/31"], true);
  expect(output).toEqual(["192.168.0.0/32", "192.168.0.2/31", "192.168.0.4/31"]);
});

test("sanity check summarize #4", () => {
  const output = index.summarize(["192.168.0.0/31", "192.168.0.2/31", "192.168.0.3", "192.168.0.5/32"], true);
  expect(output).toEqual(["192.168.0.0/30", "192.168.0.5/32"]);
});

test("sanity check summarize #5", () => {
  const input = [
    "10.9.201.68",
    "10.9.201.71",
    "10.9.201.70",
    "10.9.201.65",
    "10.9.201.72",
    "10.9.201.75",
    "10.9.201.67",
    "10.9.201.66",
    "10.9.201.69",
    "10.9.201.74"
  ]; // Shuffled, but effectively ranging from 10.9.201.65 to 10.9.201.72 + 10.9.201.74 + 10.9.201.75

  const output = index.summarize(input, true);
  expect(output).toBeDefined();
  expect(output).not.toContainAddresses(["192.168.0.0"]);
  expect(output).not.toContainAddresses(["10.9.201.64"]);
  expect(output).not.toContainAddresses(["10.9.201.73"]);
  expect(output).not.toContainAddresses(["10.9.201.76"]);
  expect(output).toContainAddresses(input);

  const expectedOutput = ["10.9.201.65/32", "10.9.201.66/31", "10.9.201.68/30", "10.9.201.72/32", "10.9.201.74/31"];
  expect(output).toEqual(expectedOutput);
});

// https://tools.ietf.org/html/rfc5952#section-4

test("sanity check IPv6 parsing #1", () => {
  const output = index.ip("[2001:db8::1]:80");
  expect(output).toEqual("2001:db8::1");
});

test("sanity check IPv6 parsing #2", () => {
  const output = index.ip("2001:db8::1:80");
  expect(output).toEqual("2001:db8::1:80");
});

test("sanity check IPv6 parsing #3", () => {
  const output = index.ip("2001:db8::1.80");
  expect(output).toEqual("2001:db8::1");
});

test("sanity check IPv6 parsing #4", () => {
  const output = index.ip("2001:db8::1 port 80");
  expect(output).toEqual("2001:db8::1");
});

test("sanity check IPv6 parsing #5", () => {
  const output = index.ip("2001:db8::1p80");
  expect(output).toEqual("2001:db8::1");
});

test("sanity check IPv6 parsing #6", () => {
  const output = index.ip("2001:db8::1#80");
  expect(output).toEqual("2001:db8::1");
});
