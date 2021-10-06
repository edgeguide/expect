import expectModule from "../../src/index";

describe("Expect package (array validation):", () => {
  it("accepts boolean", () => {
    const validation = expectModule({ test: "array" }, { test: [1, 2, 3] });

    expect(validation.isValid).toBe(true);
  });

  it("accepts empty array", () => {
    const validation = expectModule({ test: "array" }, { test: [] });

    expect(validation.isValid).toBe(true);
  });

  it("rejects other data types", () => {
    const tests = [null, undefined, true, 1, NaN, Infinity, "", {}, Symbol()];
    tests.forEach((test) => {
      const validation = expectModule({ test: "array" }, { test });
      expect(validation.isValid).toBe(false);
    });
  });

  it("convert string", () => {
    const validation = expectModule(
      { test: { type: "array", convert: true } },
      { test: "convertme" }
    );

    expect(validation.isValid).toBe(true);
    expect(validation.getParsed()).toEqual({ test: ["convertme"] });
  });

  it("parse string array", () => {
    const validation = expectModule(
      { test: { type: "array", parse: true } },
      { test: "[1,2,3]" }
    );

    expect(validation.getParsed()).toEqual({ test: [1, 2, 3] });
  });

  it("does not mutate the input value when parsing", () => {
    const testObject = { test: "[1,2,3]" };
    expectModule({ test: { type: "array", parse: true } }, testObject);

    expect(testObject.test).toEqual("[1,2,3]");
  });

  it("returns the initial if no parsing is specified", () => {
    const validation = expectModule({ test: "array" }, { test: [1, 2, 3] });

    expect(validation.getParsed()).toEqual({ test: [1, 2, 3] });
  });

  it("does not destroy correct values when parsing", () => {
    const validation = expectModule(
      { test: { type: "array", parse: true } },
      { test: [1, 2, 3] }
    );

    expect(validation.getParsed()).toEqual({ test: [1, 2, 3] });
  });

  it("can validate all items", () => {
    const schema = {
      test: { type: "array", items: "number" },
    } as const;

    const validvalidation = expectModule(schema, { test: [1, 2, 3] });
    const invalidvalidation = expectModule(schema, { test: [1, 2, "3"] });

    expect(validvalidation.isValid).toBe(true);
    expect(invalidvalidation.isValid).toBe(false);
  });

  it("items function", () => {
    const schema = {
      test: {
        type: "array",
        items: (user: { isLoggedIn: boolean }) => ({
          type: "object",
          keys: user.isLoggedIn
            ? {
                username: "string",
                password: "string",
                isLoggedIn: { type: "boolean", allowNull: true },
              }
            : {
                temporaryUuid: "number",
                isLoggedIn: { type: "boolean", allowNull: true },
              },
        }),
      },
    };

    const validvalidation = expectModule(schema, {
      test: [
        { isLoggedIn: true, username: "John", password: "Snow" },
        { isLoggedIn: false, temporaryUuid: 123 },
      ],
    });
    const invalidvalidation = expectModule(schema, {
      test: [
        { isLoggedIn: true, username: "John", password: "Snow" },
        { isLoggedIn: true, temporaryUuid: 123 },
      ],
    });

    expect(validvalidation.isValid).toBe(true);
    expect(invalidvalidation.isValid).toBe(false);
  });

  it("items function error", () => {
    const schema = {
      test: {
        type: "array",
        items: (key: any) => (key.someKey.nonExisting ? "number" : "number"),
      },
    };

    expect(() => expectModule(schema, { test: [123] })).not.toThrow();
    expect(expectModule(schema, { test: [123] }).isValid).toBe(false);
  });

  it("item validation error format", () => {
    const validation = expectModule(
      { test: { type: "array", items: "number" } },
      { test: [1, 2, "3"] }
    );

    expect(validation.errors()).toEqual({
      test: {
        2: 'Expected parameter test.2 to be of type number but it was "3"',
      },
    });
  });

  it("item validation respects errorCode", () => {
    const validation = expectModule(
      {
        test: {
          type: "array",
          items: {
            type: "number",
            errorCode: "incorrect.item.format",
          },
        },
      },
      { test: [1, 2, "3"] }
    );

    expect(validation.errors()).toEqual({
      test: { 2: "incorrect.item.format" },
    });
  });

  it("parses items", () => {
    const validation = expectModule(
      {
        test: {
          type: "array",
          items: {
            type: "number",
            errorCode: "incorrect.item.format",
            allowNull: true,
            parse: true,
          },
        },
      },
      { test: [1, 2, "3"] }
    );

    expect(validation.isValid).toBe(true);
  });

  it("can allow items to be null", () => {
    const validation = expectModule(
      {
        test: {
          type: "array",
          items: {
            type: "string",
            errorCode: "incorrect.item.format",
            allowNull: true,
          },
        },
      },
      { test: ["test", null, null] }
    );

    expect(validation.isValid).toBe(true);
  });
});
