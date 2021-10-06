import expectModule from "../../src/index";

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
  describe(`requiredIf - type ${type}`, () => {
    it("option can be used", () => {
      expect(
        expectModule({ test: { type } }, { existing: "existing" }).isValid
      ).toBe(false);

      expect(
        expectModule(
          { test: { type, requiredIf: "existing" } },
          { existing: "existing" }
        ).isValid
      ).toBe(false);

      expect(
        expectModule(
          { test: { type, requiredIf: "missing" } },
          { existing: null }
        ).isValid
      ).toBe(true);
    });

    it("ignores null values", () => {
      [null, undefined, ""].forEach((missing) =>
        expect(
          expectModule(
            { test: { type, requiredIf: "missing" } },
            { missing }
          ).isValid
        ).toBe(true)
      );
    });

    it("checks initial value before parse", () => {
      const schema = {
        test: { type, parse: () => typesValues[type], requiredIf: "existing" },
      };
      expect(expectModule(schema, { existing: 123 }).isValid).toBe(false);
      expect(expectModule(schema, { existing: 123 }).getParsed()).toEqual({});

      expect(
        expectModule(schema, { test: Symbol(), existing: 123 }).isValid
      ).toBe(true);
      expect(
        expectModule(schema, { test: Symbol(), existing: 123 }).getParsed()
      ).toEqual({ test: typesValues[type] });
    });

    it("checks parsed value", () => {
      const schema = {
        test: { type, parse: () => null, requiredIf: "missing" },
      };
      expect(expectModule(schema, { test: typesValues[type] }).isValid).toBe(
        true
      );
      expect(
        expectModule(schema, { test: typesValues[type] }).getParsed()
      ).toEqual({ test: null });
    });

    it("does not check target parsed value", () => {
      const schema = {
        test: { type, requiredIf: "existing" },
        existing: { type, allowNull: true, parse: () => typesValues[type] },
      };
      expect(expectModule(schema, {}).isValid).toBe(true);
      expect(expectModule(schema, {}).getParsed()).toEqual({
        existing: typesValues[type],
      });
    });

    it("parsed value is returned even if initial value is null", () => {
      expect(
        expectModule(
          {
            test: {
              type,
              parse: () => typesValues[type],
              requiredIf: "missing",
            },
          },
          {}
        ).getParsed()
      ).toEqual({ test: typesValues[type] });
    });

    it("does not ignore falsy values (not null values)", () => {
      [0, NaN, false].forEach((existing) =>
        expect(
          expectModule(
            { test: { type, requiredIf: "existing" } },
            { existing }
          ).isValid
        ).toBe(false)
      );
    });

    it("has no effect if allowNull is true", () => {
      expect(
        expectModule(
          { test: { type, allowNull: true, requiredIf: "existing" } },
          { existing: "existing" }
        ).isValid
      ).toBe(true);
    });
  })
);
