import expectModule from "../../src/index";

describe("Expect package (boolean validation):", () => {
  it("accepts boolean", () => {
    const tests = [true, false];
    tests.forEach((test) => {
      const validation = expectModule({ test: "boolean" }, { test });
      expect(validation.isValid).toBe(true);
    });
  });

  it("rejects other data types", () => {
    const tests = [null, undefined, 1, NaN, Infinity, "", [], {}, Symbol()];
    tests.forEach((test) => {
      const validation = expectModule({ test: "boolean" }, { test });
      expect(validation.isValid).toBe(false);
    });
  });

  it("parse boolean type", () => {
    const validation = expectModule(
      { test: { type: "boolean", parse: true } },
      { test: true }
    );
    expect(validation.getParsed()).toEqual({ test: true });
  });

  it("parse falsy values as false", () => {
    const tests = [0, NaN, undefined, null, false];
    tests.forEach((test) => {
      const validation = expectModule(
        { test: { type: "boolean", parse: true, allowNull: true } },
        { test }
      );
      expect(validation.getParsed()).toEqual({ test: false });
    });
  });

  it("parse JSON.parsed() falsy values as false", () => {
    const tests = ["0", "null", "false"];
    tests.forEach((test) => {
      const validation = expectModule(
        { test: { type: "boolean", parse: true } },
        { test }
      );
      expect(validation.getParsed()).toEqual({ test: false });
    });
  });

  it('parse "undefined" and "NaN" as false', () => {
    const tests = ["undefined", "NaN"];
    tests.forEach((test) => {
      const validation = expectModule(
        { test: { type: "boolean", parse: true } },
        { test }
      );
      expect(validation.getParsed()).toEqual({ test: false });
    });
  });

  it("parses the actual value if the parse option is specified", () => {
    const validation = expectModule(
      {
        test: { type: "boolean", parse: true },
      },
      { test: "true" }
    );

    expect(validation.isValid).toBe(true);
  });

  it("does not mutate the input value when parsing", () => {
    const testObject = { test: "true" };
    expectModule({ test: { type: "boolean", parse: true } }, testObject);
    expect(testObject.test).toEqual("true");
  });

  it("correctly returns the parsed value", () => {
    const testObject = { test: "true" };
    const validation = expectModule(
      { test: { type: "boolean", parse: true } },
      testObject
    );

    expect(validation.getParsed()).toEqual({ test: true });
  });

  it("correctly returns the parsed false value", () => {
    const testObject = { test: "false" };
    const validation = expectModule(
      { test: { type: "boolean", parse: true } },
      testObject
    );

    expect(validation.getParsed()).toEqual({ test: false });
  });

  it("returns the initial if no parsing is specified", () => {
    const validation = expectModule({ test: "boolean" }, { test: true });

    expect(validation.getParsed()).toEqual({ test: true });
  });

  it("does not destroy correct values when parsing", () => {
    const validation = expectModule(
      { test: { type: "boolean", parse: true } },
      { test: true }
    );

    expect(validation.getParsed()).toEqual({ test: true });
  });

  it("handles exceptions when parsing non-JSON values", () => {
    const validation = expectModule(
      { test: { type: "boolean", allowNull: true, parse: true } },
      { test: undefined }
    );

    expect(validation.isValid).toBe(true);
    expect(validation.getParsed()).toEqual({ test: false });
  });
});
