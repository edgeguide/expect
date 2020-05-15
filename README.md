## Installation

<details open>
<summary><strong>Using NPM</strong></summary>

```
npm install @edgeguideab/expect
```

</details>

<details>
<summary><strong>Using a browser</strong></summary>

You will need to require the module and then package your scripts using a bundler like webpack or browserify.

```
import expect from '@edgeguideab/expect
```

</details>

<details>
<summary><strong>Function signature</strong></summary>

`expect` exposes a function with the following signature:

```
function (schema: Object, input: Object): Object
```

The `schema` object contains a validation schema to be used for validating the `input` object.

The function returns an object exposing three method definitions:

```javascript
{
  wereMet(): Boolean, // Returns true if the input object was validated correctly
  errors(): Object,   // Returns errors for each property in the input object
  getParsed(): Object // Returns a subset of the input, containing parts that were specified in the schema
}
```

</details>

<details>
<summary><strong>Example of each method definition</strong></summary>

```javascript
const expect = require("@edgeguideab/expect");

const schema = { foo: "string" };
const validInput = { foo: "test" };
const invalidInput = {};

const valid = expect(schema, validInput);
const invalid = expect(schema, invalidInput);

valid.wereMet(); // true
invalid.wereMet(); // false

valid.errors(); // {}
invalid.errors(); // { foo: 'Expected parameter foo to be of type string but it was undefined' }

valid.getParsed(); // { foo: 'test' }
invalid.getParsed(); // {}
```

</details>

<details>
<summary><strong>Example validating input with Express.js</strong></summary>

```javascript
const expect = require("@edgeguideab/expect");

app.put("/user", function addUser(req, res) {
  const expectations = expect(
    { username: "string", age: "number", isAdmin: "boolean" },
    req.body
  );

  if (!expectations.wereMet()) {
    return res.status(400).send();
  }

  const { username, age, isAdmin } = expectations.getParsed();

  // Our parameters were correct, add the user to our application
});
```

</details>

</br>

## Types

Types must be specified in the validation schema for each input field, either by using a string or an object with the `type` property,

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    foo: "number", // Type string only validates the type
    bar: { type: "number" } // Object can be used to combine type validation with other options
  },
  {
    foo: 123,
    bar: 321
  }
).wereMet(); // true
```

</br>

<details open>
<summary><strong>Standard types</strong></summary>

| Type          | Custom options                                 | Description                                                          |
| ------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| **_any_**     | N/A                                            | expects any type (except null values, see `allowNull` option)        |
| **_number_**  | N/A                                            | expects a `number`                                                   |
| **_boolean_** | N/A                                            | expects a `boolean`                                                  |
| **_string_**  | sanitize, allowed, blockUnsafe, strictEntities | expects a `string`                                                   |
| **_array_**   | items, convert                                 | expects an `array`                                                   |
| **_object_**  | keys, strictKeyCheck                           | expects an `object` (note that arrays will **not** count as objects) |

</br>

<details>
<summary><strong><i>object</i></strong></summary>

Expects the input value to be an object. If the `keys` option is provided, each property of the input object can be evaluated.

```javascript
const expect = require("@edgeguideab/expect");
expect(
  {
    bar: {
      type: "object",
      keys: { fizz: "number", buzz: "string" }
    }
  },
  { bar: { fizz: 1, buzz: 1 } }
).errors(); // { bar: { buzz: 'Expected parameter bar.buzz to be of type string but it was 1' } }
```

Object validation may be nested with several keys-options.

```javascript
const expect = require("@edgeguideab/expect");
expect(
  {
    bar: {
      type: "object",
      keys: {
        fizz: "number",
        buzz: { type: "object", keys: { bizz: "number" } }
      }
    }
  },
  { bar: { fizz: 1, buzz: { bizz: "hello" } } }
).errors(); // { bar: { buzz: { bizz: 'Expected parameter bar.buzz.bizz to be of type number but it was "hello"' } } }
```

Using the `strictKeyCheck` option, the validation will fail if the input object has a property that is not specified in the `keys` option.

```javascript
const expect = require("@edgeguideab/expect");
expect(
  {
    bar: {
      type: "object",
      strictKeyCheck: true,
      keys: {
        fizz: "number",
        buzz: { type: "object", keys: { bizz: "number" } }
      }
    }
  },
  {
    bar: {
      fizz: 1,
      buzz: { bizz: 2 },
      kizz: 3
    }
  }
).errors(); // { bar: 'Object contained unchecked keys "kizz"' }
```

</details>

<details>
<summary><strong><i>array</i></strong></summary>

Expects the parameter to be an array. Each array item can be validated with the `items` option. Arrays and objects may be nested by combining the `items` and `keys` options.

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    beef: {
      type: "array",
      items: {
        type: "object",
        keys: { foo: "number", bar: "string" }
      }
    }
  },
  {
    beef: [
      { foo: 1, bar: "1" },
      { foo: 2, bar: "2" },
      { foo: 3, bar: "3" },
      { foo: 4, bar: "4" }
    ]
  }
).wereMet(); // true
```

A function may be used as an `items` option. The function will be passed the input array as its parameter and must return a validation schema.

```javascript
const expect = require("@edgeguideab/expect");

const schema = {
  beef: {
    type: "array",
    items: item => ({
      type: "object",
      keys: {
        foo: item.bar ? "number" : "string",
        bar: "boolean"
      }
    })
  }
};

expect(schema, {
  beef: [
    { foo: 1, bar: true },
    { foo: 2, bar: true }
  ]
}).wereMet(); // true

expect(schema, {
  beef: [
    { foo: "1", bar: false },
    { foo: "2", bar: false }
  ]
}).wereMet(); // true

expect(schema, {
  beef: [
    { foo: "1", bar: true },
    { foo: "2", bar: true }
  ]
}).wereMet(); // false
```

Note that a function can also be used for recursive validation schemas.

```javascript
const expect = require("@edgeguideab/expect");

const schema = {
  type: "object",
  keys: {
    value: "string",
    branches: {
      type: "array",
      allowNull: true,
      items: () => schema
    }
  }
};

expect(
  { root: schema },
  {
    root: {
      value: "foo",
      branches: [
        { value: "bar" },
        { value: "bizz", branches: [{ value: "buzz" }] }
      ]
    }
  }
).wereMet(); // true
```

</details>

</details>

</br>

## Options

The validation for each type may be configured using options. See the [Types section](#types) for a list of custom options limited to certain types.

Note that `expect` does **not** support using asynchronous functions as options and we strongly advise against it.

<details>
<summary><strong><i>allowNull</i></strong></summary>

The `allowNull` option is available for all types. `allowNull` allows the expected value to be _null_, _undefined_ or an empty string. In other words, `allowNull` makes the value optional.

Note that _null_, _undefined_ and empty string are valid input values with `allowNull` regardless of the actual validation type.

It is possible to pass a function to `allowNull`, in which case the return value will be used (errors thrown will be ignored and treated as _false_). This may be used to filter allowed null values.

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    foo: { type: "string", allowNull: true },
    bar: { type: "number", allowNull: true }
  },
  { bar: "" }
).wereMet(); // true

expect(
  {
    foo: { type: "string", allowNull: true },
    bar: { type: "number", allowNull: bar => bar !== "" }
  },
  { bar: "" }
).wereMet(); // false
```

</details>

<details>
<summary><strong><i>requiredIf</i></strong></summary>

The `requiredIf` option is available for all types and allows an element to be _null_ or _undefined_, but only if another value is _null_, _undefined_ or empty string.

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    foo: { type: "string", allowNull: true },
    bar: { type: "string", requiredIf: "foo" }
  },
  { foo: null }
).wereMet(); // true

expect(
  {
    foo: { type: "string", allowNull: true },
    bar: { type: "string", requiredIf: "foo" }
  },
  { foo: "test" }
).wereMet(); // false

expect(
  {
    foo: { type: "string", allowNull: true },
    bar: { type: "string", allowNull: true, requiredIf: "foo" }
  },
  { foo: "test" }
).wereMet(); // true (requiredIf has no effect if allowNull is true)
```

Note that when using `requiredIf` on nested objects or arrays, you need to pass an array to `requiredIf` with the path to the target parameter.

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    foo: {
      type: "object",
      keys: { buzz: { type: "string", allowNull: true } }
    },
    bar: { type: "string", requiredIf: ["foo", "buzz"] }
  },
  {
    foo: { buzz: null },
    bar: null
  }
).wereMet(); // true
```

</details>

<details>
<summary><strong><i>parse</i></strong></summary>

The `parse` option is available to all types. This option allows the user to mutate input values before they are validated and returned by `getParsed()`.

If a function is passed as the `parse` option, the type checker will attempt to call the `parse` function with the input value as its parameter. The function's return value will then be used for type checking instead of the input value. If an error is thrown when calling the function, the type checker will proceed using the initial input value.

```javascript
const expect = require("@edgeguideab/expect");
expect(
  { test: { type: "number", parse: test => Number(test) } },
  { test: "123" }
).getParsed(); // { test: 123 }
```

Some types support setting the `parse` option to _true_ which will instead use the following default type conversions:

- `number` - `Number()`, only parsing non-empty strings
- `boolean` - `JSON.parse()` followed by coercion for _falsy_ and _truthy_ values.
  - Fallback on coercing the initial value if `JSON.parse()` fails.
  - Strings _"undefined"_ and _"NaN"_ are also parsed to _false_
- `string` - `JSON.stringify()`
- `array` - `JSON.parse()`
- `object` - `JSON.parse()`

Note that `parse` has a particular interaction with the `allowNull` and `requiredIf` options.

- If null values are not allowed, `parse` will not be applied for a null value
- If null values are allowed, `parse` will be applied. The parsed value must either be a null value or matching the type
- `parse` will not be applied for the target parameter when `requiredIf` checks the value of the target path

```javascript
const expect = require("@edgeguideab/expect");

const invalid = expect(
  { test: { type: "string", allowNull: false, parse: true } },
  { test: null }
);
invalid.wereMet(); // false
invalid.getParsed(); // {}

const valid = expect(
  { test: { type: "string", allowNull: true, parse: true } },
  { test: null }
);
valid.wereMet(); // true
valid.getParsed(); // { test: 'null' }

const alsoValid = expect(
  { test: { type: "string", allowNull: true, parse: () => null } },
  { test: "test" }
);
alsoValid.wereMet(); // true
alsoValid.getParsed(); // { test: null }

const anotherOne = expect(
  {
    test: { type: "string", requiredIf: "existing" },
    existing: { type: "string", allowNull: true, parse: () => "test" }
  },
  { test: null, existing: null }
);
anotherOne.wereMet(); // true
anotherOne.getParsed(); // { test: null, existing: 'test' }
```

</details>

<details>
<summary><strong><i>equalTo</i></strong></summary>

`equalTo` is another option available to all types. It ensures that the input value matches another value specified by a key.

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    foo: { type: "boolean", equalTo: "bar" },
    bar: "boolean"
  },
  { foo: true, bar: true }
).wereMet(); // true

expect(
  {
    foo: { type: "boolean", parse: true, equalTo: "bar" },
    bar: "boolean"
  },
  { foo: "true", bar: true }
).wereMet(); // true

expect(
  {
    foo: { type: "boolean", equalTo: "bar" },
    bar: "boolean"
  },
  { foo: true, bar: false }
).wereMet(); // false

expect(
  {
    foo: { type: "boolean", allowNull: true, equalTo: "bar" },
    bar: { type: "boolean", allowNull: true }
  },
  { foo: null, bar: null }
).wereMet(); // true
```

Note that when using the keys/items options when nestling objects/arrays, you need to provide an array with the path to
the other parameter.

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    foo: { type: "object", keys: { buzz: "string" } },
    bar: { type: "string", equalTo: ["foo", "buzz"] }
  },
  {
    foo: { buzz: "abc" },
    bar: "abc"
  }
).wereMet(); // true
```

</details>

<details>
<summary><strong><i>condition</i></strong></summary>

The `condition` option is available for all types. Passing a function as a `condition` option will test that the function evaluates to a _truthy_ value with the input value as its parameter.

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    foo: {
      type: "array",
      condition: test => test.length
    }
  },
  { foo: [] }
).wereMet(); // false
```

Note that the `condition` option has a lower priority than `allowNull`, `requiredIf` and `parse`.

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    foo: {
      type: "array",
      condition: test => test !== null,
      allowNull: true
    }
  },
  { foo: null }
).wereMet(); // true

expect(
  {
    foo: {
      type: "boolean",
      parse: foo => !!foo,
      condition: foo => typeof foo !== "string"
    }
  },
  { foo: "bar" }
).wereMet(); // true
```

</details>

<details>
<summary><strong><i>convert</i></strong></summary>

`convert` is only available for the _array_ type. Similar to `parse`, this option will try to parse the given value into the desired type. Typically useful for parsing arrays from the request query in Express.js.

</details>

<details>
<summary><strong><i>blockUnsafe</i></strong></summary>

`blockUnsafe` is only available for the _string_ type. If true, expectations will fail if the value contains unsafe characters that can be used for XSS injections. In non-strict mode, these are
`& < > " '`, and with the strictEntities option enabled they are `& < > " ' ! @ $ ( ) = + { } [ ]`.

```javascript
const expect = require("@edgeguideab/expect");
expect(
  { test: { type: "string", blockUnsafe: true } },
  { test: "<div>Some html</div>" }
).wereMet(); // false

expect(
  { test: { type: "string", blockUnsafe: true } },
  { test: "This is not so unsafe in non-strict mode!" }
).wereMet(); // true

expect(
  { test: { type: "string", blockUnsafe: true, strictEntities: true } },
  { test: "But it is not safe in strict mode!" }
).wereMet(); // false
```

To explicitly allow some characters (even when in strict mode), you can pass a parameter `allowed` which is expected to be of type list containing the allowed
characters.

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    test: {
      type: "string",
      blockUnsafe: true,
      strictEntities: true,
      allowed: ["!"]
    }
  },
  { test: "This would normally be considered unsafe!" }
).wereMet(); // true
```

</details>

<details>
<summary><strong><i>sanitize</i></strong></summary>

If true, the value will have dangerous characters replaced with html entities. In non-strict mode, these are
`& < > " '`, and with the strictEntities option enabled they are `& < > " ' ! @ $ ( ) = + { } [ ]`.
**The original values will be kept as-is, and the sanitized value will can be retrieved using the getParsed method**.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  { test: { type: 'string', sanitize: true } },
  { test: '<div>Some html</div>' } }
).getParsed(); // { test: '&lt;div&gt;Some html&lt;/div&gt;' }
```

```javascript
const expect = require("@edgeguideab/expect");

expect(
  { test: { type: "string", sanitize: true } },
  { test: "This will be kept as-is in non-strict mode!" }
).getParsed(); // { test: 'This will be kept as-is in non-strict mode!' }

expect(
  { test: { type: "string", sanitize: true, strictEntities: true } },
  { test: "But sanitized in strict mode!" }
).getParsed(); // { test: 'But sanitized in strict mode&excl;' }
```

To explicitly allow some characters (even when in strict mode), you can pass a parameter `allowed` which is expected to be of type list containing the allowed
characters. These will not be sanitized

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    test: {
      type: "string",
      sanitize: true,
      strictEntities: true,
      allowed: ["(", ")"]
    }
  },
  { test: "keep (some) of this as it is [test]" }
).getParsed(); // { test: 'keep (some) of this as it is &lbrack;test&rbrack;'}
```

</details>

<details>
<summary><strong><i>errorCode</i></strong></summary>

Changes the error message returned by `errors()` if the validation fails. Default errorCode is a string describing what went wrong, this option allows for customized error codes.

```javascript
const expect = require("@edgeguideab/expect");

expect(
  {
    bar: { type: "string" }
  },
  { bar: {} }
).errors(); // { bar: 'Expected parameter bar to be of type string but it was {}' }

expect(
  {
    bar: { type: "string", errorCode: "Invalid format" }
  },
  { bar: {} }
).errors(); // { bar: 'Invalid format' }
```

</details>

<details>
<summary><strong><i>allowNullErrorCode</i></strong></summary>

Custom error message if the error was caused by the `allowNull` option.

Note: Errors caused by `allowNull` have the highest priority.

</details>

<details>
<summary><strong><i>blockUnsafeErrorCode</i></strong></summary>

Custom error message if the error was caused by the `blockUnsafe` option.

Note: Errors caused by `blockUnsafe` have the second highest priority.

</details>

<details>
<summary><strong><i>equalToErrorCode</i></strong></summary>

Custom error message if the error was caused by the `equalTo` option.

Note: Errors caused by `equalTo` have the third highest priority.

</details>

<details>
<summary><strong><i>conditionErrorCode</i></strong></summary>

Overrides `errorCode` if the error was caused by the `condition` option.

Note: Errors caused by `condition` have the lowest priority.

</details>

</br>

## Author

[EdgeGuide AB](https://www.edgeguide.se)
