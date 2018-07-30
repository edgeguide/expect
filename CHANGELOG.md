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
const expect = require('@edgeguideab/expect');

expect(
  {
    foo: { type: 'array', items: 'number' },
    bar: { type: 'object', keys: { buzz: 'number' } }
  },
  { foo: [1, '2'], bar: { buzz: '3' } }
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
