<h2>Runtime type validation with expect</h2>

- **Zero dependencies**

- **Can be used in both browser and server environments**

- **TypeScript support, infers types for the input according to the validation schema**

## Installation

```
npm install @edgeguideab/expect
```

Note: The library is transpiled to ES5 and tested with Node LTS, older JavaScript environments may require shims/polyfills.

<details>
<summary><strong>Function signature</strong></summary>

```typescript
function expect(
  schema: object, // Object for the validation schema
  input: unknown // Input to validate according to the schema
): {
  isValid: boolean; // Indicates whether the input passed the validation
  getParsed(): object; // Returns parsed input for the properties that passed the validation
  errors(): object; // Returns errors for the properties that failed the validation
};
```

</details>

<details>
<summary><strong>Example validating input with Express.js</strong></summary>

```javascript
// ES module import
import expect from "@edgeguideab/expect";

// CommonJS
const expect = require("@edgeguideab/expect");

function addUser(req, res) {
  const validation = expect(
    { username: "string", age: "number", hasAcceptedTerms: "boolean" },
    req.body
  );

  if (!validation.isValid) {
    console.log(validation.errors());
    return res.status(400).send();
  }

  const { username, age, hasAcceptedTerms } = validation.getParsed();
  // Types for username, age and hasAcceptedTerms are valid and inferred
}
```

</details>

## Validation schema

The first argument for `expect` is an object that specifies how to validate the input.

Types are specified in the schema either with a string or with an object that has the `type` property. Using a string will apply the default validation, while an object can be used to customize the validation with various options.

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    foo: "number",
    bar: {
      type: "number",
      condition: (bar) => bar > 300,
    },
  },
  {
    foo: 123,
    bar: 321,
  }
).isValid; // true
```

### Types

| Type          | Default validation                                              | Custom options                                 |
| ------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| **_any_**     | `value != null && value !== ""`                                 | N/A                                            |
| **_number_**  | `typeof x === "number" && !Number.isNaN(x)`                     | N/A                                            |
| **_boolean_** | `typeof x === "boolean"`                                        | N/A                                            |
| **_string_**  | `typeof x === "string"`                                         | sanitize, allowed, blockUnsafe, strictEntities |
| **_array_**   | `Array.isArray(x)`                                              | items, convert                                 |
| **_object_**  | `typeof x === "object" && x !== null && !Array.isArray(x)`      | keys, strictKeyCheck                           |
| **_date_**    | Valid Date instance, or a valid string for the Date constructor | N/A                                            |


Note that _null_, _undefined_ and empty string are not allowed by default. These will be referred to as "null values" and their validation can be customized by using the `allowNull` or `requiredIf` option.

## Options

The validation can be configured using options when the default behavior does not sufffice.

The `errorCode` option can be used to customize the messages returned by `errors()` for each property that fails the validation. Some options have a corresponding errorCode option, these can be combined but beware of their priorities.

<details>
<summary><strong><i>allowNull</i></strong></summary>

The `allowNull` option is available for all types and is disabled by default.

The `allowNull` accepts a boolean or a function that takes the input value as its argument and returns a boolean. If the function throws an error, it will be ignored and treated as _false_. A function may be used to filter which null values are allowed, see the example below.

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    foo: { type: "string", allowNull: (foo) => foo !== "" },
    bar: { type: "number", allowNull: true },
  },
  { bar: "" }
).isValid; // true

expect(
  {
    foo: { type: "string", allowNull: true },
    bar: { type: "number", allowNull: (bar) => bar !== "" },
  },
  { bar: "" }
).isValid; // false
```

</details>

<details>
<summary><strong><i>requiredIf</i></strong></summary>

The `requiredIf` option is available for all types. When set, it allows a property to be a null value if another property is also a null value. Note that `allowNull` has a higher priority than `requiredIf`.

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    foo: { type: "string", allowNull: true },
    bar: { type: "string", requiredIf: "foo" },
  },
  {}
).isValid; // true

expect(
  {
    foo: { type: "string", allowNull: true },
    bar: { type: "string", requiredIf: "foo" },
  },
  { foo: "test" }
).isValid; // false

expect(
  {
    foo: { type: "string", allowNull: true },
    bar: { type: "string", allowNull: true, requiredIf: "foo" },
  },
  { foo: "test" }
).isValid; // true (requiredIf is redundant when allowNull is true)
```

When using `requiredIf` on nested objects or arrays, the option takes an array with the path to the target parameter.

```javascript
import expect from "@edgeguideab/expect";

expect(
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
).isValid; // true
```

</details>

<details>
<summary><strong><i>parse</i></strong></summary>

The `parse` option is available to all types. This option allows the user to mutate input values before the values are validated and returned by `getParsed()`.

The `parse` option may use a function with the original input value as its parameter, the return value will then be used for type checking instead of the original input value. Any errors thrown will be ignored and the type checker will proceed using the original input value.

```javascript
import expect from "@edgeguideab/expect";
expect(
  { test: { type: "number", parse: (test) => Number(test) } },
  { test: "123" }
).getParsed(); // { test: 123 }
```

Some types support setting the `parse` option to _true_ which will use the following default type conversions:

- `number` - `Number()`, only for non-empty strings
- `boolean` - `!!JSON.parse()`
  - Strings "undefined" and "NaN" are also parsed to false
  - Fallback on coercing the initial value if JSON.parse() fails.
- `string` - `JSON.stringify()`
- `array` - `JSON.parse()`
- `object` - `JSON.parse()`
- `date` - `new Date()`

Note that `parse` has a particular interaction with the `allowNull` and `requiredIf` options.

- If null values are not allowed, `parse` will not be applied for a null value
- If null values are allowed, `parse` will be applied. The parsed value must either be a null value or matching the type
- `parse` will not be applied for the target parameter when `requiredIf` checks the value of the target path

```javascript
import expect from "@edgeguideab/expect";

const invalid = expect(
  { test: { type: "string", allowNull: false, parse: true } },
  { test: null }
);
invalid.isValid; // false
invalid.getParsed(); // {}

const valid = expect(
  { test: { type: "string", allowNull: true, parse: true } },
  { test: null }
);
valid.isValid; // true
valid.getParsed(); // { test: 'null' }

const alsoValid = expect(
  { test: { type: "string", allowNull: true, parse: () => null } },
  { test: "test" }
);
alsoValid.isValid; // true
alsoValid.getParsed(); // { test: null }

const anotherOne = expect(
  {
    test: { type: "string", requiredIf: "existing" },
    existing: { type: "string", allowNull: true, parse: () => "test" },
  },
  { test: null, existing: null }
);
anotherOne.isValid; // true
anotherOne.getParsed(); // { test: null, existing: 'test' }
```

</details>

<details>
<summary><strong><i>equalTo</i></strong></summary>

`equalTo` is another option available to all types. It ensures that the input value matches another value specified by a key.

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    foo: { type: "boolean", equalTo: "bar" },
    bar: "boolean",
  },
  { foo: true, bar: true }
).isValid; // true

expect(
  {
    foo: { type: "boolean", parse: true, equalTo: "bar" },
    bar: "boolean",
  },
  { foo: "true", bar: true }
).isValid; // true

expect(
  {
    foo: { type: "boolean", equalTo: "bar" },
    bar: "boolean",
  },
  { foo: true, bar: false }
).isValid; // false

expect(
  {
    foo: { type: "boolean", allowNull: true, equalTo: "bar" },
    bar: { type: "boolean", allowNull: true },
  },
  { foo: null, bar: null }
).isValid; // true
```

Note that when using the keys/items options when nestling objects/arrays, you need to provide an array with the path to
the other parameter.

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    foo: { type: "object", keys: { buzz: "string" } },
    bar: { type: "string", equalTo: ["foo", "buzz"] },
  },
  {
    foo: { buzz: "abc" },
    bar: "abc",
  }
).isValid; // true
```

</details>

<details>
<summary><strong><i>condition</i></strong></summary>

The `condition` option is available for all types. Passing a function as a `condition` option will test that the function evaluates to a _truthy_ value with the input value as its parameter.

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    foo: {
      type: "array",
      condition: (test) => test.length,
    },
  },
  { foo: [] }
).isValid; // false
```

Note that the `condition` option has a lower priority than `allowNull`, `requiredIf` and `parse`.

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    foo: {
      type: "array",
      condition: (test) => test !== null,
      allowNull: true,
    },
  },
  { foo: null }
).isValid; // true

expect(
  {
    foo: {
      type: "boolean",
      parse: (foo) => !!foo,
      condition: (foo) => typeof foo !== "string",
    },
  },
  { foo: "bar" }
).isValid; // true
```

</details>

<details>
<summary><strong><i>keys</i></strong></summary>

If the `keys` option is provided, each property of the input object can be evaluated.

```javascript
import expect from "@edgeguideab/expect";
expect(
  {
    foo: "object",
    bar: {
      type: "object",
      keys: { fizz: "number", buzz: "string" },
    },
  },
  {
    foo: { bizz: 1 },
    bar: { fizz: 1, buzz: 1 },
  }
).errors(); // { bar: { buzz: 'Expected parameter bar.buzz to be of type string but it was 1' } }
```

Object validation may be nested with several keys-options.

```javascript
import expect from "@edgeguideab/expect";
expect(
  {
    bar: {
      type: "object",
      keys: {
        fizz: "number",
        buzz: { type: "object", keys: { bizz: "number" } },
      },
    },
  },
  { bar: { fizz: 1, buzz: { bizz: "hello" } } }
).errors(); // { bar: { buzz: { bizz: 'Expected parameter bar.buzz.bizz to be of type number but it was "hello"' } } }
```

</details>

<details>
<summary><strong><i>strictKeyCheck</i></strong></summary>
Using the `strictKeyCheck` option, the validation will fail if the input object has a property that is not specified in the `keys` option.

```javascript
import expect from "@edgeguideab/expect";
expect(
  {
    bar: {
      type: "object",
      strictKeyCheck: true,
      keys: {
        fizz: "number",
        buzz: { type: "object", keys: { bizz: "number" } },
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
).errors(); // { bar: 'Object contained unchecked keys "kizz"' }
```

</details>

<details>
<summary><strong><i>items</i></strong></summary>

`items` is available for the `array` type to validate each item within the array. Arrays and objects may be nested by combining the `items` and `keys` options.

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    beef: {
      type: "array",
      items: {
        type: "object",
        keys: { foo: "number", bar: "string" },
      },
    },
  },
  {
    beef: [
      { foo: 1, bar: "1" },
      { foo: 2, bar: "2" },
      { foo: 3, bar: "3" },
      { foo: 4, bar: "4" },
    ],
  }
).isValid; // true
```

A function may be used as an `items` option. The function will be passed the input array as its parameter and must return a validation schema.

```javascript
import expect from "@edgeguideab/expect";

const schema = {
  beef: {
    type: "array",
    items: (item) => ({
      type: "object",
      keys: {
        foo: item.bar ? "number" : "string",
        bar: "boolean",
      },
    }),
  },
};

expect(schema, {
  beef: [
    { foo: 1, bar: true },
    { foo: 2, bar: true },
  ],
}).isValid; // true

expect(schema, {
  beef: [
    { foo: "1", bar: false },
    { foo: "2", bar: false },
  ],
}).isValid; // true

expect(schema, {
  beef: [
    { foo: "1", bar: true },
    { foo: "2", bar: true },
  ],
}).isValid; // false
```

A function can also be used for recursive validation schemas.

```javascript
import expect from "@edgeguideab/expect";

const schema = {
  type: "object",
  keys: {
    value: "string",
    branches: {
      type: "array",
      allowNull: true,
      items: () => schema,
    },
  },
};

expect(
  { root: schema },
  {
    root: {
      value: "foo",
      branches: [
        { value: "bar" },
        { value: "bizz", branches: [{ value: "buzz" }] },
      ],
    },
  }
).isValid; // true
```

</details>

<details>
<summary><strong><i>convert</i></strong></summary>

`convert` is only available for the _array_ type. Similar to `parse`, this option will try to parse the given value into the desired type. Typically useful for parsing arrays from the request query in Express.js.

</details>

<details>
<summary><strong><i>blockUnsafe</i></strong></summary>

`blockUnsafe` is only available for the _string_ type. If true, the validation will fail if the value contains unsafe characters that can be used for XSS injections. In non-strict mode, these characters are
`& < > " '`, and with the `strictEntities` option enabled they are `& < > " ' ! @ $ ( ) = + { } [ ]`.

```javascript
import expect from "@edgeguideab/expect";
expect(
  { test: { type: "string", blockUnsafe: false } },
  { test: "<div>Some html</div>" }
).isValid; // true

expect(
  { test: { type: "string", blockUnsafe: true } },
  { test: "<div>Some html</div>" }
).isValid; // false
```

</details>

<details>
<summary><strong><i>strictEntities</i></strong></summary>

`strictEntities` is only available for the _string_ type and only works in combination with `blockUnsafe` and/or `sanitize`.

If `strictEntities` is true, the validation will fail if the value contains `& < > " ' ! @ $ ( ) = + { } [ ]`, instead of the default restricted characters `& < > " '`.

```javascript
import expect from "@edgeguideab/expect";
expect(
  { test: { type: "string", blockUnsafe: true } },
  { test: "This is not so unsafe in non-strict mode!" }
).isValid; // true

expect(
  { test: { type: "string", blockUnsafe: true, strictEntities: true } },
  { test: "But it is not safe in strict mode!" }
).isValid; // false
```

</details>

<details>
<summary><strong><i>sanitize</i></strong></summary>

`sanitize` is only available for the _string_ type and can be used to replace dangerous characters with html entities. In non-strict mode, these characters are
`& < > " '`, and with the `strictEntities` option enabled they are `& < > " ' ! @ $ ( ) = + { } [ ]`.

The original values will be kept as-is, and the sanitized value will can be retrieved using the getParsed method.

```javascript
import expect from "@edgdeguideab/expect";

expect(
  { test: { type: 'string', sanitize: true } },
  { test: '<div>Some html</div>' } }
).getParsed(); // { test: '&lt;div&gt;Some html&lt;/div&gt;' }
```

```javascript
import expect from "@edgeguideab/expect";

expect(
  { test: { type: "string", sanitize: true } },
  { test: "This will be kept as-is in non-strict mode!" }
).getParsed(); // { test: 'This will be kept as-is in non-strict mode!' }

expect(
  { test: { type: "string", sanitize: true, strictEntities: true } },
  { test: "But sanitized in strict mode!" }
).getParsed(); // { test: 'But sanitized in strict mode&excl;' }
```

</details>

<details>
<summary><strong><i>allowed</i></strong></summary>

`allowed` is only available for the _string_ type and only works in combination with `blockUnsafe` and/or `sanitize`.

To explicitly allow some characters, `allowed` can be passed an array of
characters that will not be sanitized or blocked.

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    test: {
      type: "string",
      sanitize: true,
      strictEntities: true,
      allowed: ["(", ")"],
    },
  },
  { test: "keep (some) of this as it is [test]" }
).getParsed(); // { test: 'keep (some) of this as it is &lbrack;test&rbrack;'}
```

</details>

<details>
<summary><strong><i>errorCode</i></strong></summary>

The `errorCode` option is available for all types and configures the message returned by `errors()` if the validation fails.

`errorCode` has the lowest priority of all the errorCode options (`errorCode` is used as a fallback).

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    bar: { type: "string" },
  },
  { bar: {} }
).errors(); // { bar: 'Expected parameter bar to be of type string but it was {}' }

expect(
  {
    bar: { type: "string", errorCode: "Invalid format" },
  },
  { bar: {} }
).errors(); // { bar: 'Invalid format' }
```

</details>

<details>
<summary><strong><i>allowNullErrorCode</i></strong></summary>

Custom error message if the error was caused by the `allowNull` (or `requiredIf`) option.

Errors caused by `allowNull` have the highest priority.

</details>

<details>
<summary><strong><i>blockUnsafeErrorCode</i></strong></summary>

Custom error message if the error was caused by the `blockUnsafe` option.

Errors caused by `blockUnsafe` have the second highest priority.

</details>

<details>
<summary><strong><i>equalToErrorCode</i></strong></summary>

Custom error message if the error was caused by the `equalTo` option.

Errors caused by `equalTo` have the third highest priority.

</details>

<details>
<summary><strong><i>conditionErrorCode</i></strong></summary>

Custom error message if the error was caused by the `condition` option.

Errors caused by `condition` have the fourth highest priority.

</details>

## Author

[EdgeGuide AB](https://www.edgeguide.se)
