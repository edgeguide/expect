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
  describe(`condition - type ${type}`, () => {
    it('option can be used', () => {
      const expectModule = require('../../src');
      expect(
        expectModule(
          { test: { type, condition: () => true } },
          { test: typesValues[type] }
        ).wereMet()
      ).toBe(true);

      expect(
        expectModule(
          { test: { type, condition: () => false } },
          { test: typesValues[type] }
        ).wereMet()
      ).toBe(false);
    });

    it('conditionErrorCode changes error message', () => {
      const expectModule = require('../../src');
      expect(
        expectModule(
          {
            test: { type, condition: () => false, conditionErrorCode: 'error' }
          },
          { test: typesValues[type] }
        ).errors()
      ).toEqual({ test: 'error' });
    });

    it('reject gracefully if condition throws error', () => {
      const expectModule = require('../../src');
      const expectationsFunc = () =>
        expectModule(
          {
            test: {
              type,
              condition: () => {
                throw new Error('fail');
              }
            }
          },
          { test: typesValues[type] }
        );
      expect(expectationsFunc).not.toThrow();
      expect(expectationsFunc().wereMet()).toBe(false);
    });

    it('lower priority than allowNull', () => {
      const expectModule = require('../../src');
      expect(
        expectModule(
          {
            test: {
              type,
              allowNull: true,
              condition: test => test !== null
            }
          },
          {}
        ).wereMet()
      ).toBe(true);
    });

    it('lower priority than requiredIf', () => {
      const expectModule = require('../../src');
      expect(
        expectModule(
          {
            test: {
              type,
              requiredIf: 'missing',
              condition: test => test !== null
            }
          },
          {}
        ).wereMet()
      ).toBe(true);
    });

    it('lower priority than parse', () => {
      const expectModule = require('../../src');
      const otherTypeValues = {
        any: 456,
        number: 654,
        boolean: false,
        string: 'bar',
        array: [4, 5, 6],
        object: { test: 'object' },
        date: new Date(1),
        phone: 948569845123466525,
        email: 'other@mydomain.cxx',
        identityNumber: '195501286149'
      };

      expect(
        expectModule(
          {
            test: {
              type,
              condition: test => test !== typesValues[type],
              parse: () => otherTypeValues[type]
            }
          },
          { test: typesValues[type] }
        ).wereMet()
      ).toBe(true);
    });

    it('conditionErrorCode has lower priority than allowNullErrorCode', () => {
      const expectModule = require('../../src');

      expect(
        expectModule(
          {
            test: {
              type,
              condition: () => false,
              conditionErrorCode: 'condition',
              allowNullErrorCode: 'allowNull'
            }
          },
          {}
        ).errors()
      ).toEqual({ test: 'allowNull' });
    });

    it('conditionErrorCode has lower priority than equalToErrorCode', () => {
      const expectModule = require('../../src');

      expect(
        expectModule(
          {
            test: {
              type,
              condition: () => false,
              equalTo: 'missing',
              conditionErrorCode: 'condition',
              equalToErrorCode: 'equalTo'
            }
          },
          { test: typesValues[type] }
        ).errors()
      ).toEqual({ test: 'equalTo' });
    });

    type !== 'any' &&
      it('conditionErrorCode has lower priority than type validation (errorCode)', () => {
        const expectModule = require('../../src');

        expect(
          expectModule(
            {
              test: {
                type,
                condition: () => false,
                conditionErrorCode: 'condition',
                errorCode: 'error'
              }
            },
            { test: Symbol() }
          ).errors()
        ).toEqual({ test: 'error' });
      });
  })
);