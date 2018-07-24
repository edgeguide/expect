describe('equalTo option', () => {
  it('tests for equality with numbers correctly', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { foo: { type: 'number', equalTo: 'bar' }, bar: 'number' },
      { foo: 1, bar: 1 }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('nested equality', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: { type: 'object', keys: { buzz: 'string' } },
        bar: { type: 'string', equalTo: ['foo', 'buzz'] }
      },
      { foo: { buzz: 'abc' }, bar: 'cba' }
    );
    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that numbers and string types are not equal', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { foo: { type: 'number', equalTo: 'bar' }, bar: 'number' },
      { foo: 1, bar: '1' }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that numbers can be intepreted as dates', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: { type: 'date', parse: true, equalTo: 'bar' },
        bar: 'date'
      },
      { foo: 0, bar: new Date(0) }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that dates can be equal', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { foo: { type: 'date', equalTo: 'bar' }, bar: 'date' },
      {
        foo: new Date('2017-01-01'),
        bar: new Date('2017-01-01')
      }
    );
    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that dates can be unequal', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { foo: { type: 'date', equalTo: 'bar' }, bar: 'date' },
      {
        foo: new Date('2017-01-01'),
        bar: new Date('2017-01-02')
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a date can be equal to a date string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'date',
          equalTo: 'bar'
        },
        bar: 'string'
      },
      {
        foo: new Date('2017-01-01'),
        bar: '2017-01-01T00:00:00.000Z'
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a date can be equal a number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'date',
          equalTo: 'bar'
        },
        bar: 'number'
      },
      {
        foo: new Date('2017-01-01'),
        bar: 1483228800000
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a date can not equal an object', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'date',
          equalTo: 'bar'
        },
        bar: 'object'
      },
      {
        foo: new Date('2017-01-01'),
        bar: { date: new Date() }
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a date can not equal null', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'date',
          equalTo: 'bar'
        },
        bar: 'object'
      },
      {
        foo: new Date('2017-01-01'),
        bar: null
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a date can not equal undefined', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'date',
          equalTo: 'bar'
        },
        bar: 'object'
      },
      {
        foo: new Date('2017-01-01'),
        bar: undefined
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that 0 does not equal undefined', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'number',
          equalTo: 'bar'
        },
        bar: 'number'
      },
      {
        foo: 0,
        bar: undefined
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the errorCode option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'number',
          equalTo: 'bar',
          equalToErrorCode: 'unequality'
        },
        bar: 'number'
      },
      { foo: 0, bar: 1 }
    );

    expect(expectations.errors()).toEqual({ foo: ['unequality'] });
  });

  it('checks that a boolean and string are not equal', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'boolean',
          equalTo: 'bar',
          equalToErrorCode: 'unequality'
        },
        bar: { type: 'boolean', errorCode: 'error' }
      },
      { foo: true, bar: 'true' }
    );

    expect(expectations.errors()).toEqual({
      bar: ['error'],
      foo: ['unequality']
    });
  });

  it('checks that a boolean and string are equal if the string is parsed', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'boolean',
          equalTo: 'bar',
          equalToErrorCode: 'unequality'
        },
        bar: {
          type: 'boolean',
          parse: true,
          errorCode: 'error'
        }
      },
      {
        foo: true,
        bar: 'true'
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('can check equality in nested objects', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          nullCode: 'missing',
          errorCode: 'error',
          keys: {
            dead: {
              type: 'string',
              equalTo: ['foo', 'bar']
            },
            bar: {
              type: 'string'
            }
          }
        }
      },
      { foo: { dead: 'abc', bar: 'abc' } }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('can check for equality in objects contained in arrays', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'array',
          nullCode: 'missing',
          errorCode: 'error',
          items: {
            type: 'object',
            keys: {
              dead: { type: 'string', equalTo: ['foo', 0, 'bar'] },
              bar: 'string'
            }
          }
        }
      },
      { foo: [{ dead: 'abc', bar: 'abc' }] }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('compare parsed values', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: { type: 'boolean', parse: true, equalTo: 'bar' },
        bar: { type: 'boolean' }
      },
      { foo: 'true', bar: true }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('null not equal to undefined', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: { type: 'boolean', allowNull: true, equalTo: 'bar' },
        bar: { type: 'boolean', allowNull: true }
      },
      { foo: undefined, bar: null }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('can handle several errors', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'object',
          errorCode: 'invalid object',
          equalTo: 'foo',
          equalToErrorCode: 'not equal'
        },
        foo: 'string'
      },
      { test: 'test', foo: 'foo' }
    );

    expect(expectations.errors()).toEqual({
      test: ['invalid object', 'not equal']
    });
  });
});
