import expectModule from "../../src/index";

describe("Expect package (date validation):", () => {
  it("accepts date", () => {
    const expectations = expectModule({ test: "date" }, { test: new Date() });

    expect(expectations.wereMet()).toBe(true);
  });

  it("accepts string date", () => {
    const expectations = expectModule(
      { test: "date" },
      { test: "2017-01-01 23:59:59" }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it("rejects other data types", () => {
    const tests = [null, undefined, true, 1, NaN, Infinity, [], {}, Symbol()];
    tests.forEach((test) => {
      const expectations = expectModule({ test: "date" }, { test });
      expect(expectations.wereMet()).toBe(false);
    });
  });

  it("rejects incorrectly formatted string", () => {
    const expectations = expectModule(
      { test: "date" },
      { test: "2017-01ab-01 23:59:59" }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it("rejects incorrectly formatted string with parse", () => {
    const expectations = expectModule(
      { test: { type: "date", parse: true } },
      { test: "2017-01ab-01 23:59:59" }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it("parse string date", () => {
    const expectations = expectModule(
      { test: { type: "date", parse: true } },
      { test: "2017-01-01" }
    );

    expect(expectations.getParsed()).toEqual({ test: new Date("2017-01-01") });
  });

  it("does not mutate the input value when parsing", () => {
    const testObject = { test: new Date() };
    expectModule({ test: { type: "date", parse: true } }, testObject);
    expect(testObject.test).toEqual(testObject.test);
  });

  it("does not destroy correct values when parsing", () => {
    const testObject = { test: new Date() };
    const expectations = expectModule(
      { test: { type: "date", parse: true } },
      testObject
    );

    expect(expectations.getParsed()).toEqual(testObject);
  });
});
