import expectModule from "../src/index";

const testData = [
  null,
  undefined,
  true,
  1,
  NaN,
  Infinity,
  "",
  Symbol(),
] as const;

testData.forEach((input) =>
  describe(`Invalid input: ${
    typeof input === "symbol" ? input.toString() : JSON.stringify(input)
  }`, () => {
    it("Throws error on invalid validation schema", () => {
      expect(() => expectModule(input as any, { x: "test" })).toThrow();
    });

    it("Does not throw error on invalid input", () => {
      const expectFunction = () => expectModule({ x: "string" }, input as any);
      expect(expectFunction).not.toThrow();
      expect(expectFunction().wereMet()).toBe(false);
    });
  })
);

describe("handling of __proto__ poisoning", () => {
  it("fails if __proto__ key is present when parse is true for objects", () => {
    const expectations = expectModule(
      {
        test: {
          type: "object",
          parse: true,
        },
      },
      {
        test: '{ "b": 5, "__proto__": { "c": 6 } }',
      }
    );

    expect(expectations.wereMet()).toEqual(false);
  });

  it("fails if __proto__ is present deeper in the object if parse is true", () => {
    const expectations = expectModule(
      {
        test: {
          type: "object",
          parse: true,
        },
      },
      {
        test: '{ "a": 5, b: { "__proto__": { "c": 6 } } }',
      }
    );

    expect(expectations.wereMet()).toEqual(false);
  });

  it("should not accept __proto__ as type", () => {
    const expectFunction = () =>
      expectModule(
        {
          test: {
            type: "__proto__",
            parse: true,
          } as any,
        },
        {
          test: '{ "b": 5, "__proto__": { "c": 6 } }',
        }
      );

    expect(expectFunction).toThrow(
      'Invalid type "__proto__" for parameter test'
    );
  });
});
