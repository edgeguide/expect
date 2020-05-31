import expectModule = require("../../src");

const nullValues = [null, undefined, ""] as const;

const types = [
  "any",
  "number",
  "boolean",
  "string",
  "array",
  "object",
  "date",
] as const;

const typesValues = {
  any: 123,
  number: 321,
  boolean: true,
  string: "test",
  array: [1, 2, 3],
  object: { test: "test" },
  date: new Date(),
} as const;

types.forEach((type) =>
  describe(`allowNull - type ${type}`, () => {
    it("option can be used", () => {
      nullValues.forEach((test) => {
        expect(
          expectModule({ test: { type, allowNull: false } }, { test }).wereMet()
        ).toBe(false);
        expect(
          expectModule(
            { test: { type, allowNull: () => false } },
            { test }
          ).wereMet()
        ).toBe(false);

        expect(
          expectModule({ test: { type, allowNull: true } }, { test }).wereMet()
        ).toBe(true);
        expect(
          expectModule(
            { test: { type, allowNull: () => true } },
            { test }
          ).wereMet()
        ).toBe(true);
      });
    });

    it("checks initial value before parse", () => {
      const schema = { test: { type, parse: () => typesValues[type] } };
      expect(expectModule(schema, {}).wereMet()).toBe(false);
      expect(expectModule(schema, {}).getParsed()).toEqual({});

      expect(expectModule(schema, { test: Symbol() }).wereMet()).toBe(true);
      expect(expectModule(schema, { test: Symbol() }).getParsed()).toEqual({
        test: typesValues[type],
      });
    });

    it("checks parsed value", () => {
      const schema = { test: { type, parse: () => null, allowNull: true } };
      expect(expectModule(schema, { test: typesValues[type] }).wereMet()).toBe(
        true
      );
      expect(
        expectModule(schema, { test: typesValues[type] }).getParsed()
      ).toEqual({ test: null });
    });

    it("parsed value is returned even if intital value is null", () => {
      expect(
        expectModule(
          { test: { type, parse: () => typesValues[type], allowNull: true } },
          {}
        ).getParsed()
      ).toEqual({ test: typesValues[type] });
    });

    it("parsed value is not returned if undefined", () => {
      const parsed = expectModule(
        { test: { type, parse: () => undefined, allowNull: true } },
        {}
      ).getParsed();
      expect(Object.prototype.hasOwnProperty.call(parsed, "test")).toBe(false);
    });

    it("non-null values are ignored by allowNull", () => {
      expect(
        expectModule(
          { test: { type, parse: () => typesValues[type] } },
          { test: null }
        ).wereMet()
      ).toBe(false);

      [NaN, 0, false, "null", {}, [], Symbol()].forEach((test) =>
        expect(
          expectModule(
            { test: { type, parse: () => typesValues[type] } },
            { test }
          ).wereMet()
        ).toBe(true)
      );
    });

    it("allowNull can filter allowed null values for all types using function", () => {
      ["", null, undefined].forEach((test) => {
        expect(
          expectModule(
            { test: { type, allowNull: (x) => x !== test } },
            { test }
          ).wereMet()
        ).toBe(false);
      });
    });

    it("allowNullErrorCode changes error message", () => {
      expect(
        expectModule(
          { test: { type, allowNullErrorCode: "error" } },
          {}
        ).errors()
      ).toEqual({ test: "error" });
    });

    it("allowNullErrorCode has higher priority than type validation (errorCode)", () => {
      nullValues.forEach((test) =>
        expect(
          expectModule(
            { test: { type, allowNullErrorCode: "error", errorCode: "error" } },
            { test }
          ).errors()
        ).toEqual({ test: "error" })
      );
    });
  })
);

it("does not throw", () => {
  expect(() =>
    expectModule(
      {
        test: {
          type: "string",
          allowNull: () => {
            throw new Error();
          },
        },
      },
      {}
    )
  ).not.toThrow();
});

it("allowNull with invalid parse is ignored", () => {
  const expectations = expectModule(
    { test: { type: "number", parse: () => "test", allowNull: true } },
    {}
  );

  expect(expectations.wereMet()).toBe(true);
  expect(expectations.getParsed()).toEqual({});
});

it("nested parsed value is not returned if undefined", () => {
  const parsed = expectModule(
    {
      foo: {
        type: "object",
        keys: { bar: { type: "number", allowNull: true, parse: true } },
      },
    },
    { foo: {} }
  ).getParsed();
  expect(Object.prototype.hasOwnProperty.call(parsed.foo, "bar")).toBe(false);
});

it("allowNull with invalid parse behaves correctly with equalTo", () => {
  expect(
    expectModule(
      {
        foo: { type: "string", allowNull: true, equalTo: "bar" },
        bar: { type: "string", allowNull: true, parse: () => 123 },
      },
      {}
    ).wereMet()
  ).toBe(true);
});
