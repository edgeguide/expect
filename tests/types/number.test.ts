import expectModule = require("../../src");

describe("Expect package (number validation):", () => {
  [-1, 0, 1, Infinity, -Infinity].forEach((test) =>
    it(`accepts ${test}`, () => {
      const expectations = expectModule({ test: "number" }, { test });
      expect(expectations.wereMet()).toBe(true);
    })
  );

  it("rejects NaN", () => {
    const expectations = expectModule({ test: "number" }, { test: NaN });
    expect(expectations.wereMet()).toBe(false);
  });

  [null, undefined, true, false, "", [], {}, Symbol()].forEach((test) =>
    it(`rejects ${typeof test === "symbol" ? test.toString() : test}`, () => {
      const expectations = expectModule({ test: "number" }, { test });
      expect(expectations.wereMet()).toBe(false);
    })
  );

  it("parse number type", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: 1 }
    );
    expect(expectations.getParsed()).toEqual({ test: 1 });
  });

  it("parse octal integer", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: 0o123 }
    );
    expect(expectations.getParsed()).toEqual({ test: 83 });
  });

  it("parse string octal integer", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "0o123" }
    );
    expect(expectations.getParsed()).toEqual({ test: 83 });
  });

  ["", null, undefined, true, NaN, [], {}, Symbol()].forEach((test) =>
    it(`reject parse ${
      typeof test === "symbol" ? test.toString() : test
    }`, () => {
      const expectations = expectModule(
        { test: { type: "number", parse: true } },
        { test }
      );
      expect(expectations.wereMet()).toBe(false);
      expect(expectations.getParsed()).toEqual({});
    })
  );

  it("trim leading zeros if not valid octal integer", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "0123" }
    );
    expect(expectations.getParsed()).toEqual({ test: 123 });
  });

  it("parse string exponential number", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "-1.23e-10" }
    );
    expect(expectations.getParsed()).toEqual({ test: -1.23e-10 });
  });

  it('parse "Infinity" as Infinity', () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "Infinity" }
    );
    expect(expectations.getParsed()).toEqual({ test: Infinity });
  });

  it('parse "-Infinity" as -Infinity', () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "-Infinity" }
    );
    expect(expectations.getParsed()).toEqual({ test: -Infinity });
  });

  it("parse explicitly positive string number", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "+123" }
    );
    expect(expectations.getParsed()).toEqual({ test: 123 });
  });

  it("parse negative string number", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "-123" }
    );
    expect(expectations.getParsed()).toEqual({ test: -123 });
  });

  it('parse "-0" as -0', () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "-0" }
    );
    expect(expectations.getParsed()).toEqual({ test: -0 });
  });

  it("parse hexadecimal string starting with 0x", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "0x1" }
    );
    expect(expectations.getParsed()).toEqual({ test: 1 });
  });

  it("parse hexadecimal string starting with 0X", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "0X1" }
    );
    expect(expectations.getParsed()).toEqual({ test: 1 });
  });

  it("parse string number", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "12300001" }
    );
    expect(expectations.getParsed()).toEqual({ test: 12300001 });
  });

  it("parse string decimal number", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "1230.0001" }
    );
    expect(expectations.getParsed()).toEqual({ test: 1230.0001 });
  });

  it("reject parsing string number with multiple decimals", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "1.2.3" }
    );
    expect(expectations.wereMet()).toBe(false);
  });

  it("reject parsing string with non-alphanumeric characters", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "123~4" }
    );
    expect(expectations.wereMet()).toBe(false);
  });

  it("reject hexadecimal string not starting with 0x or 0X", () => {
    const expectations = expectModule(
      { test: { type: "number", parse: true } },
      { test: "123a" }
    );
    expect(expectations.wereMet()).toBe(false);
  });

  it("does not mutate the input value when parsing", () => {
    const testObject = { test: "1337" };
    expectModule({ test: { type: "number", parse: true } }, testObject);
    expect(testObject.test).toEqual(jasmine.any(String));
    expect(testObject.test).toEqual(testObject.test);
  });

  it("returns the initial value if not parsing", () => {
    const expectations = expectModule({ test: "number" }, { test: 1337 });
    expect(expectations.getParsed()).toEqual({ test: 1337 });
  });

  it("parse using a function", () => {
    const expectations = expectModule(
      {
        test: {
          type: "number",
          parse: (test) => (typeof test === "number" ? test : 0),
        },
      },
      { test: "invalid" }
    );
    expect(expectations.wereMet()).toBe(true);
  });

  it("fallback on initial value if parse function throws error", () => {
    const expectationsFunc = () =>
      expectModule(
        {
          test: {
            type: "number",
            parse: () => {
              throw new Error("fail");
            },
          },
        },
        { test: 2 }
      );
    expect(expectationsFunc).not.toThrow();
    expect(expectationsFunc().wereMet()).toBe(true);
  });
});
