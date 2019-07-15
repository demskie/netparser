import { Address } from "../address";

test("sanity check bytes #1", () => {
  const output = new Address("192.168.0.0").bytes();
  expect(output).toEqual([192, 168, 0, 0]);
});

test("sanity check bytes #2", () => {
  const output = new Address();
  expect(output.bytes()).toEqual([]);
});

test("sanity check setBytes #1", () => {
  const output = new Address().setBytes([192, 168, 0, 4]);
  expect(`${output}`).toEqual("192.168.0.4");
});

test("sanity check setBytes #2", () => {
  const output = new Address().setBytes([0, 2]);
  expect(`${output}`).toEqual("");
});

test("sanity check destroy #1", () => {
  const output = new Address("192.168.0.0");
  expect(`${output.destroy()}`).toEqual("");
});

test("sanity check toNetwork #1", () => {
  const output = new Address("192.168.0.5");
  expect(`${output.toNetwork()}`).toEqual("192.168.0.5/32");
});

test("sanity check increase #1", () => {
  const output = new Address("192.168.0.5");
  expect(`${output.increase(31)}`).toEqual("192.168.0.7");
});

test("sanity check decrease #1", () => {
  const output = new Address("192.168.0.5");
  expect(`${output.decrease(31)}`).toEqual("192.168.0.3");
});

test("sanity check next #1", () => {
  const output = new Address("192.168.0.5");
  expect(`${output.next()}`).toEqual("192.168.0.6");
});

test("sanity check previous #1", () => {
  const output = new Address("192.168.0.5");
  expect(`${output.previous()}`).toEqual("192.168.0.4");
});
