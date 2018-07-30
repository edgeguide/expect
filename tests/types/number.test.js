describe('Expect package (number validation):', () => {
  it('accepts numbers', () => {
    const expectModule = require('../../src');
    const tests = [-1, 0, 1, Infinity, -Infinity];
    tests.forEach(test => {
      const expectations = expectModule({ test: 'number' }, { test });
      expect(expectations.wereMet()).toBe(true);
    });
  });

  it('rejects NaN', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'number' }, { test: NaN });
    expect(expectations.wereMet()).toBe(false);
  });

  it('rejects other data types', () => {
    const expectModule = require('../../src');
    const tests = [null, undefined, true, false, '', [], {}, Symbol()];
    tests.forEach(test => {
      const expectations = expectModule({ test: 'number' }, { test });
      expect(expectations.wereMet()).toBe(false);
    });
  });

  it('parse number type', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: 1 }
    );
    expect(expectations.getParsed()).toEqual({ test: 1 });
  });

  it('parse octal integer', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: 0o123 }
    );
    expect(expectations.getParsed()).toEqual({ test: 83 });
  });

  it('parse string octal integer', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '0o123' }
    );
    expect(expectations.getParsed()).toEqual({ test: 83 });
  });

  it('trim leading zeros if not valid octal integer', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '0123' }
    );
    expect(expectations.getParsed()).toEqual({ test: 123 });
  });

  it('parse string exponential number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '-1.23e-10' }
    );
    expect(expectations.getParsed()).toEqual({ test: -1.23e-10 });
  });

  it('parse "Infinity" as Infinity', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: 'Infinity' }
    );
    expect(expectations.getParsed()).toEqual({ test: Infinity });
  });

  it('parse "-Infinity" as -Infinity', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '-Infinity' }
    );
    expect(expectations.getParsed()).toEqual({ test: -Infinity });
  });

  it('parse explicitly positive string number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '+123' }
    );
    expect(expectations.getParsed()).toEqual({ test: 123 });
  });

  it('parse negative string number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '-123' }
    );
    expect(expectations.getParsed()).toEqual({ test: -123 });
  });

  it('parse "-0" as -0', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '-0' }
    );
    expect(expectations.getParsed()).toEqual({ test: -0 });
  });

  it('parse hexadecimal string starting with 0x', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '0x1' }
    );
    expect(expectations.getParsed()).toEqual({ test: 1 });
  });

  it('parse hexadecimal string starting with 0X', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '0X1' }
    );
    expect(expectations.getParsed()).toEqual({ test: 1 });
  });

  it('parse string number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '12300001' }
    );
    expect(expectations.getParsed()).toEqual({ test: 12300001 });
  });

  it('parse string decimal number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '1230.0001' }
    );
    expect(expectations.getParsed()).toEqual({ test: 1230.0001 });
  });

  it('reject parsing string number with multiple decimals', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '1.2.3' }
    );
    expect(expectations.wereMet()).toBe(false);
  });

  it('reject parsing string with non-alphanumeric characters', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '123~4' }
    );
    expect(expectations.wereMet()).toBe(false);
  });

  it('reject hexadecimal string not starting with 0x or 0X', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', parse: true } },
      { test: '123a' }
    );
    expect(expectations.wereMet()).toBe(false);
  });

  it('respects allowNull', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', allowNull: true } },
      { test: null }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects requiredIf', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'number',
          requiredIf: 'foo'
        },
        foo: {
          type: 'string',
          allowNull: true
        }
      },
      {
        foo: ''
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects errorCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', errorCode: 'error' } },
      {}
    );
    expect(expectations.errors()).toEqual({ test: ['error'] });
  });

  it('respects nullCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', nullCode: 'missing' } },
      {}
    );
    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });

  it('nullCode has higher priorty than errorCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', nullCode: 'missing', errorCode: 'error' } },
      {}
    );
    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });

  it('does not mutate the input value when parsing', () => {
    const testObject = { test: '1337' };
    const expectModule = require('../../src');
    expectModule({ test: { type: 'number', parse: true } }, testObject);
    expect(testObject.test).toEqual(jasmine.any(String));
    expect(testObject.test).toEqual(testObject.test);
  });

  it('returns the initial value if not parsing', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'number' }, { test: 1337 });
    expect(expectations.getParsed()).toEqual({ test: 1337 });
  });

  it('condition met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', condition: test => test > 0 } },
      { test: 1 }
    );
    expect(expectations.wereMet()).toBe(true);
  });

  it('condition not met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'number', condition: test => test > 0 } },
      { test: -1 }
    );
    expect(expectations.wereMet()).toBe(false);
  });

  it('reject gracefully if condition throws error', () => {
    const expectModule = require('../../src');
    const expectationsFunc = () =>
      expectModule(
        {
          test: {
            type: 'number',
            condition: () => {
              throw new Error('fail');
            }
          }
        },
        { test: 2 }
      );
    expect(expectationsFunc).not.toThrow();
    expect(expectationsFunc().wereMet()).toBe(false);
  });

  it('parse using a function', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'number',
          parse: test => (typeof test === 'number' ? test : 0)
        }
      },
      { test: 'invalid' }
    );
    expect(expectations.wereMet()).toBe(true);
  });

  it('fallback on initial value if parse function throws error', () => {
    const expectModule = require('../../src');
    const expectationsFunc = () =>
      expectModule(
        {
          test: {
            type: 'number',
            parse: () => {
              throw new Error('fail');
            }
          }
        },
        { test: 2 }
      );
    expect(expectationsFunc).not.toThrow();
    expect(expectationsFunc().wereMet()).toBe(true);
  });
});
