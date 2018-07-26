describe('Expect package (array validation):', () => {
  it('accepts boolean', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'array' }, { test: [1, 2, 3] });

    expect(expectations.wereMet()).toBe(true);
  });

  it('accepts empty array', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'array' }, { test: [] });

    expect(expectations.wereMet()).toBe(true);
  });

  it('rejects other data types', () => {
    const expectModule = require('../../src');
    const tests = [null, undefined, true, 1, NaN, Infinity, '', {}, Symbol()];
    tests.forEach(test => {
      const expectations = expectModule({ test: 'array' }, { test });
      expect(expectations.wereMet()).toBe(false);
    });
  });

  it('convert string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'array', convert: true } },
      { test: 'convertme' }
    );

    expect(expectations.wereMet()).toBe(true);
    expect(expectations.getParsed()).toEqual({ test: ['convertme'] });
  });

  it('respects allowNull', () => {
    const expectModule = require('../../src');
    const validExpectations = expectModule(
      { test: { type: 'array', allowNull: true } },
      { test: null }
    );

    const invalidExpectations = expectModule(
      { test: { type: 'array', allowNull: false } },
      { test: null }
    );

    expect(validExpectations.wereMet()).toBe(true);
    expect(invalidExpectations.wereMet()).toBe(false);
  });

  it('respects requiredIf', () => {
    const expectModule = require('../../src');
    const validExpectations = expectModule(
      {
        test: { type: 'array', requiredIf: 'foo' },
        foo: { type: 'string', allowNull: true }
      },
      {}
    );

    const invalidExpectations = expectModule(
      {
        test: { type: 'array', requiredIf: 'foo' },
        foo: { type: 'string', allowNull: true }
      },
      { foo: '123' }
    );

    expect(validExpectations.wereMet()).toBe(true);
    expect(invalidExpectations.wereMet()).toBe(false);
  });

  it('respects errorCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'array', errorCode: 'missing' } },
      {}
    );

    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });

  it('respects nullCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'array', nullCode: 'missing' } },
      {}
    );

    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });

  it('nullCode has higher priorty than errorCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', nullCode: 'missing', errorCode: 'error' } },
      {}
    );
    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });

  it('parse string array', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'array', parse: true } },
      { test: '[1,2,3]' }
    );

    expect(expectations.getParsed()).toEqual({ test: [1, 2, 3] });
  });

  it('does not mutate the input value when parsing', () => {
    const testObject = { test: '[1,2,3]' };
    const expectModule = require('../../src');
    expectModule({ test: { type: 'array', parse: true } }, testObject);

    expect(testObject.test).toEqual(jasmine.any(String));
    expect(testObject.test).toEqual('[1,2,3]');
  });

  it('returns the initial if no parsing is specified', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'array' }, { test: [1, 2, 3] });

    expect(expectations.getParsed()).toEqual({ test: [1, 2, 3] });
  });

  it('does not destroy correct values when parsing', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'array', parse: true } },
      { test: [1, 2, 3] }
    );

    expect(expectations.getParsed()).toEqual({ test: [1, 2, 3] });
  });

  it('can validate all items', () => {
    const expectModule = require('../../src');
    const expected = { test: { type: 'array', items: 'number' } };

    const validExpectations = expectModule(expected, { test: [1, 2, 3] });
    const invalidExpectations = expectModule(expected, { test: [1, 2, '3'] });

    expect(validExpectations.wereMet()).toBe(true);
    expect(invalidExpectations.wereMet()).toBe(false);
  });

  it('items function', () => {
    const expectModule = require('../../src');
    const expected = {
      test: {
        type: 'array',
        items: user => ({
          type: 'object',
          keys: user.isLoggedIn
            ? {
              username: 'string',
              password: 'string',
              isLoggedIn: { type: 'boolean', allowNull: true }
            }
            : {
              temporaryUuid: 'number',
              isLoggedIn: { type: 'boolean', allowNull: true }
            }
        })
      }
    };

    const validExpectations = expectModule(expected, {
      test: [
        { isLoggedIn: true, username: 'John', password: 'Snow' },
        { isLogged: false, temporaryUuid: 123 }
      ]
    });
    const invalidExpectations = expectModule(expected, {
      test: [
        { isLoggedIn: true, username: 'John', password: 'Snow' },
        { isLoggedIn: true, temporaryUuid: 123 }
      ]
    });

    expect(validExpectations.wereMet()).toBe(true);
    expect(invalidExpectations.wereMet()).toBe(false);
  });

  it('item validation error format', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'array', items: 'number' } },
      { test: [1, 2, '3'] }
    );

    expect(expectations.errors()).toEqual({
      'test.2': [
        'Expected parameter test.2 to be of type number but it was "3"'
      ]
    });
  });

  it('item validation respects errorCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'array',
          items: {
            type: 'number',
            errorCode: 'incorrect.item.format'
          }
        }
      },
      { test: [1, 2, '3'] }
    );

    expect(expectations.errors()).toEqual({
      'test.2': ['incorrect.item.format']
    });
  });

  it('parses items', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'array',
          items: {
            type: 'date',
            errorCode: 'incorrect.item.format',
            allowNull: true,
            parse: true
          }
        }
      },
      { test: [1, 2, '3'] }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('can allow items to be null', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'array',
          items: {
            type: 'date',
            errorCode: 'incorrect.item.format',
            allowNull: true
          }
        }
      },
      { test: ['2017-01-01', null, null] }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('condition met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'array', condition: test => test.length > 2 } },
      { test: [1, 2, 3] }
    );
    expect(expectations.wereMet()).toBe(true);
  });

  it('condition not met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'array', condition: test => test.length > 2 } },
      { test: [1, 2] }
    );
    expect(expectations.wereMet()).toBe(false);
  });
});
