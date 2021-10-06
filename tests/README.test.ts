import expectModule from "../src/index";

describe("Expect package (README examples):", () => {
  it("Options", () => {
    expect(
      expectModule(
        {
          foo: "number",
          bar: { type: "number" },
        },
        {
          foo: 123,
          bar: 321,
        }
      ).isValid
    ).toBe(true);
  });

  it("Options - allowNull", () => {
    expect(
      expectModule(
        {
          foo: { type: "string", allowNull: (foo) => foo !== "" },
          bar: { type: "number", allowNull: true },
        },
        { bar: "" }
      ).isValid
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: { type: "string", allowNull: true },
          bar: { type: "number", allowNull: (bar) => bar !== "" },
        },
        { bar: "" }
      ).isValid
    ).toBe(false);
  });

  it("Options - requiredIf", () => {
    expect(
      expectModule(
        {
          foo: { type: "string", allowNull: true },
          bar: { type: "string", requiredIf: "foo" },
        },
        {}
      ).isValid
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: { type: "string", allowNull: true },
          bar: { type: "string", requiredIf: "foo" },
        },
        { foo: "test" }
      ).isValid
    ).toBe(false);

    expect(
      expectModule(
        {
          foo: { type: "string", allowNull: true },
          bar: { type: "string", allowNull: true, requiredIf: "foo" },
        },
        { foo: "test" }
      ).isValid
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: {
            type: "object",
            keys: { buzz: { type: "string", allowNull: true } },
          },
          bar: { type: "string", requiredIf: ["foo", "buzz"] },
        },
        {
          foo: { buzz: null },
          bar: null,
        }
      ).isValid
    ).toBe(true);
  });

  it("Options - parse", () => {
    expect(
      expectModule(
        {
          test: {
            type: "number",
            parse: (test: string) => Number(test),
          },
        },
        { test: "123" }
      ).getParsed()
    ).toEqual({ test: 123 });

    const invalid = expectModule(
      { test: { type: "string", allowNull: false, parse: true } },
      { test: null }
    );
    expect(invalid.isValid).toBe(false);
    expect(invalid.getParsed()).toEqual({});

    const valid = expectModule(
      { test: { type: "string", allowNull: true, parse: true } },
      { test: null }
    );
    expect(valid.isValid).toBe(true);
    expect(valid.getParsed()).toEqual({ test: "null" });

    const alsoValid = expectModule(
      {
        test: { type: "string", allowNull: true, parse: () => null },
      },
      { test: "test" }
    );
    expect(alsoValid.isValid).toBe(true); // true
    expect(alsoValid.getParsed()).toEqual({ test: null });

    const anotherOne = expectModule(
      {
        test: { type: "string", requiredIf: "existing" },
        existing: {
          type: "string",
          allowNull: true,
          parse: () => "test",
        },
      },
      { test: null, existing: null }
    );
    expect(anotherOne.isValid).toBe(true);
    expect(anotherOne.getParsed()).toEqual({ test: null, existing: "test" });
  });

  it("Options - condition", () => {
    expect(
      expectModule(
        {
          foo: {
            type: "array",
            condition: (test: any) => test.length,
          },
        },
        { foo: [] }
      ).isValid
    ).toBe(false);

    expect(
      expectModule(
        {
          foo: {
            type: "array",
            condition: (test: any) => test !== null,
            allowNull: true,
          },
        },
        { foo: null }
      ).isValid
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: {
            type: "boolean",
            parse: (foo: any) => !!foo,
            condition: (foo: any) => typeof foo !== "string",
          },
        },
        { foo: "bar" }
      ).isValid
    ).toBe(true);
  });

  it("Options - errorCode", () => {
    expect(
      expectModule(
        {
          bar: { type: "string" },
        },
        { bar: {} }
      ).errors()
    ).toEqual({
      bar: "Expected parameter bar to be of type string but it was {}",
    });

    expect(
      expectModule(
        {
          bar: { type: "string", errorCode: "Invalid format" },
        },
        { bar: {} }
      ).errors()
    ).toEqual({ bar: "Invalid format" });
  });

  it("Type explanations - object", () => {
    expect(
      expectModule(
        {
          bar: {
            type: "object",
            keys: { fizz: "number", buzz: "string" },
          },
        },
        { bar: { fizz: 1, buzz: 1 } }
      ).errors()
    ).toEqual({
      bar: {
        buzz: "Expected parameter bar.buzz to be of type string but it was 1",
      },
    });

    expect(
      expectModule(
        {
          bar: {
            type: "object",
            keys: {
              fizz: "number",
              buzz: {
                type: "object",
                keys: { bizz: "number" },
              },
            },
          },
        },
        { bar: { fizz: 1, buzz: { bizz: "hello" } } }
      ).errors()
    ).toEqual({
      bar: {
        buzz: {
          bizz: 'Expected parameter bar.buzz.bizz to be of type number but it was "hello"',
        },
      },
    });

    expect(
      expectModule(
        {
          bar: {
            type: "object",
            strictKeyCheck: true,
            keys: {
              fizz: "number",
              buzz: {
                type: "object",
                keys: { bizz: "number" },
              },
            },
          },
        },
        {
          bar: {
            fizz: 1,
            buzz: { bizz: 2 },
            kizz: 3,
          },
        }
      ).errors()
    ).toEqual({ bar: 'Object contained unchecked keys "kizz"' });
  });

  it("Type explanations - array", () => {
    expect(
      expectModule(
        {
          beef: {
            type: "array",
            items: {
              type: "object",
              keys: { foo: "number", bar: "boolean" },
            },
          },
        },
        {
          beef: [
            { foo: 1, bar: true },
            { foo: 2, bar: true },
            { foo: 3, bar: false },
            { foo: 4, bar: false },
          ],
        }
      ).isValid
    ).toBe(true);

    const schema: any = {
      beef: {
        type: "array",
        items: (item: { bar: any }) => ({
          type: "object",
          keys: {
            foo: item.bar ? "number" : "string",
            bar: "boolean",
          },
        }),
      },
    };

    expect(
      expectModule(schema, {
        beef: [
          { foo: 1, bar: true },
          { foo: 2, bar: true },
        ],
      }).isValid
    ).toBe(true);

    expect(
      expectModule(schema, {
        beef: [
          { foo: "1", bar: false },
          { foo: "2", bar: false },
        ],
      }).isValid
    ).toBe(true);

    expect(
      expectModule(schema, {
        beef: [
          { foo: "1", bar: true },
          { foo: "2", bar: true },
        ],
      }).isValid
    ).toBe(false);

    const recursion: any = {
      type: "object",
      keys: {
        value: "string",
        branches: {
          type: "array",
          allowNull: true,
          items: () => recursion,
        },
      },
    };

    expect(
      expectModule(
        { root: recursion },
        {
          root: {
            value: "foo",
            branches: [
              { value: "bar" },
              { value: "bizz", branches: [{ value: "buzz" }] },
            ],
          },
        }
      ).isValid
    ).toBe(true);
  });

  it("Matchers - equalTo", () => {
    expect(
      expectModule(
        {
          foo: { type: "boolean", equalTo: "bar" },
          bar: "boolean",
        },
        { foo: true, bar: true }
      ).isValid
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: { type: "boolean", parse: true, equalTo: "bar" },
          bar: "boolean",
        },
        { foo: "true", bar: true }
      ).isValid
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: { type: "boolean", equalTo: "bar" },
          bar: "boolean",
        },
        { foo: true, bar: false }
      ).isValid
    ).toBe(false);

    expect(
      expectModule(
        {
          foo: { type: "boolean", allowNull: true, equalTo: "bar" },
          bar: { type: "boolean", allowNull: true },
        },
        { foo: null, bar: null }
      ).isValid
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: {
            type: "object",
            keys: { buzz: "string" },
          },
          bar: { type: "string", equalTo: ["foo", "buzz"] },
        },
        {
          foo: { buzz: "abc" },
          bar: "abc",
        }
      ).isValid
    ).toBe(true);
  });

  it("Matchers - blockUnsafe", () => {
    expect(
      expectModule(
        { test: { type: "string", blockUnsafe: false } },
        { test: "<div>Some html</div>" }
      ).isValid
    ).toBe(true);

    expect(
      expectModule(
        { test: { type: "string", blockUnsafe: true } },
        { test: "<div>Some html</div>" }
      ).isValid
    ).toBe(false);

    expect(
      expectModule(
        { test: { type: "string", blockUnsafe: true } },
        { test: "This is not so unsafe in non-strict mode!" }
      ).isValid
    ).toBe(true);

    expect(
      expectModule(
        {
          test: {
            type: "string",
            blockUnsafe: true,
            strictEntities: true,
          },
        },
        { test: "But it is not safe in strict mode!" }
      ).isValid
    ).toBe(false);

    expect(
      expectModule(
        {
          test: {
            type: "string",
            blockUnsafe: true,
            strictEntities: true,
            allowed: ["!"],
          },
        },
        { test: "This would normally be considered unsafe!" }
      ).isValid
    ).toBe(true);
  });

  it("Matchers - sanitize", () => {
    expect(
      expectModule(
        { test: { type: "string", sanitize: true } },
        { test: "<div>Some html</div>" }
      ).getParsed()
    ).toEqual({ test: "&lt;div&gt;Some html&lt;/div&gt;" });

    expect(
      expectModule(
        { test: { type: "string", sanitize: true } },
        { test: "This will be kept as-is in non-strict mode!" }
      ).getParsed()
    ).toEqual({ test: "This will be kept as-is in non-strict mode!" });

    expect(
      expectModule(
        {
          test: {
            type: "string",
            sanitize: true,
            strictEntities: true,
          },
        },
        { test: "But sanitized in strict mode!" }
      ).getParsed()
    ).toEqual({ test: "But sanitized in strict mode&excl;" });

    expect(
      expectModule(
        {
          test: {
            type: "string",
            sanitize: true,
            strictEntities: true,
            allowed: ["(", ")"],
          },
        },
        { test: "keep (some) of this as it is [test]" }
      ).getParsed()
    ).toEqual({ test: "keep (some) of this as it is &lbrack;test&rbrack;" });
  });
});
