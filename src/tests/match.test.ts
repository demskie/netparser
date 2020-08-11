import * as match from "../match";

test("sanity check Matcher #1", () => {
  const input = [
    "192.168.0.0/32",
    "192.168.0.3/32",
    "192.168.0.24/32",
    "192.168.0.52/32",
    "192.168.0.123/32",
    "192.168.0.124/32",
    "192.168.0.125/32",
    "192.168.0.170/32",
    "192.168.0.171/32",
    "192.168.0.222/32",
    "192.168.0.234/32",
    "192.168.0.255/32"
  ];
  const matcher = new match.Matcher(input);
  expect(matcher.has("192.168.0.254")).toEqual(null);
});

test("sanity check Matcher #2", () => {
  const input = [
    "192.168.0.0/24",
    "192.168.0.3/32",
    "192.168.0.24/32",
    "192.168.0.52/32",
    "192.168.0.123/32",
    "192.168.0.124/32",
    "192.168.0.125/32",
    "192.168.0.170/32",
    "192.168.0.171/32",
    "192.168.0.222/32",
    "192.168.0.234/32",
    "192.168.0.255/32"
  ];
  const matcher = new match.Matcher(input);
  expect(matcher.has("192.168.0.254")).toEqual({
    addr: { arr: [192, 168, 0, 0] },
    netbits: 24,
    network: "192.168.0.0/24"
  });
});

test("sanity check Matcher #3", () => {
  const input = [
    "192.168.0.0/24",
    "192.168.0.3/32",
    "192.168.0.24/32",
    "192.168.0.52/32",
    "foobar",
    "192.168.0.124/32",
    "192.168.0.125/32",
    "192.168.0.170/32",
    "192.168.0.171/32",
    "192.168.0.222/32",
    "192.168.0.234/32",
    "192.168.0.255/32"
  ];
  const matcher = new match.Matcher(input);
  expect(matcher.has("192.168.0.254")).toEqual({
    addr: { arr: [192, 168, 0, 0] },
    netbits: 24,
    network: "192.168.0.0/24"
  });
});

test("sanity check Matcher #4", () => {
  const input = [
    "192.168.0.0/24",
    "192.168.0.3/32",
    "192.168.0.24/32",
    "192.168.0.52/32",
    "192.168.0.123/32",
    "192.168.0.124/32",
    "192.168.0.125/32",
    "192.168.0.170/32",
    "192.168.0.171/32",
    "192.168.0.222/32",
    "192.168.0.234/32",
    "192.168.0.255/32"
  ];
  const matcher = new match.Matcher(input);
  expect(matcher.has("foobar")).toEqual(null);
});

test("sanity check Matcher #5", () => {
  const input = [
    "192.168.0.0/32",
    "192.168.0.3/32",
    "192.168.0.24/32",
    "192.168.0.52/32",
    "192.168.0.123/32",
    "192.168.0.124/32",
    "192.168.0.125/32",
    "192.168.0.170/32",
    "192.168.0.171/32",
    "192.168.0.222/32",
    "192.168.0.234/32",
    "192.168.0.255/32"
  ];
  const matcher = new match.Matcher(input);
  expect(matcher.has("192.168.0.255")).toEqual({
    addr: { arr: [192, 168, 0, 255] },
    netbits: 32,
    network: "192.168.0.255/32"
  });
});

test("sanity check Matcher #6", () => {
  const input = [
    "192.168.0.0/32",
    "192.168.0.3/32",
    "192.168.0.24/32",
    "192.168.0.52/32",
    "192.168.0.123/32",
    "192.168.0.124/32",
    "192.168.0.125/32",
    "192.168.0.170/32",
    "192.168.0.171/32",
    "192.168.0.222/32",
    "192.168.0.234/32",
    "192.168.0.254/31"
  ];
  const matcher = new match.Matcher(input);
  expect(matcher.has("192.168.0.25")).toEqual(null);
});

test("sanity check Matcher #6", () => {
  const input = [
    "192.168.0.2/32",
    "192.168.0.3/32",
    "192.168.0.24/32",
    "192.168.0.52/32",
    "192.168.0.123/32",
    "192.168.0.124/32",
    "192.168.0.125/32",
    "192.168.0.170/32",
    "192.168.0.171/32",
    "192.168.0.222/32",
    "192.168.0.234/32",
    "192.168.0.254/32"
  ];

  const matcher = new match.Matcher(input);
  expect(matcher.has("192.168.0.0")).toEqual(null);
});

test("sanity check Matcher #7", () => {
  const input = [
    "192.168.0.0/32",
    "192.168.0.3/32",
    "192.168.0.24/32",
    "192.168.0.52/32",
    "192.168.0.123/32",
    "192.168.0.124/32",
    "192.168.0.125/32",
    "192.168.0.170/32",
    "192.168.0.171/32",
    "192.168.0.222/32",
    "192.168.0.234/32",
    "192.168.0.254/32"
  ];
  const matcher = new match.Matcher(input);
  expect(matcher.has("192.168.0.124/32")).toEqual({
    addr: { arr: [192, 168, 0, 123] },
    netbits: 31,
    network: "192.168.0.123/32"
  });
});

test("sanity check Matcher #8", () => {
  const input = [
    "192.168.0.0/32",
    "192.168.0.3/32",
    "192.168.0.24/32",
    "192.168.0.52/32",
    "192.168.0.123/32",
    "192.168.0.124/32",
    "192.168.0.125/32",
    "192.168.0.170/32",
    "192.168.0.171/32",
    "192.168.0.222/32",
    "192.168.0.234/32",
    "192.168.0.254/31"
  ];
  const matcher = new match.Matcher(input);
  expect(matcher.has("192.168.0.255")).toEqual({
    addr: { arr: [192, 168, 0, 254] },
    netbits: 31,
    network: "192.168.0.254/31"
  });
});

test("sanity check Matcher #9", () => {
  const input = [
    "192.168.0.24/32",
    "192.168.0.52/32",
    "192.168.0.171/32",
    "192.168.0.222/32",
    "192.168.0.124/32",
    "192.168.0.123/32",
    "192.168.0.234/32",
    "192.168.0.254/31",
    "192.168.0.0/32",
    "192.168.0.3/32",
    "192.168.0.170/32",
    "192.168.0.125/32"
  ];
  const matcher = new match.Matcher();
  input.forEach((s: string) => {
    matcher.add(s);
  });
  expect(matcher.has("192.168.0.255")).toEqual({
    addr: { arr: [192, 168, 0, 254] },
    netbits: 31,
    network: "192.168.0.254/31"
  });
});
