import expect from "./index";

const schema = { foo: "string" };
const readOnly = { foo: "string" } as const;

expect(schema, {}).getParsed();
expect(readOnly, {}).getParsed();
expect({ foo: "string" }, {}).getParsed();

expect(schema, {}).errors();
expect(readOnly, {}).errors();
expect({ foo: "string" }, {}).errors();

const validation = expect(
  {
    foo: "string",
    bar: "number",
  },
  {}
);

if (!validation.isValid) {
  validation.getParsed();
  validation.errors();
  throw new Error();
}

validation.getParsed();
validation.errors();
