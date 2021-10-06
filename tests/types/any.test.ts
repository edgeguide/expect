import expectModule from "../../src/index";

describe("Expect package (any validation):", () => {
  it("accepts non-null various data types", () => {
    const tests = [0, 1, false, true, "test", NaN, Infinity, [], {}, Symbol()];
    tests.forEach((test) => {
      const validation = expectModule({ test: "any" }, { test });
      expect(validation.isValid).toBe(true);
    });
  });

  it("rejects null data types", () => {
    const tests = [null, undefined, ""];
    tests.forEach((test) => {
      const validation = expectModule({ test: "any" }, { test });
      expect(validation.isValid).toBe(false);
    });
  });

  it("parse function can be used with any", () => {
    const validation = expectModule(
      { test: { type: "any", parse: (test) => JSON.stringify(test) } },
      { test: 123 }
    );
    expect(validation.getParsed()).toEqual({ test: "123" });
  });

  it("allowNull checks value after parse", () =>
    expect(
      expectModule(
        { test: { type: "any", parse: () => null, allowNull: false } },
        { test: 123 }
      ).isValid
    ).toBe(false));
});
