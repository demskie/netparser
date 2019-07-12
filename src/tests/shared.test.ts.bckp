import * as shared from "../shared";

test("sanity check setAddress #1", () => {
  shared.setAddress(new Uint8Array(4), new Uint8Array(16));
});

test("sanity check setAddress #2", () => {
  shared.setAddress(new Uint8Array(16), new Uint8Array(4));
});

test("sanity check compareAddresses #1", () => {
  const output = shared.compareAddresses(new Uint8Array(4), new Uint8Array(16));
  expect(output).toEqual(shared.Pos.before);
});

test("sanity check compareAddresses #2", () => {
  const output = shared.compareAddresses(new Uint8Array(16), new Uint8Array(4));
  expect(output).toEqual(shared.Pos.after);
});

test("sanity check increaseAddressWithCIDR #1", () => {
  const output = shared.increaseAddressWithCIDR(new Uint8Array([255, 255, 255, 255]), 32);
  expect(output).toEqual(null);
});

test("sanity check decreaseAddressWithCIDR #1", () => {
  const output = shared.decreaseAddressWithCIDR(new Uint8Array([0, 0, 0, 0]), 32);
  expect(output).toEqual(null);
});

test("sanity check parseAddressString #1", () => {
  const output = shared.parseAddressString("foobar");
  expect(output).toEqual(null);
});
