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
  describe(`condition - type ${type}`, () => {
    it("option can be used", () => {
      expect(
        expectModule(
          { test: { type, condition: () => true } },
          { test: typesValues[type] }
        ).wereMet()
      ).toBe(true);

      expect(
        expectModule(
          { test: { type, condition: () => false } },
          { test: typesValues[type] }
        ).wereMet()
      ).toBe(false);
    });

    it("conditionErrorCode changes error message", () => {
      expect(
        expectModule(
          {
            test: { type, condition: () => false, conditionErrorCode: "error" },
          },
          { test: typesValues[type] }
        ).errors()
      ).toEqual({ test: "error" });
    });

    it("reject gracefully if condition throws error", () => {
      const expectationsFunc = () =>
        expectModule(
          {
            test: {
              type,
              condition: () => {
                throw new Error("fail");
              },
            },
          },
          { test: typesValues[type] }
        );
      expect(expectationsFunc).not.toThrow();
      expect(expectationsFunc().wereMet()).toBe(false);
    });

    it("lower priority than allowNull", () => {
      expect(
        expectModule(
          {
            test: {
              type,
              allowNull: true,
              condition: (test) => test !== null,
            },
          },
          {}
        ).wereMet()
      ).toBe(true);
    });

    it("lower priority than requiredIf", () => {
      expect(
        expectModule(
          {
            test: {
              type,
              requiredIf: "missing",
              condition: (test) => test !== null,
            },
          },
          {}
        ).wereMet()
      ).toBe(true);
    });

    it("lower priority than parse", () => {
      const otherTypeValues = {
        any: 456,
        number: 654,
        boolean: false,
        string: "bar",
        array: [4, 5, 6],
        object: { test: "object" },
        date: new Date(1),
      } as const;

      expect(
        expectModule(
          {
            test: {
              type,
              condition: (test) => test !== typesValues[type],
              parse: () => otherTypeValues[type],
            },
          },
          { test: typesValues[type] }
        ).wereMet()
      ).toBe(true);
    });

    it("conditionErrorCode has lower priority than allowNullErrorCode", () => {
      expect(
        expectModule(
          {
            test: {
              type,
              condition: () => false,
              conditionErrorCode: "condition",
              allowNullErrorCode: "allowNull",
            },
          },
          {}
        ).errors()
      ).toEqual({ test: "allowNull" });
    });

    it("conditionErrorCode has lower priority than equalToErrorCode", () => {
      expect(
        expectModule(
          {
            test: {
              type,
              condition: () => false,
              equalTo: "missing",
              conditionErrorCode: "condition",
              equalToErrorCode: "equalTo",
            },
          },
          { test: typesValues[type] }
        ).errors()
      ).toEqual({ test: "equalTo" });
    });

    if (type !== "any") {
      it("conditionErrorCode has lower priority than type validation (errorCode)", () => {
        expect(
          expectModule(
            {
              test: {
                type,
                condition: () => false,
                conditionErrorCode: "condition",
                errorCode: "error",
              },
            },
            { test: Symbol() }
          ).errors()
        ).toEqual({ test: "error" });
      });
    }
  })
);
