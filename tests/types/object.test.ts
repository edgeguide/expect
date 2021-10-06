import expectModule from "../../src/index";

describe("Expect package (object validation):", () => {
  it("tests for object type correctly", () => {
    const validation = expectModule({ test: "object" }, { test: {} });

    expect(validation.isValid).toBe(true);
  });

  [null, undefined, [], 1].forEach((test) =>
    it(`rejects ${String(test)}`, () => {
      const validation = expectModule({ test: "object" }, { test });

      expect(validation.isValid).toBe(false);
    })
  );

  it("validates object keys if given the keys option", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          allowNullErrorCode: "missing",
          errorCode: "error",
          keys: {
            bar: { type: "number", errorCode: "invalid type" },
            fest: "string",
          },
        },
      },
      { foo: { bar: "testest", fest: "festfest" } }
    );

    expect(validation.errors()).toEqual({ foo: { bar: "invalid type" } });
  });

  it("validates nested objects with the keys option", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          allowNullErrorCode: "missing",
          errorCode: "error",
          keys: {
            dead: {
              type: "object",
              keys: { beef: "number" },
            },
            bar: "string",
          },
        },
      },
      {
        foo: {
          dead: { beef: "fail" },
          bar: "festfest",
        },
      }
    );

    expect(validation.errors()).toEqual({
      foo: {
        dead: {
          beef: 'Expected parameter foo.dead.beef to be of type number but it was "fail"',
        },
      },
    });
  });

  it("validates nested objects with errors on several levels", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          allowNullErrorCode: "missing",
          errorCode: "error",
          keys: {
            dead: {
              type: "object",
              keys: {
                beef: "number",
              },
            },
            bar: "string",
            bizz: "number",
          },
        },
      },
      {
        foo: {
          dead: {
            beef: "fail",
          },
          bar: "festfest",
          bizz: "1a",
        },
      }
    );

    expect(validation.errors()).toEqual({
      foo: {
        bizz: 'Expected parameter foo.bizz to be of type number but it was "1a"',
        dead: {
          beef: 'Expected parameter foo.dead.beef to be of type number but it was "fail"',
        },
      },
    });
  });

  it("validates an array with objects", () => {
    const validation = expectModule(
      {
        foo: {
          type: "array",
          allowNullErrorCode: "missing",
          items: {
            type: "object",
            keys: {
              dead: "string",
              beef: "number",
            },
          },
        },
      },
      {
        foo: [
          {
            dead: "fed",
            beef: 1,
          },
          {
            dead: "fed",
            beef: 2,
          },
          {
            dead: "fed",
            beef: 3,
          },
          {
            dead: "fed",
            beef: 4,
          },
          {
            dead: "fed",
            beef: 5,
          },
        ],
      }
    );

    expect(validation.isValid).toBe(true);
  });

  it("validates an array with objects where one is incorrect", () => {
    const validation = expectModule(
      {
        foo: {
          type: "array",
          allowNullErrorCode: "missing",
          items: {
            type: "object",
            keys: {
              dead: "string",
              beef: "number",
            },
          },
        },
      },
      {
        foo: [
          { dead: "fed", beef: 1 },
          { dead: "fed", beef: 2 },
          { dead: "fed", beef: "hello" },
          { dead: "fed", beef: 4 },
          { dead: "fed", beef: 5 },
        ],
      }
    );

    expect(validation.isValid).toBe(false);
  });

  it("prints out an error when validation an array with objects where one is incorrect", () => {
    const validation = expectModule(
      {
        foo: {
          type: "array",
          allowNullErrorCode: "missing",
          items: {
            type: "object",
            keys: { dead: "string", beef: "number" },
          },
        },
      },
      {
        foo: [
          { dead: "fed", beef: 1 },
          { dead: "fed", beef: 2 },
          { dead: "fed", beef: "hello" },
          { dead: "fed", beef: 4 },
          { dead: "fed", beef: 5 },
        ],
      }
    );

    expect(validation.errors()).toEqual({
      foo: {
        2: {
          beef: 'Expected parameter foo.2.beef to be of type number but it was "hello"',
        },
      },
    });
  });

  it("detects null for nested objects", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          allowNullErrorCode: "missing",
          errorCode: "error",
          keys: {
            dead: {
              type: "object",
              keys: { beef: "number" },
            },
            bar: "string",
          },
        },
      },
      { foo: { dead: { beef: null }, bar: "festfest" } }
    );

    expect(validation.errors()).toEqual({
      foo: {
        dead: {
          beef: "Expected parameter foo.dead.beef to be of type number but it was null",
        },
      },
    });
  });

  it("allows null for nested objects", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          allowNullErrorCode: "missing",
          errorCode: "error",
          keys: {
            dead: {
              type: "object",
              keys: { beef: { type: "number", allowNull: true } },
            },
            bar: "string",
          },
        },
      },
      {
        foo: {
          dead: { beef: null },
          bar: "festfest",
        },
      }
    );

    expect(validation.errors()).toEqual({});
  });

  it("can parse values deep in a nested object", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          allowNullErrorCode: "missing",
          errorCode: "error",
          keys: {
            dead: {
              type: "object",
              keys: {
                beef: {
                  type: "boolean",
                  parse: true,
                },
              },
            },
            bar: "string",
          },
        },
      },
      {
        foo: {
          dead: {
            beef: "true",
          },
          bar: "festfest",
        },
      }
    );

    expect(validation.errors()).toEqual({});
  });

  it("can parse values deep in a nested object", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          allowNullErrorCode: "missing",
          errorCode: "error",
          keys: {
            dead: {
              type: "object",
              keys: {
                beef: {
                  type: "boolean",
                  parse: true,
                },
              },
            },
            bar: "string",
          },
        },
      },
      {
        foo: {
          dead: {
            beef: "true",
          },
          bar: "festfest",
        },
      }
    );

    expect(validation.errors()).toEqual({});
  });

  it("getParsed returns correct values for valid nested objects", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          keys: {
            dead: {
              type: "object",
              keys: { beef: { type: "boolean", parse: true } },
            },
            bar: { type: "number", parse: true },
            bizz: { type: "array", parse: true },
          },
        },
      },
      {
        foo: {
          dead: { beef: "true" },
          bar: "1",
          bizz: "[1, 2, 3]",
        },
      }
    );

    expect(validation.isValid).toBe(true);
    expect(validation.getParsed()).toEqual({
      foo: {
        dead: { beef: true },
        bar: 1,
        bizz: [1, 2, 3],
      },
    });
  });

  it("errors for invalid nested objects", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          keys: {
            dead: {
              type: "object",
              keys: { beef: "boolean" },
            },
            bar: { type: "string", allowNull: true },
            bizz: "array",
          },
        },
      },
      {
        foo: {
          dead: { beef: "true" },
          bar: "",
          bizz: [1, 2, 3],
        },
      }
    );

    expect(validation.isValid).toBe(false);
    expect(validation.getParsed()).toEqual({});
    expect(validation.errors()).toEqual({
      foo: {
        dead: {
          beef: 'Expected parameter foo.dead.beef to be of type boolean but it was "true"',
        },
      },
    });
  });

  it("fails if an object contains unused keys when the strictKeyCheck mode is enabled", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          strictKeyCheck: true,
          keys: {
            dead: {
              type: "object",
              keys: {
                beef: {
                  type: "boolean",
                  parse: true,
                },
              },
            },
            bar: {
              type: "number",
              parse: true,
            },
            bizz: {
              type: "array",
              parse: true,
            },
          },
        },
      },
      {
        foo: {
          dead: {
            beef: "true",
          },
          bar: "1",
          bizz: "[1,2,3,4,5]",
          buzz: "1337",
        },
      }
    );

    expect(validation.isValid).toBe(false);
    expect(validation.errors()).toEqual({
      foo: 'Object contained unchecked keys "buzz"',
    });
  });

  it("fails if a nested object contains unused keys when the strictKeyCheck mode is enabled", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          keys: {
            dead: {
              type: "object",
              strictKeyCheck: true,
              keys: { beef: { type: "boolean", parse: true } },
            },
            bar: { type: "number", parse: true },
            bizz: { type: "array", parse: true },
          },
        },
      },
      {
        foo: {
          dead: { beef: "true", well: "fed" },
          bar: "1",
          bizz: "[1,2,3,4,5]",
          buzz: "1337",
        },
      }
    );

    expect(validation.isValid).toBe(false);
    expect(validation.errors()).toEqual({
      foo: { dead: 'Object contained unchecked keys "well"' },
    });
  });

  it("passes if a nested object contains null keys when the strictKeyCheck mode is enabled", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          keys: {
            dead: {
              type: "object",
              strictKeyCheck: true,
              keys: { beef: { type: "boolean", allowNull: true, parse: true } },
            },
            bar: { type: "number", parse: true },
            bizz: { type: "array", parse: true },
          },
        },
      },
      {
        foo: {
          dead: { beef: null },
          bar: "1",
          bizz: "[1,2,3,4,5]",
          buzz: "1337",
        },
      }
    );

    expect(validation.isValid).toBe(true);
    expect(validation.errors()).toEqual({});
  });

  it("allows nested requiredIf statements ", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          keys: {
            dead: {
              type: "object",
              strictKeyCheck: true,
              keys: {
                beef: {
                  type: "boolean",
                  allowNull: true,
                  parse: true,
                },
              },
            },
          },
        },
        bar: {
          type: "number",
          parse: true,
          requiredIf: ["foo", "dead", "beef"],
        },
      },
      { foo: { dead: { beef: null } }, bar: "" }
    );

    expect(validation.isValid).toBe(true);
    expect(validation.errors()).toEqual({});
  });

  it("does not throw on null key in strictKeyCheck", () => {
    expect(() =>
      expectModule(
        {
          foo: {
            type: "array",
            items: {
              type: "object",
              keys: {
                bar: "string",
              },
              strictKeyCheck: true,
            },
          },
        },
        { foo: [null, { bar: "test" }] }
      )
    ).not.toThrow();
  });

  it("does not throw error if nested requiredIf is missing ", () => {
    expect(() =>
      expectModule(
        { test: { type: "string", requiredIf: ["foo", "dead", "beef"] } },
        {}
      )
    ).not.toThrow();
  });

  it("keys errors have higher priority than parent error", () => {
    expect(
      expectModule(
        {
          foo: {
            type: "object",
            errorCode: "foo error",
            condition: (foo) => Object.keys(foo).length > 10,
            keys: {
              bar: { type: "number", errorCode: "bar error" },
            },
          },
        },
        { foo: { bar: "123" } }
      ).errors()
    ).toEqual({ foo: { bar: "bar error" } });

    expect(
      expectModule(
        {
          foo: {
            type: "object",
            errorCode: "foo error",
            condition: (foo) => Object.keys(foo).length > 10,
            keys: {
              bar: { type: "number", errorCode: "bar error" },
            },
          },
        },
        { foo: { bar: 123 } }
      ).errors()
    ).toEqual({ foo: "foo error" });
  });

  it("fails if the __proto__ is present for an object", () => {
    const value = JSON.parse(`{
      "foo": {
        "__proto__": 1,
        "bar": "1",
        "bizz": "[1,2,3,4,5]",
        "buzz": "1337"
      }
    }`);
    const validation = expectModule(
      {
        foo: {
          type: "object",
          keys: {
            bar: { type: "number", parse: true },
            bizz: { type: "array", parse: true },
          },
        },
      },
      value
    );

    expect(validation.isValid).toBe(false);
    expect(validation.errors()).toEqual({
      foo: 'Object contained unsafe keys "__proto__"',
    });
  });

  it("fails if the __proto__ is present on a deeper level for an object", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          strictKeyCheck: true,
          keys: {
            bar: {
              type: "object",
              keys: {
                test: "string",
              },
            },
            bizz: { type: "array", parse: true },
          },
        },
      },
      JSON.parse(`{
        "foo": {
          "bar": {"__proto__": 1},
          "bizz": "[1,2,3,4,5]"
        }
      }`)
    );

    expect(validation.isValid).toBe(false);
    expect(validation.errors()).toEqual({
      foo: { bar: 'Object contained unsafe keys "__proto__"' },
    });
  });

  it("ignores undefined keys in the validation schema", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          keys: {
            bar: undefined,
            bizz: "number",
          },
        },
      },
      { foo: { bizz: 1 } }
    );

    expect(validation.isValid).toBe(true);
    expect(validation.getParsed()).toEqual({
      foo: {
        bizz: 1,
      },
    });
  });

  it("strictKeyCheck ignores undefined keys in the validation schema", () => {
    const validation = expectModule(
      {
        foo: {
          type: "object",
          strictKeyCheck: true,
          keys: {
            bar: undefined,
            bizz: "number",
          },
        },
      },
      { foo: { bizz: 1 } }
    );

    expect(validation.isValid).toBe(true);
    expect(validation.getParsed()).toEqual({
      foo: { bizz: 1 },
    });
  });
});
