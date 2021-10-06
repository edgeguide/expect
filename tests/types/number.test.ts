import expectModule from "../../src/index";

describe("Expect package (number validation):", () => {
  [-1, 0, 1, Infinity, -Infinity].forEach((test) =>
    it(`accepts ${test}`, () => {
      const validation = expectModule({ test: "number" }, { test });
      expect(validation.isValid).toBe(true);
    })
  );

  it("rejects NaN", () => {
    const validation = expectModule({ test: "number" }, { test: NaN });
    expect(validation.isValid).toBe(false);
  });

  [null, undefined, true, false, "", [], {}, Symbol()].forEach((test) =>
    it(`rejects ${
      typeof test === "symbol" ? test.toString() : String(test)
    }`, () => {
      const validation = expectModule({ test: "number" }, { test });
      expect(validation.isValid).toBe(false);
    })
  );

  it("parse number type", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: 1 }
    );
    expect(validation.getParsed()).toEqual({ test: 1 });
  });

  it("parse octal integer", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: 0o123 }
    );
    expect(validation.getParsed()).toEqual({ test: 83 });
  });

  it("parse string octal integer", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "0o123" }
    );
    expect(validation.getParsed()).toEqual({ test: 83 });
  });

  ["", null, undefined, true, NaN, [], {}, Symbol()].forEach((test) =>
    it(`reject parse ${
      typeof test === "symbol" ? test.toString() : String(test)
    }`, () => {
      const validation = expectModule(
        { test: { type: "number", parse: true } },
        { test }
      );
      expect(validation.isValid).toBe(false);
      expect(validation.getParsed()).toEqual({});
    })
  );

  it("trim leading zeros if not valid octal integer", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "0123" }
    );
    expect(validation.getParsed()).toEqual({ test: 123 });
  });

  it("parse string exponential number", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "-1.23e-10" }
    );
    expect(validation.getParsed()).toEqual({ test: -1.23e-10 });
  });

  it('parse "Infinity" as Infinity', () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "Infinity" }
    );
    expect(validation.getParsed()).toEqual({ test: Infinity });
  });

  it('parse "-Infinity" as -Infinity', () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "-Infinity" }
    );
    expect(validation.getParsed()).toEqual({ test: -Infinity });
  });

  it("parse explicitly positive string number", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "+123" }
    );
    expect(validation.getParsed()).toEqual({ test: 123 });
  });

  it("parse negative string number", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "-123" }
    );
    expect(validation.getParsed()).toEqual({ test: -123 });
  });

  it('parse "-0" as -0', () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "-0" }
    );
    expect(validation.getParsed()).toEqual({ test: -0 });
  });

  it("parse hexadecimal string starting with 0x", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "0x1" }
    );
    expect(validation.getParsed()).toEqual({ test: 1 });
  });

  it("parse hexadecimal string starting with 0X", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "0X1" }
    );
    expect(validation.getParsed()).toEqual({ test: 1 });
  });

  it("parse string number", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "12300001" }
    );
    expect(validation.getParsed()).toEqual({ test: 12300001 });
  });

  it("parse string decimal number", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "1230.0001" }
    );
    expect(validation.getParsed()).toEqual({ test: 1230.0001 });
  });

  it("reject parsing string number with multiple decimals", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "1.2.3" }
    );
    expect(validation.isValid).toBe(false);
  });

  it("reject parsing string with non-alphanumeric characters", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "123~4" }
    );
    expect(validation.isValid).toBe(false);
  });

  it("reject hexadecimal string not starting with 0x or 0X", () => {
    const validation = expectModule(
      { test: { type: "number", parse: true } },
      { test: "123a" }
    );
    expect(validation.isValid).toBe(false);
  });

  it("does not mutate the input value when parsing", () => {
    const testObject = { test: "1337" };
    expectModule({ test: { type: "number", parse: true } }, testObject);
    expect(testObject.test).toEqual(testObject.test);
  });

  it("returns the initial value if not parsing", () => {
    const validation = expectModule({ test: "number" }, { test: 1337 });
    expect(validation.getParsed()).toEqual({ test: 1337 });
  });

  it("parse using a function", () => {
    const validation = expectModule(
      {
        test: {
          type: "number",
          parse: (test) => (typeof test === "number" ? test : 0),
        },
      },
      { test: "invalid" }
    );
    expect(validation.isValid).toBe(true);
  });

  it("fallback on initial value if parse function throws error", () => {
    const validationFunc = () =>
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
    expect(validationFunc).not.toThrow();
    expect(validationFunc().isValid).toBe(true);
  });
});
