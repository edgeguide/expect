describe('Expect package (date validation):', () => {
  it('accepts date', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'date' }, { test: new Date() });

    expect(expectations.wereMet()).toBe(true);
  });

  it('accepts string date', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: 'date' },
      { test: '2017-01-01 23:59:59' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('rejects other data types', () => {
    const expectModule = require('../../src');
    const tests = [null, undefined, true, 1, NaN, Infinity, [], {}, Symbol()];
    tests.forEach(test => {
      const expectations = expectModule({ test: 'date' }, { test });
      expect(expectations.wereMet()).toBe(false);
    });
  });

  it('rejects incorrectly formatted string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: 'date' },
      { test: '2017-01ab-01 23:59:59' }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects allowNull', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'date', allowNull: true } },
      { test: null }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects the errorCode option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'date', errorCode: 'missing' } },
      {}
    );

    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });

  it('respects requiredIf', () => {
    const expectModule = require('../../src');
    const validExpectations = expectModule(
      {
        test: { type: 'date', requiredIf: 'foo' },
        foo: { type: 'string', allowNull: true }
      },
      {}
    );

    const invalidExpectations = expectModule(
      {
        test: { type: 'date', requiredIf: 'foo' },
        foo: 'string'
      },
      { foo: '123' }
    );

    expect(validExpectations.wereMet()).toBe(true);
    expect(invalidExpectations.wereMet()).toBe(false);
  });

  it('nullCode has higher priority than errorCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'date',
          nullCode: 'missing',
          errorCode: 'error'
        }
      },
      {}
    );

    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });

  it('parse string date', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'date', parse: true } },
      { test: '2017-01-01' }
    );

    expect(expectations.getParsed()).toEqual({ test: new Date('2017-01-01') });
  });

  it('does not mutate the input value when parsing', () => {
    const testObject = { test: new Date() };
    const expectModule = require('../../src');
    expectModule({ test: { type: 'date', parse: true } }, testObject);

    expect(testObject.test).toEqual(jasmine.any(Date));
    expect(testObject.test).toEqual(testObject.test);
  });

  it('does not destroy correct values when parsing', () => {
    const testObject = { test: new Date() };
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'date', parse: true } },
      testObject
    );

    expect(expectations.getParsed()).toEqual(testObject);
  });

  it('condition met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'date', condition: test => test === '2018-01-01' } },
      { test: '2018-01-01' }
    );
    expect(expectations.wereMet()).toBe(true);
  });

  it('condition not met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'date', condition: test => test === '2018-01-01' } },
      { test: '2018-01-02' }
    );
    expect(expectations.wereMet()).toBe(false);
  });
});
