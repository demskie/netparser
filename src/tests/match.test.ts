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
  expect(matcher.has("192.168.0.254")).toEqual(false);
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
  expect(matcher.has("192.168.0.254")).toEqual(true);
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
  expect(matcher.has("192.168.0.254")).toEqual(true);
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
  expect(matcher.has("foobar")).toEqual(false);
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
  expect(matcher.has("192.168.0.255")).toEqual(true);
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
  expect(matcher.has("192.168.0.25")).toEqual(false);
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
  expect(matcher.has("192.168.0.0")).toEqual(false);
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
  expect(matcher.has("192.168.0.124/32")).toEqual(true);
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
  expect(matcher.has("192.168.0.255")).toEqual(true);
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
  expect(matcher.has("192.168.0.255")).toEqual(true);
});

test("sanity check Matcher #10", () => {
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
  expect(matcher.get("192.168.0.255")).toEqual("192.168.0.254/31");
});

test("sanity check Matcher #11", () => {
  const input = [
    "192.168.0.0/16",
    "192.168.0.0/24",
    "192.168.1.0/24",
    "192.168.2.0/24",
    "192.168.3.0/24"
  ];
  const matcher = new match.Matcher();
  input.forEach((s: string) => {
    matcher.add(s);
  });
  expect(matcher.get("192.168.0.0")).toEqual("192.168.0.0/24");
});

test("sanity check Matcher #12", () => {
  const input = [
    "192.168.0.0/16",
    "192.168.0.0/24",
    "192.168.1.0/24",
    "192.168.2.0/24",
    "192.168.3.0/24"
  ];
  const matcher = new match.Matcher();
  input.forEach((s: string) => {
    matcher.add(s);
  });
  expect(matcher.get("192.168.1.128")).toEqual("192.168.1.0/24");
});