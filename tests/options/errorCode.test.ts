import expectModule = require("../../src");

const types = [
  "any",
  "number",
  "boolean",
  "string",
  "array",
  "object",
  "date",
] as const;

types.forEach((type) =>
  describe(`errorCode - type ${type}`, () => {
    it("option can be used", () => {
      expect(
        expectModule({ test: { type, errorCode: "error" } }, {}).errors()
      ).toEqual({ test: "error" });
    });
  })
);
