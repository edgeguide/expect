import expectModule from "../../src/index";

describe("Expect package (any validation):", () => {
  it("accepts non-null various data types", () => {
    const tests = [0, 1, false, true, "test", NaN, Infinity, [], {}, Symbol()];
    tests.forEach((test) => {
      const expectations = expectModule({ test: "any" }, { test });
      expect(expectations.wereMet()).toBe(true);
    });
  });

  it("rejects null data types", () => {
    const tests = [null, undefined, ""];
    tests.forEach((test) => {
      const expectations = expectModule({ test: "any" }, { test });
      expect(expectations.wereMet()).toBe(false);
    });
  });

  it("parse function can be used with any", () => {
    const expectations = expectModule(
      { test: { type: "any", parse: (test) => JSON.stringify(test) } },
      { test: 123 }
    );
    expect(expectations.getParsed()).toEqual({ test: "123" });
  });

  it("allowNull checks value after parse", () =>
    expect(
      expectModule(
        { test: { type: "any", parse: () => null, allowNull: false } },
        { test: 123 }
      ).wereMet()
    ).toBe(false));
});
