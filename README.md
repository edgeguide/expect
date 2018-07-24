## Contents

1.  [Breaking changes in version 3](#breaking-changes-in-version-3)
2.  [Installation](#installation)
    - [Using NPM](#using-npm)
    - [In a browser](#in-a-browser)
3.  [Usage](#usage)
    - [Example of each method definition](#example-of-each-method-definition)
    - [Example validating input with Express.js](#example-validating-input-with-express.js)
4.  [Types](#types)
    - [Standard types](#standard-types)
    - [Customized types](#customized-types)
5.  [Type explanations](#type-explanations)
    - [object](#object)
    - [array](#array)
    - [email](#email)
    - [phone](#phone)
6.  [Options](#options)
    - [allowNull](#allownull)
    - [requiredIf](#requiredif)
    - [condition](#condition)
    - [parse](#parse)
    - [equalTo](#equalTo)
    - [errorCode](#errorcode)
    - [nullCode](#nullcode)
    - [convert](#convert)
    - [blockUnsafe](#blockunsafe)

## Breaking changes in version 3

- The `strict` option has been removed
  - Default type validation is now "stricter". Use the `parse` option for more lenient validation
  - NOTE: `number` no longer allows string numbers by default (e.g. "123")
- `maxLength`, `minLength` and `regexp` options have been removed. Replaced by `condition`
- The customized `date` type no longer allows "Invalid Date" when using the `parse` option

## Installation

### Using NPM

```
npm install @edgeguideab/expect
```

### In a browser

You will need to require the module and then package your scripts using a bundler like webpack or browserify.

## Usage

`expect` exposes a function with the following signature:

```
function (schema: Object, input: Object): Object
```

The `schema` object contains a validation schema to be used for validating the `input` object.

The function returns an object exposing three method definitions:

```javascript
{
  wereMet(): Boolean, // Returns whether the input object was validated correctly
  errors(): Object,   // Returns errors for each property in the input object
  getParsed(): Object // Returns a subset of the input, containing parts that were specified in the schema
}
```

### Example of each method definition

```javascript
const expect = require('@edgeguideab/expect');

const schema = { foo: 'string' };
const validInput = { foo: 'test' };
const invalidInput = {};

const valid = expect(schema, validInput);
const invalid = expect(schema, invalidInput);

valid.wereMet(); // true
invalid.wereMet(); // false

valid.errors(); // {}
invalid.errors(); // { foo: ['Expected parameter foo to be of type string but it was undefined'] }

valid.getParsed(); // { foo: 'test' }
invalid.getParsed(); // {}
```

### Example validating input with Express.js

```javascript
const expect = require('@edgeguideab/expect');

app.put('/user', function addUser(req, res) {
  const expectations = expect(
    { username: 'string', age: 'number', isAdmin: 'boolean' },
    req.body
  );

  if (!expectations.wereMet()) {
    return res.status(400).send();
  }

  const { username, age, isAdmin } = expectations.getParsed();

  // Our parameters were correct, add the user to our application
});
```

## Types

### Standard types

| Type    | Custom options                                 | Description                                                          |
| ------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| any     | N/A                                            | expects any type except for _undefined_, _null_ or empty string ('') |
| number  | N/A                                            | expects a `number`                                                   |
| boolean | N/A                                            | expects a `boolean`                                                  |
| string  | sanitize, allowed, blockUnsafe, strictEntities | expects a `string`                                                   |
| array   | items, convert                                 | expects an `array`                                                   |
| object  | keys, strictKeyCheck                           | expects an `object` (note that arrays will **not** count as objects) |

### Customized types

| Type           | Options                                      | Description                                                        |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| date           | N/A                                          | expects a `string` formatted as a date or a `Date` instance        |
| phone          | strict                                       | expects a `string` or a `number` formatted as a phone number       |
| email          | strict, allowed, blockUnsafe, strictEntities | expects a `string` formatted as an email address                   |
| identityNumber | N/A                                          | expects a `string` formatted as a Swedish personal identity number |

## Type explanations

### object

Expects the value to be of type object. If the `keys` option is provided, the different keys for the object can be evaluated recursively.

```javascript
const expect = require('@edgeguideab/expect');
expect(
  {
    bar: {
      type: 'object',
      keys: { fizz: 'number', buzz: 'string' }
    }
  },
  { bar: { fizz: 1, buzz: 1 } }
).errors(); // { 'bar.buzz': ['Expected parameter bar.buzz to be of type string but it was 1'] }
```

Object validation can be nested with several keys-options.

```javascript
const expect = require('@edgeguideab/expect');
expect(
  {
    bar: {
      type: 'object',
      keys: {
        fizz: 'number',
        buzz: { type: 'object', keys: { bizz: 'number' } }
      }
    }
  },
  { bar: { fizz: 1, buzz: { bizz: 'hello' } } }
).errors(); // { 'bar.buzz.bizz': ['Expected parameter bar.buzz.bizz to be of type number but it was "hello"] }
```

Unlike top-level validation, when evaluating deeper in an object the error-key will be a path to the parameter which failed (as a string). If the `keys`-option is combined with `strictKeyCheck`, object validation will fail
if the actual object contains any keys which are not explicitly checked for.

```javascript
const expect = require('@edgeguideab/expect');
expect(
  {
    bar: {
      type: 'object',
      strictKeyCheck: true,
      keys: {
        fizz: 'number',
        buzz: { type: 'object', keys: { bizz: 'number' } }
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
).errors(); // { 'bar': ['Object contained unchecked keys "kizz"'] }
```

### array

Checks whether the parameter is an array or not. Each child in the array can be further validated with the `items` option. Arrays and objects may be nested by combining the `items` and `keys` options.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    beef: {
      type: 'array',
      items: {
        type: 'object',
        keys: { foo: 'number', bar: 'string' }
      }
    }
  },
  {
    beef: [
      { foo: 1, bar: '1' },
      { foo: 2, bar: '2' },
      { foo: 3, bar: '3' },
      { foo: 4, bar: '4' }
    ]
  }
).wereMet(); // true
```

### email

A customized type for _strings_ which can be used to check if the value is correctly formatted as an email address. Regular expression used to validate emails:

- Without `strict` option
  ```
  /.+@.+/
  ```
- With `strict` option
  ```
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ```

### phone

A customized type for _strings_ and _numbers_ which can be used to check if the value is correctly formatted as a phone number. Regular expression used to validate phone numbers:

- Without `strict` option
  ```
  /^\D?[\d\s\(\)]+$/
  ```
- With `strict` option
  ```
  /^\D?(\d{3,4})\D?\D?(\d{3})\D?(\d{4})$/
  ```

## Options

In order to use options, you need to specify the types with objects containing a `type` property instead of strings.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: 'string',
    bar: { type: 'string' }
  },
  {
    foo: 'deadbeef',
    bar: 'deadbeef'
  }
).wereMet(); // true
```

### allowNull

The `allowNull` option is available for all types. If this option is set, an expected value can be matched against _null_ or _undefined_. In other words, `allowNull` makes the value optional.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: 'string',
    bar: { type: 'string', allowNull: true }
  },
  { foo: 'deadbeef' }
).wereMet(); // true
```

### requiredIf

The `requiredIf` option is available for all types and allows an element to be _null_ or _undefined_, but only if another value is _null_ or _undefined_.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: { type: 'string', allowNull: true },
    bar: { type: 'string', requiredIf: 'foo' }
  },
  { foo: null }
).wereMet(); // true

expect(
  {
    foo: { type: 'string', allowNull: true },
    bar: { type: 'string', requiredIf: 'foo' }
  },
  { foo: 'test' }
).wereMet(); // false
```

Note that when using `requiredIf` on nested objects or arrays, you need to pass an array to `requiredIf` with the path to the target parameter.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: {
      type: 'object',
      keys: { buzz: { type: 'string', allowNull: true } }
    },
    bar: { type: 'string', requiredIf: ['foo', 'buzz'] }
  },
  {
    foo: { buzz: null },
    bar: null
  }
).wereMet(); // true
```

### condition

The `condition` option is available for all types. Passing a function as a `condition` option will test that the function evaluates to a _truthy_ value with the input value as its parameter.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: {
      type: 'array',
      condition: test => test.length
    }
  },
  { foo: [] }
).wereMet(); // false
```

Note that the `condition` option has a lower priority than `allowNull` and `requiredIf`.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: {
      type: 'array',
      condition: test => test !== null,
      allowNull: true
    }
  },
  { foo: null }
).wereMet(); // true
```

### parse

The `parse` option is available to all types. This option allows the user to mutate input values before they are validated and returned by `getParsed()`.

Similar to the `condition` option, a function can be passed as a `parse` option with the input value as its parameter. The function's return value will then be used as the parsed value. If an error is thrown when calling the function, the type checker will proceed using the initial input value.

```javascript
const expect = require('@edgeguideab/expect');
expect(
  { test: { type: 'number', parse: test => Number(test) } },
  { test: '123' }
).getParsed(); // { test: 123 }
```

Some types support setting the `parse` option to _true_ which will instead use the following default type conversions:

- `number` - `Number()`
- `boolean` - `JSON.parse()` followed by coercion for _falsy_ and _truthy_ values.
  - Fallback on coercing the initial value if `JSON.parse()` fails.
  - Strings _"undefined"_ and _"NaN"_ are also parsed to _false_
- `string` - `JSON.stringify()`
- `array` - `JSON.parse()`
- `object` - `JSON.parse()`
- `date` - `new Date()`

Note that the `parse` option has a lower priority than `allowNull` and `requiredIf`.

```javascript
const expect = require('@edgeguideab/expect');

const invalid = expect(
  { test: { type: 'string', allowNull: false, parse: true } },
  { test: null }
);
invalid.wereMet(); // false
invalid.getParsed(); // { test: null }

const valid = expect(
  { test: { type: 'string', allowNull: true, parse: true } },
  { test: null }
);
valid.wereMet(); // true
valid.getParsed(); // { test: 'null' }
```

### equalTo

`equalTo` is another option available to all types. It ensures that the input value matches another value specified by a key.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: { type: 'boolean', equalTo: 'bar' },
    bar: 'boolean'
  },
  { foo: true, bar: true }
).wereMet(); // true

expect(
  {
    foo: { type: 'boolean', parse: true, equalTo: 'bar' },
    bar: 'boolean'
  },
  { foo: 'true', bar: true }
).wereMet(); // true

expect(
  {
    foo: { type: 'boolean', equalTo: 'bar' },
    bar: 'boolean'
  },
  { foo: true, bar: false }
).wereMet(); // false

expect(
  {
    foo: { type: 'boolean', allowNull: true, equalTo: 'bar' },
    bar: { type: 'boolean', allowNull: true }
  },
  { foo: null, bar: null }
).wereMet(); // true
```

Note that when using the keys/items options when nestling objects/arrays, you need to provide an array with the path to
the other parameter.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: { type: 'object', keys: { buzz: 'string' } },
    bar: { type: 'string', equalTo: ['foo', 'buzz'] }
  },
  {
    foo: { buzz: 'abc' },
    bar: 'abc'
  }
).wereMet(); // true
```

### errorCode

Changes the value of the returned error. Default is a string describing what went wrong, but if you specify an error code it will be returned instead

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    bar: { type: 'string' }
  },
  { bar: {} }
).errors(); // { bar: ['Expected parameter bar to be of type string but it was {}'] }

expect(
  {
    bar: { type: 'string', errorCode: 'Invalid format' }
  },
  { bar: {} }
).errors(); // { bar: ['Invalid format'] }
```

### nullCode

Same as `errorCode`, changes the returned error if it was a null error

### convert

Similar to `parse`, this option will try to parse the given value into the desired type. Typically useful for parsing arrays from the request query in Express.js.

### blockUnsafe

If true, expectations will fail if the value contains unsafe characters that can be used for XSS injections. In non-strict mode, these are
`& < > " '`, and with the strictEntities option enabled they are `& < > " ' ! @ $ ( ) = + { } [ ]`.

```javascript
const expect = require('@edgeguideab/expect');
expect(
  { test: { type: 'string', blockUnsafe: true } },
  { test: '<div>Some html</div>' }
).wereMet(); // false

expect(
  { test: { type: 'string', blockUnsafe: true } },
  { test: 'This is not so unsafe in non-strict mode!' }
).wereMet(); // true

expect(
  { test: { type: 'string', blockUnsafe: true, strictEntities: true } },
  { test: 'But it is not safe in strict mode!' }
).wereMet(); // false
```

For the email-type, `@` is always an allowed character.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  { test: { type: 'email', blockUnsafe: true, strictEntities: true } },
  { test: 'thisisok@foo.xcc' }
).wereMet(); // true
```

To explicitly allow some characters (even when in strict mode), you can pass a parameter `allowed` which is expected to be of type list containing the allowed
characters.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    test: {
      type: 'string',
      blockUnsafe: true,
      strictEntities: true,
      allowed: ['!']
    }
  },
  { test: 'This would normally be considered unsafe!' }
).wereMet(); // true
```

### sanitize

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
const expect = require('@edgeguideab/expect');

expect(
  { test: { type: 'string', sanitize: true } },
  { test: 'This will be kept as-is in non-strict mode!' }
).getParsed(); // { test: 'This will be kept as-is in non-strict mode!' }

expect(
  { test: { type: 'string', sanitize: true, strictEntities: true } },
  { test: 'But sanitized in strict mode!' }
).getParsed(); // { test: 'But sanitized in strict mode&excl;' }
```

To explicitly allow some characters (even when in strict mode), you can pass a parameter `allowed` which is expected to be of type list containing the allowed
characters. These will not be sanitized

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    test: {
      type: 'string',
      sanitize: true,
      strictEntities: true,
      allowed: ['(', ')']
    }
  },
  { test: 'keep (some) of this as it is [test]' }
).getParsed(); // { test: 'keep (some) of this as it is &lbrack;test&rbrack;'}
```

## Author

[EdgeGuide AB](https://www.edgeguide.se)
