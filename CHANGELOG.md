## 9.0.0 (10 August 2023)

- Added additional protections against prototype pollution

### Breaking changes

- Internally in the library, Object.create(null) is used to create the error object and parsed object returned by .errors() and .getParsed(). This will only affect you if you rely on the prototype for these object in your code.

## 8.0.2 (6 October 2021)

- Ignore undefined top-level properties in the schema instead of throwing an error

- `equalTo` now compares with `Object.is()` instead of strict equality operator (`===`), handles NaN and +/- 0 values.

- Fixed `equalTo` comparison for type `date`

## 8.0.1 (6 October 2021)

- Added `isValid` and deprecated `wereMet()` (see issue #15)
- The `keys` option now ignores undefined properties in the schema instead of throwing an error

## 8.0.0 (23 November 2020)

- `getParsed()` and `errors()` will now try to infer the return value type from the schema. If the type inference fails, it will fallback to using `any`
- Using `equalTo` in a circular manner is now supported and no longer causes an infinite recursion

### Breaking changes

- Removed the following custom types: `phone`, `email` and `identityNumber` [[#2](https://github.com/edgeguide/expect/issues/2)]. Migration can be done using type `string` or `number` with a `condition` function for custom validation

## 7.0.1 (15 July 2019)

- Objects containing \_\_proto\_\_ as a key will now cause the validation to fail. This is to mitigate prototype poisoning

## 7.0.0 (16 April 2019)

- allowNull takes the input value as a function parameter. Can be used to filter allowed null values

### Breaking changes

- Removed dependency on babel-polyfill. You will need polyfill the following features:
  - Array.reduce
  - Array.some
  - Array.includes
  - Number.isInteger

## 6.2.0-beta.0 (25 January 2019)

- Rewrite of codebase to TypeScript

## 6.1.3 (28 November 2018)

- Updated npm packages

## 6.1.2 (26 November 2018)

- Added missing null checks when checking typeof === "object"
- Rephrasing and fixed spelling errors in README

## 6.1.1 (30 August 2018)

- Fixed `getParsed()` was returning _undefined_ properties for _object_ type

## 6.1.0 (30 August 2018)

- `getParsed()` no longer returns properties that are _undefined_

## 6.0.2 (17 August 2018)

- Fixed default error message for `allowNull` when `parse` is used

## 6.0.1 (16 August 2018)

- Fixed reference error if global variable `window` is not defined

## 6.0.0 (16 August 2018)

### Breaking changes

- Default `parse` for numbers only parse non-empty strings.

## 5.1.1 (15 August 2018)

- `allowNull` combined with `parse` will use the initial null value if the parsed value is not valid
- `equalTo` will do a recursion if the target parameter has a validation schema in order to correctly parse the target parameter

## 5.1.0 (15 August 2018)

- `allowNull` supports function
- [babel-polyfill](https://www.npmjs.com/package/babel-polyfill) is required to window if it does not already exist
- Added disclaimer in README about not using asynchronous functions as options

## 5.0.1 (1 August 2018)

- JSON.stringify invalid type in error message

## 5.0.0 (1 August 2018)

### Breaking changes

- Passing an invalid type in the validation schema throws an error instead of failing the validation
- `errors()` only returns a single error for each failed property
- `requiredIf` no longer attempts to parse the target parameter if the parameter has a `parse` option
- `requiredIf` no longer ignores _false_ value for boolean types
  - Values still ignored are _null_, _undefined_ and empty string
- Changed the name of some options for consistency
  - `unsafeErrorCode` changed to `blockUnsafeErrorCode`
  - `nullCode` changed to `allowNullErrorCode`
- Type validator for _phone_ strictly checks that the input is a _string_ or a _number_
  - Inputs of other types that would pass the regular expression are no longer allowed
  - Symbol() input no longer throws an error

## 4.1.0 (30 July 2018)

- `getParsed()` no longer returns parameters that were not valid
- `allowNull` no longer causes errors to be returned as an empty array

## 4.0.1 (30 July 2018)

- Added CHANGELOG
  - Moved "Breaking changes in version 3" section from README to CHANGELOG
  - Added breaking changes for version 4

## 4.0.0 (30 July 2018)

### Breaking changes

- `errors()` for types _array_ and _object_ now returns an object with nested properties instead of dot-separated string properties. Example illustrating changes:

```javascript
import expect from "@edgeguideab/expect";

expect(
  {
    foo: { type: "array", items: "number" },
    bar: { type: "object", keys: { buzz: "number" } },
  },
  { foo: [1, "2"], bar: { buzz: "3" } }
).errors(); // { foo: { '1': [ 'Expected parameter foo.1 to be of type number but it was "2"' ] }, bar: { buzz: [ 'Expected parameter bar.buzz to be of type number but it was "3"' ] } }
```

## 3.2.0 (26 July 2018)

- Support `items` option used in array to be a function returning validation schema
- Removed deprecated test files
- Removed explicitly thrown errors.
- Added type checking to ensure that `sanitize()` and `blockUnsafe()` receive strings.

## 3.1.5 (25 July 2018)

- Added `conditionErrorCode` option

## 3.1.4 (25 July 2018)

- Added example to README illustrating parse and condition priority.
- Switched parse and condition sections for readability
- Added test cases for any type
- Added test case for nested equalTo check

## 3.1.3 (24 July 2018)

- Added missing section in the content table for README

## 3.1.2 (24 July 2018)

- Fixed incorrect links in README

## 3.1.1 (24 July 2018)

- Switched table of contents to a mixed list

## 3.1.0 (24 July 2018)

- Added any type, matching all non-null data types
- Fixed nested equalTo
- Added content table to README

## 3.0.4 (23 July 2018)

- Minor README update

## 3.0.3 (23 July 2018)

- Recovered README. File had been removed in 3.0.2

## 3.0.2 (23 July 2018)

- Replaced gulp with prepublish npm scripts
- Updated npm packages

## 3.0.1 (23 July 2018)

- Added section for breaking changes in version 3 to README

## 3.0.0 (23 July 2018)

### Breaking changes

- The `strict` option has been removed
  - Default type validation is now "stricter". Use the `parse` option for more lenient validation
  - NOTE: `number` no longer allows string numbers by default (e.g. "123")
- `maxLength`, `minLength` and `regexp` options have been removed. Replaced by `condition`
- The customized `date` type no longer allows "Invalid Date" when using the `parse` option
