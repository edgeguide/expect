import expectModule = require('../../src');

const types: any = [
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

const typesValues: any = {
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

types.forEach((type: any) =>
  describe(`requiredIf - type ${type}`, () => {
    it('option can be used', () => {
      expect(
        expectModule({ test: { type } }, { existing: 'existing' }).wereMet()
      ).toBe(false);

      expect(
        expectModule(
          { test: { type, requiredIf: 'existing' } },
          { existing: 'existing' }
        ).wereMet()
      ).toBe(false);

      expect(
        expectModule(
          { test: { type, requiredIf: 'missing' } },
          { existing: null }
        ).wereMet()
      ).toBe(true);
    });

    it('ignores null values', () => {
      [null, undefined, ''].forEach(missing =>
        expect(
          expectModule(
            { test: { type, requiredIf: 'missing' } },
            { missing }
          ).wereMet()
        ).toBe(true)
      );
    });

    it('checks initial value before parse', () => {
      const expected = {
        test: { type, parse: () => typesValues[type], requiredIf: 'existing' }
      };
      expect(expectModule(expected, { existing: 123 }).wereMet()).toBe(false);
      expect(expectModule(expected, { existing: 123 }).getParsed()).toEqual({});

      expect(
        expectModule(expected, { test: Symbol(), existing: 123 }).wereMet()
      ).toBe(true);
      expect(
        expectModule(expected, { test: Symbol(), existing: 123 }).getParsed()
      ).toEqual({ test: typesValues[type] });
    });

    it('checks parsed value', () => {
      const expected = {
        test: { type, parse: () => null, requiredIf: 'missing' }
      };
      expect(
        expectModule(expected, { test: typesValues[type] }).wereMet()
      ).toBe(true);
      expect(
        expectModule(expected, { test: typesValues[type] }).getParsed()
      ).toEqual({ test: null });
    });

    it('does not check target parsed value', () => {
      const expected = {
        test: { type, requiredIf: 'existing' },
        existing: { type, allowNull: true, parse: () => typesValues[type] }
      };
      expect(expectModule(expected, {}).wereMet()).toBe(true);
      expect(expectModule(expected, {}).getParsed()).toEqual({
        existing: typesValues[type]
      });
    });

    it('parsed value is returned even if initial value is null', () => {
      expect(
        expectModule(
          {
            test: {
              type,
              parse: () => typesValues[type],
              requiredIf: 'missing'
            }
          },
          {}
        ).getParsed()
      ).toEqual({ test: typesValues[type] });
    });

    it('does not ignore falsy values (not null values)', () => {
      [0, NaN, false].forEach(existing =>
        expect(
          expectModule(
            { test: { type, requiredIf: 'existing' } },
            { existing }
          ).wereMet()
        ).toBe(false)
      );
    });

    it('has no effect if allowNull is true', () => {
      expect(
        expectModule(
          { test: { type, allowNull: true, requiredIf: 'existing' } },
          { existing: 'existing' }
        ).wereMet()
      ).toBe(true);
    });
  })
);
