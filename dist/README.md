## Install via NPM

```
npm install @edgeguideab/expect
```
## In the browser
You will need to require the module and then package your scripts using a bundler like webpack or browserify.

## Usage
Expect will expose a function with the signature ```function expect(expectations, actualValues, options) ```.
All arguments are expected to be objects, and the values will be matched based on equal keys in ```expectations``` and ```actualValues```.

### Validate parameters on the server

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  foo: 'string'
}, {
  foo: 'test'
});

expectations.wereMet(); //true

expectations = expect({
  foo: 'string'
}, {});

expectations.wereMet(); //false

console.log(expectations.errors()); // { foo: [Expected parameter foo to be a string but it was undefined] }

expectations = expect({
  foo: 'string'
}, {
  foo: 1
});

expectations.wereMet(); //false

console.log(expectations.errors()); //{ foo: [Expected parameter foo to be a string but it was 1] }
```

### Validate several parameters, for example with express

```javascript
const expect = require('@edgeguideab/expect');

app.put('/user', (req, res) => {
  let expectations = expect({
    name: 'string',
    age: 'number',
    admin: 'boolean'
  }, req.body);

  if (!expectations.wereMet()) {
    res.status(400).send({
      msg: expectations.errors()
    });
    return;
  }

  //Our parameters were correct, add the user to our application
});
```
### Types
| Type    | Available options   | Description                                                                       |
|---------|---------------------|-----------------------------------------------------------------------------------|
| string  | allowNull, parse, errorCode, nullCode, requiredIf, sanitize, allowed, blockUnsafe, strictEntities | expects a string.                                                                           |
| array   | allowNull, parse, errorCode, nullCode, requiredIf, items, convert | expects an array.                                                                           |
| boolean | allowNull, parse, errorCode, nullCode, strict, requiredIf | expects a boolean                                                                   |
| date    | allowNull, parse, errorCode, nullCode, requiredIf | expects either a valid date object or date string                                           |
| email   | allowNull, errorCode, nullCode, strict, requiredIf, allowed, blockUnsafe, strictEntities | expects a string formatted as an email address                                      |
| number  | allowNull, parse, errorCode, nullCode, strict, requiredIf | expects a number                                                                    |
| object  | allowNull, errorCode, nullCode, requiredIf, keys, strictKeyCheck | expects an object. Note that arrays will __not__ count as objects                           |
| phone   | allowNull, errorCode, nullCode, strict, requiredIf | expects a phone number                                                              |
| identityNumber | allowNull, errorCode, nullCode, requiredIf | expects a correctly formatted swedish personal identity number                       |

### options
In order to use options certain elements, you need to specify the types with objects instead of string, with an additional "type" key. You can specify options for individual values as follows:
```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  foo: {
    type: 'string',
    allowNull: true
  },
  bar: 'string'
}, {
  bar: 'deadbeef'
});

expectations.wereMet(); //true
```
#### allowNull
Allow null is available for all types. If set, an expected value can be matched against null and undefined. In other words, it will make a value optional.

#### parse
Some types have a ```parse``` option available. This means that expect will attempt to parse the value before checking its type. For example:
```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  foo: 'string',
  bar: {
    type: 'number',
    strict: true,
    parse: true
  }
}, {
  foo: 'hello',
  bar: '11'
});

expectations.wereMet(); //true
expectations.errors(); //{ }
expectations.getParsed() // { foo: 'hello', bar: 11 }
```

In this example, "bar" will first be parsed to the number 11, and then evaluated. This means that the check will pass even though bar is technically a string, since it can be parsed
into a number. To access an object which contains the parsed values (as well as any non-parsed values in their original form), the ```getParsed``` method can be used.

#### errorCode
Changes the value of the returned error. Default is a string describing what went wrong, but if you specify an error code it will be returned instead

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  bar: 'string'
}, {
  bar: {}
});

expectations.wereMet(); //false
expectations.errors(); //{ bar: ['Expected parameter bar to be a string but it was {}'] }


const expect = require('@edgeguideab/expect');
let expectations = expect({
  bar: {
    type: 'string',
    errorCode: 'bar is incorrectly formatted'
  }
}, {
  bar: {}
});

expectations.wereMet(); //false
expectations.errors(); //{ bar: ['bar is incorrectly formatted'] }
```

#### nullCode
Like errorCode, but only changed the returned error if it was a null error

#### strict
The strict option is available for email, phone and boolean types.

#### convert
Convert will try to convert the given value into the desired type. Typically useful for parsing arrays from `req.query` in express.

### Type explanations

#### Object
Expects the value to be of type object. If the "keys" option is given, the different keys for the object can be evaluated recursively.
```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  bar: {
    type: 'object',
    keys: {
      fizz: 'number',
      buzz: 'string'
    }
  }
}, {
  bar: {
    fizz: 1,
    buzz: 1
  }
});

expectations.wereMet(); //false
expectations.errors() // { 'bar.buzz': ['Expected parameter bar.buzz to be a string but it was 1] }
```

Object validation can be nested with several keys-options.

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  bar: {
    type: 'object',
    keys: {
      fizz: 'number',
      buzz: {
        type: 'object',
        keys: {
          bizz: 'number'
        }
      }
    }
  }
}, {
  bar: {
    fizz: 1,
    buzz: {
      bizz: 'hello'
    }
  }
});

expectations.wereMet(); //false
expectations.errors() // { 'bar.buzz.bizz': ['Expected parameter bar.buzz.bizz to be a number but it was "hello"] }
```

Unlike top-level validation, when evaluating deeper in an object the error-key will be a path to the parameter which failed (as a string). If the "keys"-option is combined with the "strictKeyCheck", object validation will fail
if the actual object contains any keys which are not explicitly checked for.


```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  bar: {
    type: 'object',
    keys: {
      fizz: 'number',
      buzz: {
        type: 'object',
        keys: {
          bizz: 'number'
        }
      }
    }
  }
}, {
  bar: {
    fizz: 1,
    buzz: {
      bizz: 2
    },
    kizz: 3
  }
});

expectations.wereMet(); //false
expectations.errors() // { 'bar': ['Object contained unchecked keys "kizz"'] }
```

#### Array
Checks whether the parameter is an array or not. If given the "items"-option, each child in the array can be evaluated. You can even nest arrays and objects, using the objects "keys"-option.

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  bar: {
    type: 'array',
    items: {
      type: 'object',
      keys: {
        foo: 'number',
        bar: 'string'
      }
    }
  }
}, {
  bar: [{
    foo: 1,
    bar: '1'
  }, {
    foo: 2,
    bar: '2'
  }, {
    foo: 3,
    bar: '3'
  }, {
    foo: 4,
    bar: '4'
  }]
});

expectations.wereMet(); //true
expectations.errors() // { }

const expect = require('@edgeguideab/expect');
let expectations = expect({
  beef: {
    type: 'array',
    items: {
      type: 'object',
      keys: {
        foo: 'number',
        bar: 'string'
      }
    }
  }
}, {
  beef: [{
    foo: 1,
    bar: '1'
  }, {
    foo: 2,
    bar: '2'
  }, {
    foo: 3,
    bar: 3
  }, {
    foo: 4,
    bar: '4'
  }]
});

expectations.wereMet(); //false
expectations.errors() // { beef.2.bar: ['Expected parameter beef.2.bar to be of type string but it was 3']}
```

##### Email
It will change the internal regular expression with which these values are validated. For email, the normal expression is ```/.+@.+/```, while the strict option sets it to
```
/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```
##### Phone
For phone numbers, ```/^\D?[\d\s\(\)]+$/``` is normally used, but it uses
```
/^\D?(\d{3,4})\D?\D?(\d{3})\D?(\d{4})$/
```
in strict mode.

##### Boolean
For boolean values, if the strict option is specified the value __must__ be of type boolean. If the strict option is not specified, ```undefined``` also counts as a boolean.

##### Number
Values are generally regarded as numbers if they can be parsed to numbers (isNaN evaluates to false). With the strict mode, they have to actually be of type number in order to be regarded as numbers. Note that
even though a string such as "11foobar" can be parsed to ```11``` using ```parseInt```, the string will not be considered a number unless the parsed numbers ```toString``` method evaluates to the original string.

### Matchers
Another thing that can be added to a value are matchers. Matchers will match the value against a specific function, and only pass if it matches this function.

#### equalTo

The ```equalTo``` matcher will match another value specified by a key.
```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  foo: {
    type: 'string',
    allowNull: true,
    equalTo: 'bar'
  },
  bar: 'string'
}, {
  foo: 'deadbeef',
  bar: 'deadbeef'
});

expectations.wereMet(); //true

let expectations = expect({
  foo: {
    type: 'string',
    allowNull: true,
    equalTo: 'bar'
  },
  bar: {
    type: 'string',
    allowNull: true
  }
}, {});

expectations.wereMet(); //true, since both have the allowNull option and are both undefined (equal)

expectations = expect({
  foo: {
    type: 'string',
    allowNull: true,
    equalTo: 'bar'
  },
  bar: 'string'
}, {
  foo: 'deadbeef',
  bar: 'feebdaed'
});

expectations.wereMet(); //false
```

Note that when using the keys/items options when nestling objects/arrays, you need to provide an array with the path to
the other parameter.
```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  foo: {
    type: 'object',
    keys: {
      buzz: 'string'
    }
  },
  bar: {
    type: 'string',
    equalTo: ['foo', 'buzz']
  }
}, {
  foo: {
    buzz: 'abc'
  },
  bar: 'abc
});

expectations.wereMet(); //true
```

#### regexp
The ```regexp``` matcher will match a value against a regular expression. The ```regexp``` parameter __must__ be a regexp object.

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  foo: {
    type: 'string',
    regexp: /.*/
  }
}, {
  foo: 'deadbeef'
});

expectations.wereMet(); //true

let expectations = expect({
  foo: {
    type: 'string',
    regexp: /^\d*$/
  }
}, {
  foo: 'deadbeef'
});

expectations.wereMet(); //false, 'deadbeef' is not a number
```

#### requiredIf
An element is allowed to be null or undefined if another value is null

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  bar: {
    type: 'string',
    requiredIf: 'foo'
  },
  foo: 'string'
}, {
  foo: ''
});

expectations.wereMet(); //true


const expect = require('@edgeguideab/expect');
let expectations = expect({
  bar: {
    type: 'string',
    errorCode: 'bar is required if foo',
    requiredIf: 'foo'
  },
  foo: 'string'
}, {
  foo: 'test'
});

expectations.wereMet(); //false
expectations.errors(); //{ bar: ['bar is required if foo'] }
```

Note that when using the keys/items options when nestling objects/arrays, you need to provide an array with the path to
the other parameter.
```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  foo: {
    type: 'object',
    keys: {
      buzz: 'string'
    }
  },
  bar: {
    type: 'string',
    requiredIf: ['foo', 'buzz']
  }
}, {
  foo: {
    buzz: ''
  },
  bar: null
});

expectations.wereMet(); //true
```

#### blockUnsafe
If true, expectations will fail if the value contains unsafe characters that can be used for XSS injections. In non-strict mode, these are
```& < > " '```, and with the strictEntities option enabled they are ```& < > " ' ! @ $ ( ) = + { } [ ]```.

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  test: {
    type: 'string',
    blockUnsafe: true
  }
}, {
  test: '<div>Some html</div>'
});

expectations.wereMet(); //false
expectations.errors(); // { test: ['Parameter test contained unsafe, unescaped characters' ] }
```


```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  test: {
    type: 'string',
    blockUnsafe: true
  }
}, {
  test: 'This is not so unsafe in non-strict mode!'
});

expectations.wereMet(); //true
```

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  test: {
    type: 'string',
    blockUnsafe: true,
    strictEntities: true
  }
}, {
  test: 'But it is not safe in strict mode!'
});

expectations.wereMet(); //false
```

For the email-type, ```@``` is always an allowed character.

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  test: {
    type: 'email',
    blockUnsafe: true,
    strictEntities: true
  }
}, {
  test: 'thisisok@foo.xcc'
});

expectations.wereMet(); //true
```

To explicitly allow some characters (even when in strict mode), you can pass a parameter ```allowed``` which is expected to be a list containing the allowed
characters.

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  test: {
    type: 'string',
    blockUnsafe: true,
    strictEntities: true,
    allowed: ['!']
  }
}, {
  test: 'This would normally be considered unsafe!'
});

expectations.wereMet(); //true
```

#### sanitize
If true, the value will have dangerous characters replaced with html entities. In non-strict mode, these are
```& < > " '```, and with the strictEntities option enabled they are ```& < > " ' ! @ $ ( ) = + { } [ ]```.
__The original values will be kept as-is, and the sanitized value will can be retrieved using the getParsed method__.

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  test: {
    type: 'string',
    sanitize: true
  }
}, {
  test: '<div>Some html</div>'
});

expectations.wereMet(); // true
expectations.getParsed(); // { test: '&lt;div&gt;Som html&lt;/div&gt;' }
```


```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  test: {
    type: 'string',
    sanitize: true
  }
}, {
  test: 'This will be kept as-is in non-strict mode!'
});

expectations.getParsed(); // { test: 'This will be kept as-is in non-strict mode!' }

expectations = expect({
  test: {
    type: 'string',
    sanitize: true,
    strictEntities: true
  }
}, {
  test: 'But sanitized in strict mode!'
});

expectations.getParsed(); // { test: 'But sanitized in strict mode&excl;' }
```

To explicitly allow some characters (even when in strict mode), you can pass a parameter ```allowed``` which is expected to be a list containing the allowed
characters. These will not be sanitized

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  test: {
    type: 'string',
    sanitize: true,
    strictEntities: true,
    allowed: ['(', ')']
  }
}, {
  test: 'keep (some) of this as it is [test] '
});

expectations.getParsed(); // { test: 'keep (some) of this as it is &lbrack;test&rbrack;'}
```
## Author

 [EdgeGuide AB](http://www.edgeguide.com)
