import expectModule from "../../src/index";

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
          expectModule({ test: { type, allowNull: false } }, { test }).isValid
        ).toBe(false);
        expect(
          expectModule({ test: { type, allowNull: () => false } }, { test })
            .isValid
        ).toBe(false);

        expect(
          expectModule({ test: { type, allowNull: true } }, { test }).isValid
        ).toBe(true);
        expect(
          expectModule({ test: { type, allowNull: () => true } }, { test })
            .isValid
        ).toBe(true);
      });
    });

    it("if disabled, rejects null value before parse option", () => {
      const schema = { test: { type, parse: () => typesValues[type] } };
      expect(expectModule(schema, {}).isValid).toBe(false);
      expect(expectModule(schema, {}).getParsed()).toEqual({});

      expect(expectModule(schema, { test: Symbol() }).isValid).toBe(true);
      expect(expectModule(schema, { test: Symbol() }).getParsed()).toEqual({
        test: typesValues[type],
      });
    });

    it("if enabled, allows null value after parse option", () => {
      nullValues.forEach((nullValue) => {
        const schema = {
          test: { type, parse: () => nullValue, allowNull: true },
        };
        const input = { test: Symbol() };
        expect(expectModule(schema, input).isValid).toBe(true);
        expect(expectModule(schema, input).getParsed()).toEqual({
          test: nullValue,
        });
      });
    });

    it("parse option works even if intital null value is allowed", () => {
      expect(
        expectModule(
          { test: { type, parse: () => typesValues[type], allowNull: true } },
          {}
        ).getParsed()
      ).toEqual({ test: typesValues[type] });
    });

    it("getParsed() returns the same null value as the input object", () => {
      nullValues.forEach((nullValue) => {
        const parsed = expectModule(
          { test: { type, allowNull: true } },
          { test: nullValue }
        ).getParsed();

        expect(parsed.test).toEqual(nullValue);
        nullValues
          .filter((otherValue) => otherValue !== nullValue)
          .forEach((otherValue) => expect(parsed.test).not.toEqual(otherValue));
      });
    });

    it("getParsed() only removes the initial property for undefined", () => {
      nullValues.forEach((nullValue) => {
        const parsed = expectModule(
          { test: { type, allowNull: true } },
          { test: nullValue }
        ).getParsed();

        const shouldPropertyExist = nullValue !== undefined;
        expect(Object.prototype.hasOwnProperty.call(parsed, "test")).toBe(
          shouldPropertyExist
        );
      });
    });

    it("parsing to undefined removes the property", () => {
      const parsed = expectModule(
        { test: { type, parse: () => undefined, allowNull: true } },
        { test: undefined }
      ).getParsed();
      expect(Object.prototype.hasOwnProperty.call(parsed, "test")).toBe(false);
    });

    it("allowNull can filter allowed null values for all types using function", () => {
      nullValues.forEach((test) => {
        expect(
          expectModule(
            { test: { type, allowNull: (x) => x !== test } },
            { test }
          ).isValid
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

it("rejects edge cases", () => {
  [NaN, 0, "null", {}, [], Symbol()].forEach((test) =>
    expect(
      expectModule({ test: { type: "boolean", allowNull: true } }, { test })
        .isValid
    ).toBe(false)
  );
});

it("does not propagate errors", () => {
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
  const validation = expectModule(
    { test: { type: "number", parse: () => "test", allowNull: true } },
    {}
  );

  expect(validation.isValid).toBe(true);
  expect(validation.getParsed()).toEqual({});
});

it("removes undefined property that is nested", () => {
  const parsed = expectModule(
    {
      foo: {
        type: "object",
        keys: { bar: { type: "number", allowNull: true } },
      },
    },
    { foo: { bar: undefined } }
  ).getParsed();
  expect(Object.prototype.hasOwnProperty.call(parsed.foo, "bar")).toBe(false);
});
