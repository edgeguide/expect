import expectModule = require('../../src');

const nullValues = [null, undefined, ''];

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
  describe(`allowNull - type ${type}`, () => {
    it('option can be used', () => {
      nullValues.forEach(test => {
        expect(
          expectModule({ test: { type, allowNull: false } }, { test }).wereMet()
        ).toBe(false);
        expect(
          expectModule(
            { test: { type, allowNull: () => false } },
            { test }
          ).wereMet()
        ).toBe(false);

        expect(
          expectModule({ test: { type, allowNull: true } }, { test }).wereMet()
        ).toBe(true);
        expect(
          expectModule(
            { test: { type, allowNull: () => true } },
            { test }
          ).wereMet()
        ).toBe(true);
      });
    });

    it('checks initial value before parse', () => {
      const expected = { test: { type, parse: () => typesValues[type] } };
      expect(expectModule(expected, {}).wereMet()).toBe(false);
      expect(expectModule(expected, {}).getParsed()).toEqual({});

      expect(expectModule(expected, { test: Symbol() }).wereMet()).toBe(true);
      expect(expectModule(expected, { test: Symbol() }).getParsed()).toEqual({
        test: typesValues[type]
      });
    });

    it('checks parsed value', () => {
      const expected = { test: { type, parse: () => null, allowNull: true } };
      expect(
        expectModule(expected, { test: typesValues[type] }).wereMet()
      ).toBe(true);
      expect(
        expectModule(expected, { test: typesValues[type] }).getParsed()
      ).toEqual({ test: null });
    });

    it('parsed value is returned even if intital value is null', () => {
      expect(
        expectModule(
          { test: { type, parse: () => typesValues[type], allowNull: true } },
          {}
        ).getParsed()
      ).toEqual({ test: typesValues[type] });
    });

    it('parsed value is not returned if undefined', () => {
      const parsed = expectModule(
        { test: { type, parse: () => undefined, allowNull: true } },
        {}
      ).getParsed();
      expect(parsed.hasOwnProperty('test')).toBe(false);
    });

    it('non-null values are ignored by allowNull', () => {
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
      expect(
        expectModule(
          { test: { type, allowNullErrorCode: 'error' } },
          {}
        ).errors()
      ).toEqual({ test: 'error' });
    });

    it('allowNullErrorCode has higher priority than type validation (errorCode)', () => {
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

it('does not throw', () => {
  expect(() =>
    expectModule(
      {
        test: {
          type: 'string',
          allowNull: () => {
            throw new Error();
          }
        }
      },
      {}
    )
  ).not.toThrow();
});

it('allowNull with invalid parse is ignored', () => {
  const expectations = expectModule(
    { test: { type: 'number', parse: () => 'test', allowNull: true } },
    {}
  );

  expect(expectations.wereMet()).toBe(true);
  expect(expectations.getParsed()).toEqual({});
});

it('nested parsed value is not returned if undefined', () => {
  const parsed = expectModule(
    {
      foo: {
        type: 'object',
        keys: { bar: { type: 'number', allowNull: true, parse: true } }
      }
    },
    { foo: {} }
  ).getParsed();
  expect(parsed.foo.hasOwnProperty('bar')).toBe(false);
});

it('allowNull with invalid parse behaves correctly with equalTo', () => {
  expect(
    expectModule(
      {
        foo: { type: 'string', allowNull: true, equalTo: 'bar' },
        bar: { type: 'string', allowNull: true, parse: () => 123 }
      },
      {}
    ).wereMet()
  ).toBe(true);
});
