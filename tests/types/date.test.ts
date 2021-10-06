import expectModule from "../../src/index";

describe("Expect package (date validation):", () => {
  it("accepts date", () => {
    const validation = expectModule({ test: "date" }, { test: new Date() });

    expect(validation.isValid).toBe(true);
  });

  it("accepts string date", () => {
    const validation = expectModule(
      { test: "date" },
      { test: "2017-01-01 23:59:59" }
    );

    expect(validation.isValid).toBe(true);
  });

  it("rejects other data types", () => {
    const tests = [null, undefined, true, 1, NaN, Infinity, [], {}, Symbol()];
    tests.forEach((test) => {
      const validation = expectModule({ test: "date" }, { test });
      expect(validation.isValid).toBe(false);
    });
  });

  it("rejects incorrectly formatted string", () => {
    const validation = expectModule(
      { test: "date" },
      { test: "2017-01ab-01 23:59:59" }
    );

    expect(validation.isValid).toBe(false);
  });

  it("rejects incorrectly formatted string with parse", () => {
    const validation = expectModule(
      { test: { type: "date", parse: true } },
      { test: "2017-01ab-01 23:59:59" }
    );

    expect(validation.isValid).toBe(false);
  });

  it("parse string date", () => {
    const validation = expectModule(
      { test: { type: "date", parse: true } },
      { test: "2017-01-01" }
    );

    expect(validation.getParsed()).toEqual({ test: new Date("2017-01-01") });
  });

  it("does not mutate the input value when parsing", () => {
    const testObject = { test: new Date() };
    expectModule({ test: { type: "date", parse: true } }, testObject);
    expect(testObject.test).toEqual(testObject.test);
  });

  it("does not destroy correct values when parsing", () => {
    const testObject = { test: new Date() };
    const validation = expectModule(
      { test: { type: "date", parse: true } },
      testObject
    );

    expect(validation.getParsed()).toEqual(testObject);
  });
});
