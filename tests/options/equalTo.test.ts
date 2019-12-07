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
  describe(`equalTo - type ${type}`, () => {
    it('equalToErrorCode has lower priority than allowNullErrorCode', () => {
      expect(
        expectModule(
          {
            foo: {
              type,
              equalTo: 'bar',
              allowNullErrorCode: 'allowNull',
              equalToErrorCode: 'equalTo'
            }
          },
          { foo: null, bar: 'bar' }
        ).errors()
      ).toEqual({
        foo: 'allowNull'
      });
    });

    it('higher priority than allowNull', () => {
      expect(
        expectModule(
          { foo: { type, allowNull: true, equalTo: 'bar' } },
          { foo: null, bar: 'test' }
        ).wereMet()
      ).toBe(false);
    });

    it('higher priority than requiredIf', () => {
      expect(
        expectModule(
          { foo: { type, requiredIf: 'buzz', equalTo: 'bar' } },
          { foo: null, bar: 'test' }
        ).wereMet()
      ).toBe(false);
    });

    it('lower priority than parse', () => {
      expect(
        expectModule(
          {
            foo: { type, parse: () => typesValues[type], equalTo: 'bar' },
            bar: { type }
          },
          { foo: 'test', bar: typesValues[type] }
        ).wereMet()
      ).toBe(true);

      expect(
        expectModule(
          {
            foo: { type, equalTo: 'bar' },
            bar: { type, parse: () => typesValues[type] }
          },
          { foo: typesValues[type], bar: 'test' }
        ).wereMet()
      ).toBe(true);
    });

    if (type !== 'any') {
      it('equalToErrorCode has lower priority than type validation (errorCode)', () => {
        expect(
          expectModule(
            {
              test: {
                type,
                equalTo: 'bar',
                equalToErrorCode: 'equalTo',
                errorCode: 'error'
              }
            },
            { test: Symbol() }
          ).errors()
        ).toEqual({ test: 'error' });
      });
    }
  })
);

describe('equalTo option', () => {
  it('number equality', () => {
    expect(
      expectModule(
        { foo: { type: 'number', equalTo: 'bar' }, bar: 'number' },
        { foo: 1, bar: 1 }
      ).wereMet()
    ).toBe(true);
  });

  it('object nested equality', () => {
    expect(
      expectModule(
        {
          foo: { type: 'object', keys: { buzz: 'string' } },
          bar: { type: 'string', equalTo: ['foo', 'buzz'] }
        },
        { foo: { buzz: 'abc' }, bar: 'cba' }
      ).wereMet()
    ).toBe(false);
  });

  it('numbers and string types are not equal', () => {
    expect(
      expectModule(
        { foo: { type: 'number', equalTo: 'bar' }, bar: 'number' },
        { foo: 1, bar: '1' }
      ).wereMet()
    ).toBe(false);
  });

  it('date equality', () => {
    expect(
      expectModule(
        { foo: { type: 'date', equalTo: 'bar' }, bar: 'date' },
        { foo: new Date('2017-01-01'), bar: new Date('2017-01-01') }
      ).wereMet()
    ).toBe(true);
  });

  it('date instances inequality', () => {
    expect(
      expectModule(
        { foo: { type: 'date', equalTo: 'bar' }, bar: 'date' },
        { foo: new Date('2017-01-01'), bar: new Date('2017-01-02') }
      ).wereMet()
    ).toBe(false);
  });

  it('date instance and string can be equal', () => {
    expect(
      expectModule(
        { foo: { type: 'date', equalTo: 'bar' }, bar: 'string' },
        { foo: new Date('2017-01-01'), bar: '2017-01-01T00:00:00.000Z' }
      ).wereMet()
    ).toBe(true);
  });

  it('date instance and number can be equal', () => {
    expect(
      expectModule(
        { foo: { type: 'date', equalTo: 'bar' }, bar: 'number' },
        { foo: new Date('2017-01-01'), bar: 1483228800000 }
      ).wereMet()
    ).toBe(true);
  });

  it('date instance and object are not equal', () => {
    expect(
      expectModule(
        { foo: { type: 'date', equalTo: 'bar' }, bar: 'object' },
        { foo: new Date('2017-01-01'), bar: { date: new Date() } }
      ).wereMet()
    ).toBe(false);
  });

  it('date instance and null values are not equal', () => {
    [null, undefined, ''].forEach(bar =>
      expect(
        expectModule(
          { foo: { type: 'date', equalTo: 'bar' } },
          { foo: new Date('2017-01-01'), bar }
        ).wereMet()
      ).toBe(false)
    );
  });

  it('falsy values are not equal', () => {
    const nullValues = [NaN, 0, false, '', null, undefined];
    nullValues.forEach((foo, i) =>
      nullValues.forEach(
        (bar, j) =>
          i !== j &&
          expect(
            expectModule(
              {
                foo: { type: 'any', allowNull: true, equalTo: 'bar' },
                bar: 'any'
              },
              { foo, bar }
            ).wereMet()
          ).toBe(false)
      )
    );
  });

  it('equalToErrorCode changes error message', () => {
    expect(
      expectModule(
        {
          foo: { type: 'number', equalTo: 'bar', equalToErrorCode: 'error' },
          bar: 'number'
        },
        { foo: 0, bar: 1 }
      ).errors()
    ).toEqual({ foo: 'error' });
  });

  it('checks that a boolean and string are not equal', () => {
    expect(
      expectModule(
        {
          foo: { type: 'boolean', equalTo: 'bar', equalToErrorCode: 'error' },
          bar: { type: 'string' }
        },
        { foo: true, bar: 'true' }
      ).errors()
    ).toEqual({ foo: 'error' });
  });

  it('checks that a boolean and string are equal if the string is parsed', () => {
    expect(
      expectModule(
        {
          foo: { type: 'boolean', equalTo: 'bar', equalToErrorCode: 'error' },
          bar: { type: 'boolean', parse: true }
        },
        { foo: true, bar: 'true' }
      ).wereMet()
    ).toBe(true);
  });

  it('can check equality in nested objects', () => {
    expect(
      expectModule(
        {
          foo: {
            type: 'object',
            allowNullErrorCode: 'missing',
            errorCode: 'error',
            keys: {
              dead: { type: 'string', equalTo: ['foo', 'bar'] },
              bar: { type: 'string' }
            }
          }
        },
        { foo: { dead: 'abc', bar: 'abc' } }
      ).wereMet()
    ).toBe(true);
  });

  it('can check for equality in objects contained in arrays', () => {
    expect(
      expectModule(
        {
          foo: {
            type: 'array',
            allowNullErrorCode: 'missing',
            errorCode: 'error',
            items: {
              type: 'object',
              keys: {
                dead: { type: 'string', equalTo: ['foo', '0', 'bar'] },
                bar: 'string'
              }
            }
          }
        },
        { foo: [{ dead: 'abc', bar: 'abc' }] }
      ).wereMet()
    ).toBe(true);
  });

  it('compare parsed values', () => {
    expect(
      expectModule(
        {
          foo: { type: 'boolean', parse: true, equalTo: 'bar' },
          bar: { type: 'boolean' }
        },
        { foo: 'true', bar: true }
      ).wereMet()
    ).toBe(true);
  });

  it('null not equal to undefined', () => {
    expect(
      expectModule(
        {
          foo: { type: 'boolean', allowNull: true, equalTo: 'bar' },
          bar: { type: 'boolean', allowNull: true }
        },
        { foo: undefined, bar: null }
      ).wereMet()
    ).toBe(false);
  });
});
