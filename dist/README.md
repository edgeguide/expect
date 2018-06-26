## Installation

### Using NPM

```
npm install @edgeguideab/expect
```

### In a browser

You will need to require the module and then package your scripts using a bundler like webpack or browserify.

## Usage

Expect will expose a function with the signature `function expect(expectations, actualValues, options)`.
All arguments are expected to be objects, and the values will be matched based on equal keys in `expectations` and `actualValues`.

### Validate parameters on the server

```javascript
const expect = require('@edgeguideab/expect');

expect({ foo: 'string' }, { foo: 'test' }).wereMet(); // true

const expectations = expect({ foo: 'string' }, {});
expectations.wereMet(); // false
expectations.errors(); // { foo: [Expected undefined to be a string but it was value] }
```

### Validate several parameters, example with Express.js

```javascript
const expect = require('@edgeguideab/expect');

app.put('/user', function addUser(req, res) {
  const expectations = expect(
    { name: 'string', age: 'number', admin: 'boolean' },
    req.body
  );

  if (!expectations.wereMet()) {
    return res.status(400).send();
  }

  // Our parameters were correct, add the user to our application
});
```

## Types

### Standard types

| Type    | Options                                               | Description                                                          |
| ------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| string  | parse, sanitize, allowed, blockUnsafe, strictEntities | expects a `string`                                                   |
| number  | parse, strict                                         | expects a `number`                                                   |
| boolean | parse, strict                                         | expects a `boolean`                                                  |
| array   | parse, items, convert                                 | expects an `array`                                                   |
| object  | keys, strictKeyCheck                                  | expects an `object` (note that arrays will **not** count as objects) |

### Customized types

| Type           | Options                                      | Description                                                        |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| date           | parse                                        | expects a `string` formatted as a date or a `Date` instance        |
| phone          | strict                                       | expects a `string` or a `number` formatted as a phone number       |
| email          | strict, allowed, blockUnsafe, strictEntities | expects a `string` formatted as an email address                   |
| identityNumber | N/A                                          | expects a `string` formatted as a Swedish personal identity number |

## Options

In order to use options, you need to specify the types with objects containing a `type` property instead of strings.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: { type: 'string' },
    bar: 'string'
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
    foo: { type: 'string', allowNull: true },
    bar: 'string'
  },
  { bar: 'deadbeef' }
).wereMet(); // true
```

### requiredIf

Similar to `allowNull`, the `requiredIf` option is available for all types and allows an element to be _null_ or _undefined_, but only if another value is _null_.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: 'string',
    bar: {
      type: 'string',
      errorCode: 'bar is required if foo',
      requiredIf: 'foo'
    }
  },
  { foo: '' }
).wereMet(); // true

const expectations = expect(
  {
    foo: 'string',
    bar: {
      type: 'string',
      errorCode: 'bar is required if foo',
      requiredIf: 'foo'
    }
  },
  { foo: 'test' }
);

expectations.wereMet(); // false
expectations.errors(); // { bar: ['bar is required if foo'] }
```

Note that when using `requiredIf` on nested objects or arrays, you need to pass an array to  `requiredIf` with the path to the target parameter.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: { type: 'object', keys: { buzz: 'string' } },
    bar: { type: 'string', requiredIf: ['foo', 'buzz'] }
  },
  {
    foo: { buzz: '' },
    bar: null
  }
).wereMet(); // true
```

### condition

The `condition` option is available for all types. Passing a function as a `condition` option  will test that the function evaluates to a _truthy_ value with the matched value as its parameter.

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

Note that `allowNull` and `requiredIf` have a higher priority than `condition`, which might result in unexpected behavior.

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

Some types have a `parse` option available. This means that expect will attempt to parse the value before checking its type. For example:

```javascript
const expect = require('@edgeguideab/expect');
const expectations = expect(
  {
    foo: 'string',
    bar: {
      type: 'number',
      strict: true,
      parse: true
    }
  },
  {
    foo: 'hello',
    bar: '11'
  }
);

expectations.wereMet(); // true
expectations.errors(); // {}
expectations.getParsed(); // { foo: 'hello', bar: 11 }
```

In this example, "bar" will first be parsed to the number 11, and then evaluated. This means that the check will pass even though bar is technically a string, since it can be parsed
into a number. To access an object which contains the parsed values (as well as any non-parsed values in their original form), the `getParsed` method can be used.

### errorCode

Changes the value of the returned error. Default is a string describing what went wrong, but if you specify an error code it will be returned instead

```javascript
const expect = require('@edgeguideab/expect');

let expectations = expect({ bar: { type: 'string' } }, { bar: {} });
expectations.wereMet(); // false
expectations.errors(); // { bar: ['Expected parameter bar to be a string but it was {}'] }

expectations = expect(
  { bar: { type: 'string', errorCode: 'bar is incorrectly formatted' } },
  { bar: {} }
);
expectations.wereMet(); // false
expectations.errors(); // { bar: ['bar is incorrectly formatted'] }
```

### nullCode

Like `errorCode`, but only changed the returned error if it was a null error

### strict

DEPRECATED! The `strict` option implies further restrictions on the type checks.

### convert

Similar to `parse`, this option will try to parse the given value into the desired type. Typically useful for parsing arrays from the request query in Express.js.

## Type explanations

### Object

Expects the value to be of type object. If the `keys` option is provided, the different keys for the object can be evaluated recursively.

```javascript
const expect = require('@edgeguideab/expect');
const expectations = expect(
  { bar: { type: 'object', keys: { fizz: 'number', buzz: 'string' } } },
  { bar: { fizz: 1, buzz: 1 } }
);

expectations.wereMet(); //false
expectations.errors(); // { 'bar.buzz': ['Expected parameter bar.buzz to be a string but it was 1] }
```

Object validation can be nested with several keys-options.

```javascript
const expect = require('@edgeguideab/expect');
const expectations = expect(
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
);

expectations.wereMet(); //false
expectations.errors(); // { 'bar.buzz.bizz': ['Expected parameter bar.buzz.bizz to be a number but it was "hello"] }
```

Unlike top-level validation, when evaluating deeper in an object the error-key will be a path to the parameter which failed (as a string). If the `keys`-option is combined with `strictKeyCheck`, object validation will fail
if the actual object contains any keys which are not explicitly checked for.

```javascript
const expect = require('@edgeguideab/expect');
const expectations = expect(
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
);

expectations.wereMet(); //false
expectations.errors(); // { 'bar': ['Object contained unchecked keys "kizz"'] }
```

### Array

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

### Email

It will change the internal regular expression with which these values are validated. For email, the normal expression is `/.+@.+/`, while the strict option sets it to

```
/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

### Phone

For phone numbers, `/^\D?[\d\s\(\)]+$/` is normally used, but it uses

```
/^\D?(\d{3,4})\D?\D?(\d{3})\D?(\d{4})$/
```

in strict mode.

### Boolean

For boolean values, if the strict option is specified the value **must** be of type boolean. If the strict option is not specified, `undefined` also counts as a boolean.

### Number

Values are generally regarded as numbers if they can be parsed to numbers (isNaN evaluates to false). With the strict mode, they have to actually be of type number in order to be regarded as numbers. Note that
even though a string such as "11foobar" can be parsed to `11` using `parseInt`, the string will not be considered a number unless the parsed numbers `toString` method evaluates to the original string.

## Matchers

Another thing that can be added to a value are matchers. Matchers will match the value against a specific function, and only pass if it matches this function.

### equalTo

The `equalTo` matcher will match another value specified by a key.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: { type: 'string', allowNull: true, equalTo: 'bar' },
    bar: 'string'
  },
  {
    foo: 'deadbeef',
    bar: 'deadbeef'
  }
).wereMet(); // true

expect(
  {
    foo: { type: 'string', allowNull: true, equalTo: 'bar' },
    bar: 'string'
  },
  {
    foo: 'deadbeef',
    bar: 'beefdead'
  }
).wereMet(); // false

expect(
  {
    foo: { type: 'string', allowNull: true, equalTo: 'bar' },
    bar: { type: 'string', allowNull: true }
  },
  {}
).wereMet(); // true (both have the allowNull option and are equal to undefined)
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

### regexp

The `regexp` matcher will match a value against a regular expression. The `regexp` parameter **must** be a regexp object.

```javascript
const expect = require('@edgeguideab/expect');

expect(
  { foo: { type: 'string', regexp: /.*/ } },
  { foo: 'deadbeef' }
).wereMet(); // true

expect(
  { foo: { type: 'string', regexp: /^\d*$/ } },
  { foo: 'deadbeef' }
).wereMet(); // false, 'deadbeef' is not a number
```

### blockUnsafe

If true, expectations will fail if the value contains unsafe characters that can be used for XSS injections. In non-strict mode, these are
`& < > " '`, and with the strictEntities option enabled they are `& < > " ' ! @ $ ( ) = + { } [ ]`.

```javascript
const expect = require('@edgeguideab/expect');
const expectations = expect(
  { test: { type: 'string', blockUnsafe: true } },
  { test: '<div>Some html</div>' }
);

expectations.wereMet(); // false
expectations.errors(); // { test: ['Parameter test contained unsafe, unescaped characters' ] }

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

To explicitly allow some characters (even when in strict mode), you can pass a parameter `allowed` which is expected to be a list containing the allowed
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
  { test: '<div>Some html</div>' }
).getParsed(); // { test: '&lt;div&gt;Som html&lt;/div&gt;' }
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

To explicitly allow some characters (even when in strict mode), you can pass a parameter `allowed` which is expected to be a list containing the allowed
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
  { test: 'keep (some) of this as it is [test] ' }
).getParsed(); // { test: 'keep (some) of this as it is &lbrack;test&rbrack;'}
```

## Author

[EdgeGuide AB](https://www.edgeguide.se)
