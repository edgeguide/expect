import expectModule from "../../src/index";

describe("Expect package (boolean validation):", () => {
  it("accepts boolean", () => {
    const tests = [true, false];
    tests.forEach((test) => {
      const expectations = expectModule({ test: "boolean" }, { test });
      expect(expectations.wereMet()).toBe(true);
    });
  });

  it("rejects other data types", () => {
    const tests = [null, undefined, 1, NaN, Infinity, "", [], {}, Symbol()];
    tests.forEach((test) => {
      const expectations = expectModule({ test: "boolean" }, { test });
      expect(expectations.wereMet()).toBe(false);
    });
  });

  it("parse boolean type", () => {
    const expectations = expectModule(
      { test: { type: "boolean", parse: true } },
      { test: true }
    );
    expect(expectations.getParsed()).toEqual({ test: true });
  });

  it("parse falsy values as false", () => {
    const tests = [0, NaN, undefined, null, false];
    tests.forEach((test) => {
      const expectations = expectModule(
        { test: { type: "boolean", parse: true, allowNull: true } },
        { test }
      );
      expect(expectations.getParsed()).toEqual({ test: false });
    });
  });

  it("parse JSON.parsed() falsy values as false", () => {
    const tests = ["0", "null", "false"];
    tests.forEach((test) => {
      const expectations = expectModule(
        { test: { type: "boolean", parse: true } },
        { test }
      );
      expect(expectations.getParsed()).toEqual({ test: false });
    });
  });

  it('parse "undefined" and "NaN" as false', () => {
    const tests = ["undefined", "NaN"];
    tests.forEach((test) => {
      const expectations = expectModule(
        { test: { type: "boolean", parse: true } },
        { test }
      );
      expect(expectations.getParsed()).toEqual({ test: false });
    });
  });

  it("parses the actual value if the parse option is specified", () => {
    const expectations = expectModule(
      {
        test: { type: "boolean", parse: true },
      },
      { test: "true" }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it("does not mutate the input value when parsing", () => {
    const testObject = { test: "true" };
    expectModule({ test: { type: "boolean", parse: true } }, testObject);

    expect(testObject.test).toEqual(jasmine.any(String));
    expect(testObject.test).toEqual("true");
  });

  it("correctly returns the parsed value", () => {
    const testObject = { test: "true" };
    const expectations = expectModule(
      { test: { type: "boolean", parse: true } },
      testObject
    );

    expect(expectations.getParsed()).toEqual({ test: true });
  });

  it("correctly returns the parsed false value", () => {
    const testObject = { test: "false" };
    const expectations = expectModule(
      { test: { type: "boolean", parse: true } },
      testObject
    );

    expect(expectations.getParsed()).toEqual({ test: false });
  });

  it("returns the initial if no parsing is specified", () => {
    const expectations = expectModule({ test: "boolean" }, { test: true });

    expect(expectations.getParsed()).toEqual({ test: true });
  });

  it("does not destroy correct values when parsing", () => {
    const expectations = expectModule(
      { test: { type: "boolean", parse: true } },
      { test: true }
    );

    expect(expectations.getParsed()).toEqual({ test: true });
  });

  it("handles exceptions when parsing non-JSON values", () => {
    const expectations = expectModule(
      { test: { type: "boolean", allowNull: true, parse: true } },
      { test: undefined }
    );

    expect(expectations.wereMet()).toBe(true);
    expect(expectations.getParsed()).toEqual({ test: false });
  });
});
