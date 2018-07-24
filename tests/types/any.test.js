describe('Expect package (any validation):', () => {
  it('accepts non-null various data types', () => {
    const expectModule = require('../../src');
    const tests = [0, 1, false, true, 'test', NaN, Infinity, [], {}, Symbol()];
    tests.forEach(test => {
      const expectations = expectModule({ test: 'any' }, { test });
      expect(expectations.wereMet()).toBe(true);
    });
  });

  it('rejects null data types', () => {
    const expectModule = require('../../src');
    const tests = [null, undefined, ''];
    tests.forEach(test => {
      const expectations = expectModule({ test: 'any' }, { test });
      expect(expectations.wereMet()).toBe(false);
    });
  });

  it('respects allowNull', () => {
    const expectModule = require('../../src');
    const tests = [null, undefined, ''];
    tests.forEach(test => {
      const expectations = expectModule(
        { test: { type: 'any', allowNull: true } },
        { test }
      );
      expect(expectations.wereMet()).toBe(true);
    });
  });

  it('parse function can be used with any', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'any', parse: test => JSON.stringify(test) } },
      { test: 123 }
    );
    expect(expectations.getParsed()).toEqual({ test: '123' });
  });

  it('allowNull has higher priority than parse', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'any', allowNull: false, parse: () => 'test' } },
      { test: null }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects requiredIf', () => {
    const expectModule = require('../../src');

    const validExpectations = expectModule(
      {
        test: { type: 'any', requiredIf: 'foo' },
        foo: { type: 'string', allowNull: true }
      },
      {}
    );

    const invalidExpectations = expectModule(
      {
        test: { type: 'any', requiredIf: 'foo' },
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
      { test: { type: 'any', errorCode: 'error' } },
      {}
    );

    expect(expectations.errors()).toEqual({ test: ['error'] });
  });

  it('respects nullCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'any', nullCode: 'missing' } },
      {}
    );

    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });

  it('nullCode has higher priorty than errorCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'any', nullCode: 'missing', errorCode: 'error' } },
      {}
    );
    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });
});
