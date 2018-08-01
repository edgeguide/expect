const nullValues = [null, undefined, ''];

const types = [
  'any',
  'number',
  'boolean',
  'string',
  'array',
  'object',
  'date',
  'phone',
  'email',
  'identityNumber'
];

const typesValues = {
  any: 123,
  number: 321,
  boolean: true,
  string: 'test',
  array: [1, 2, 3],
  object: { test: 'test' },
  date: new Date(),
  phone: '0701113210',
  email: 'tester@mydomain.cxx',
  identityNumber: '550128-6149'
};

types.forEach(type =>
  describe(`allowNull - type ${type}`, () => {
    it('option can be used', () => {
      const expectModule = require('../../src');
      nullValues.forEach(test => {
        expect(
          expectModule({ test: { type, allowNull: false } }, { test }).wereMet()
        ).toBe(false);
        expect(
          expectModule({ test: { type, allowNull: true } }, { test }).wereMet()
        ).toBe(true);
      });
    });

    it('checks initial value before parse', () => {
      const expectModule = require('../../src');

      const expected = { test: { type, parse: () => typesValues[type] } };
      expect(expectModule(expected, {}).wereMet()).toBe(false);
      expect(expectModule(expected, {}).getParsed()).toEqual({});

      expect(expectModule(expected, { test: Symbol() }).wereMet()).toBe(true);
      expect(expectModule(expected, { test: Symbol() }).getParsed()).toEqual({
        test: typesValues[type]
      });
    });

    it('checks parsed value', () => {
      const expectModule = require('../../src');

      const expected = { test: { type, parse: () => null, allowNull: true } };
      expect(
        expectModule(expected, { test: typesValues[type] }).wereMet()
      ).toBe(true);
      expect(
        expectModule(expected, { test: typesValues[type] }).getParsed()
      ).toEqual({ test: null });
    });

    it('parsed value is returned even if intital value is null', () => {
      const expectModule = require('../../src');
      expect(
        expectModule(
          { test: { type, parse: () => typesValues[type], allowNull: true } },
          {}
        ).getParsed()
      ).toEqual({ test: typesValues[type] });
    });

    it('non-null values are ignored by allowNull', () => {
      const expectModule = require('../../src');
      expect(
        expectModule(
          { test: { type, parse: () => typesValues[type] } },
          { test: null }
        ).wereMet()
      ).toBe(false);

      [NaN, 0, false, 'null', {}, [], Symbol()].forEach(test =>
        expect(
          expectModule(
            { test: { type, parse: () => typesValues[type] } },
            { test }
          ).wereMet()
        ).toBe(true)
      );
    });

    it('allowNullErrorCode changes error message', () => {
      const expectModule = require('../../src');
      expect(
        expectModule(
          { test: { type, allowNullErrorCode: 'error' } },
          {}
        ).errors()
      ).toEqual({ test: 'error' });
    });

    it('allowNullErrorCode has higher priority than type validation (errorCode)', () => {
      const expectModule = require('../../src');
      nullValues.forEach(test =>
        expect(
          expectModule(
            { test: { type, allowNullErrorCode: 'error', errorCode: 'error' } },
            { test }
          ).errors()
        ).toEqual({ test: 'error' })
      );
    });
  })
);
