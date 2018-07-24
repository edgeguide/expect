describe('Expect package (boolean validation):', () => {
  it('accepts boolean', () => {
    const expectModule = require('../../src');
    const tests = [true, false];
    tests.forEach(test => {
      const expectations = expectModule({ test: 'boolean' }, { test });
      expect(expectations.wereMet()).toBe(true);
    });
  });

  it('rejects other data types', () => {
    const expectModule = require('../../src');
    const tests = [null, undefined, 1, NaN, Infinity, '', [], {}, Symbol()];
    tests.forEach(test => {
      const expectations = expectModule({ test: 'boolean' }, { test });
      expect(expectations.wereMet()).toBe(false);
    });
  });

  it('parse boolean type', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', parse: true } },
      { test: true }
    );
    expect(expectations.getParsed()).toEqual({ test: true });
  });

  it('parse falsy values as false', () => {
    const expectModule = require('../../src');
    const tests = [0, NaN, undefined, null, false];
    tests.forEach(test => {
      const expectations = expectModule(
        { test: { type: 'boolean', parse: true, allowNull: true } },
        { test }
      );
      expect(expectations.getParsed()).toEqual({ test: false });
    });
  });

  it('parse JSON.parsed() falsy values as false', () => {
    const expectModule = require('../../src');
    const tests = ['0', 'null', 'false'];
    tests.forEach(test => {
      const expectations = expectModule(
        { test: { type: 'boolean', parse: true } },
        { test }
      );
      expect(expectations.getParsed()).toEqual({ test: false });
    });
  });

  it('parse "undefined" and "NaN" as false', () => {
    const expectModule = require('../../src');
    const tests = ['undefined', 'NaN'];
    tests.forEach(test => {
      const expectations = expectModule(
        { test: { type: 'boolean', parse: true } },
        { test }
      );
      expect(expectations.getParsed()).toEqual({ test: false });
    });
  });

  it('respects allowNull', () => {
    const expectModule = require('../../src');
    const validExpectations = expectModule(
      { test: { type: 'boolean', allowNull: true } },
      { test: null }
    );
    expect(validExpectations.wereMet()).toBe(true);

    const invalidExpectations = expectModule(
      { test: { type: 'boolean', allowNull: false } },
      { test: null }
    );
    expect(invalidExpectations.wereMet()).toBe(false);
  });

  it('allowNull has higher priority than parse', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', parse: true, allowNull: false } },
      { test: null }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects requiredIf', () => {
    const expectModule = require('../../src');

    const validExpectations = expectModule(
      {
        test: { type: 'boolean', requiredIf: 'foo' },
        foo: { type: 'string', allowNull: true }
      },
      {}
    );

    const invalidExpectations = expectModule(
      {
        test: { type: 'boolean', requiredIf: 'foo' },
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
      { test: { type: 'boolean', errorCode: 'error' } },
      { test: 'hello world' }
    );

    expect(expectations.errors()).toEqual({ test: ['error'] });
  });

  it('respects nullCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', nullCode: 'missing' } },
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

  it('parses the actual value if the parse option is specified', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: { type: 'boolean', parse: true }
      },
      { test: 'true' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('does not mutate the input value when parsing', () => {
    const testObject = { test: 'true' };
    const expectModule = require('../../src');
    expectModule({ test: { type: 'boolean', parse: true } }, testObject);

    expect(testObject.test).toEqual(jasmine.any(String));
    expect(testObject.test).toEqual('true');
  });

  it('correctly returns the parsed value', () => {
    const testObject = { test: 'true' };
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', parse: true } },
      testObject
    );

    expect(expectations.getParsed()).toEqual({ test: true });
  });

  it('correctly returns the parsed false value', () => {
    const testObject = { test: 'false' };
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', parse: true } },
      testObject
    );

    expect(expectations.getParsed()).toEqual({ test: false });
  });

  it('returns the initial if no parsing is specified', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'boolean' }, { test: true });

    expect(expectations.getParsed()).toEqual({ test: true });
  });

  it('does not destroy correct values when parsing', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', parse: true } },
      { test: true }
    );

    expect(expectations.getParsed()).toEqual({ test: true });
  });

  it('handles exceptions when parsing non-JSON values', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', allowNull: true, parse: true } },
      { test: undefined }
    );

    expect(expectations.getParsed()).toEqual({ test: false });
  });

  it('handles "true" as true if parse and allowNull options are used', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', parse: true, allowNull: true } },
      { test: 'true' }
    );
    expect(expectations.wereMet()).toBe(true);
    expect(expectations.getParsed()).toEqual({ test: true });
  });

  it('handles "false" as false if parse and allowNull options are used', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', parse: true, allowNull: true } },
      { test: 'false' }
    );
    expect(expectations.wereMet()).toBe(true);
    expect(expectations.getParsed()).toEqual({ test: false });
  });

  it('parsed "false" is handled as false in requiredIf', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: { type: 'boolean', parse: true },
        foo: { type: 'string', requiredIf: 'test' }
      },
      { test: 'false' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('parsed falsy values are handled as false in requiredIf', () => {
    const expectModule = require('../../src');
    const tests = [0, NaN, undefined, null, false];
    tests.forEach(test => {
      const expectations = expectModule(
        {
          test: { type: 'boolean', parse: true, allowNull: true },
          foo: { type: 'string', requiredIf: 'test' }
        },
        { test }
      );

      expect(expectations.wereMet()).toBe(true);
    });
  });

  it('non-parsed "false" is not handled as false as string in requiredIf', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'boolean',
        foo: { type: 'string', requiredIf: 'test' }
      },
      { test: 'false' }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('condition met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', condition: test => test === true } },
      { test: true }
    );
    expect(expectations.wereMet()).toBe(true);
  });

  it('condition not met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'boolean', condition: test => test === true } },
      { test: false }
    );
    expect(expectations.wereMet()).toBe(false);
  });
});
