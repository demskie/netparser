import * as shared from "../shared";

test("sanity check getCIDR #1", () => {
  const output = shared.getCIDR("192.168.0.0/128");
  expect(output).toEqual(null);
});

test("sanity check getCIDR #2", () => {
  const output = shared.getCIDR("192.168.0.0/24abc");
  expect(output).toEqual(null);
});

test("sanity check getCIDR #3", () => {
  const output = shared.getCIDR("192.168.0.0/24");
  expect(output).toEqual(24);
});

test("sanity check parseBaseNetwork #1", () => {
  const output = shared.parseBaseNetwork("192.168.0.4/24", true);
  expect(output).toEqual(null);
});

test("sanity check parseBaseNetwork #2", () => {
  const output = shared.parseBaseNetwork("192.168.0.4/24", false);
  expect(output.toString()).toEqual("192.168.0.0/24");
});
