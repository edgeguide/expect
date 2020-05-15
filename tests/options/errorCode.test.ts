import expectModule = require("../../src");

const types: any = ["any", "number", "boolean", "string", "array", "object"];

types.forEach((type: any) =>
  describe(`errorCode - type ${type}`, () => {
    it("option can be used", () => {
      expect(
        expectModule({ test: { type, errorCode: "error" } }, {}).errors()
      ).toEqual({ test: "error" });
    });
  })
);
