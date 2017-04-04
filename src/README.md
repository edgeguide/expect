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
| string  | allowNull, errorCode, requiredIf | expects a string.                                                                           |
| array   | allowNull, errorCode, requiredIf | expects an array.                                                                           |
| boolean | allowNull, errorCode, strict, requiredIf | expects a boolean                                                                   |
| date    | allowNull, errorCode, requiredIf | expects either a valid date object or date string                                           |
| email   | allowNull, errorCode, strict, requiredIf | expects a string formatted as an email address                                      |
| number  | allowNull, errorCode, strict, requiredIf | expects a number                                                                    |
| object  | allowNull, errorCode, requiredIf | expects an object. Note that arrays will __not__ count as objects                           |
| phone   | allowNull, errorCode, strict, requiredIf | expects a phone number                                                              |

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
    errorCode: 'bar is required'
  }
}, {
  bar: {}
});

expectations.wereMet(); //false
expectations.errors(); //{ bar: ['bar is required'] }
```

#### requiredIf
An element is allowed to be null or undefined if another value is null or undefined

```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({  
  bar: {
    type: 'string',
    requiredIf: 'foo'
  },
  foo: 'string'
}, {});

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

#### strict
The strict option is available for email, phone and boolean types.

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
Values are generally regarded as numbers if they can be parsed to numbers (isNaN evaluates to false). With the strict mode, they have to actually be of type number in order to be regarded as numbers.

### Global options
If you want to make all values optional, you can set a global ```allowNull```option.
```javascript
const expect = require('@edgeguideab/expect');
let expectations = expect({
  foo: 'string',
  bar: 'string'
}, {}, {
  allowNull: true
});

expectations.wereMet(); //true
```
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

## Author

 [EdgeGuide AB](http://www.edgeguide.com)
