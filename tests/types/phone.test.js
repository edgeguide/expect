describe('Expect package (phone validation):', () => {
  it('phone number type correctly', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: 'phone' },
      { test: '0701113210' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('a phone number with a country code is valid', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: 'phone' },
      { test: '+46701a123210' }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('array containing valid phone number fails', () => {
    const expectModule = require('../../src');
    expect(
      expectModule({ test: 'phone' }, { test: '0701113210' }).wereMet()
    ).toBe(true);
    expect(
      expectModule({ test: 'phone' }, { test: ['0701113210'] }).wereMet()
    ).toBe(false);
  });

  it('Symbol input does not cause error', () => {
    const expectModule = require('../../src');
    expect(() =>
      expectModule({ test: 'phone' }, { test: Symbol() })
    ).not.toThrow();
  });

  it('a invalid phone number is invalid', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: 'phone' },
      { test: '0701a123210' }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('a phone number is valid in strict mode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'phone', strict: true } },
      { test: '0701113210' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('null is not a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'phone' }, { test: null });

    expect(expectations.wereMet()).toBe(false);
  });

  it('undefined is not a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'phone' }, {});

    expect(expectations.wereMet()).toBe(false);
  });

  it('a array is not a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'phone' }, { test: [] });

    expect(expectations.wereMet()).toBe(false);
  });

  it('a digit is a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'phone' }, { test: 1 });

    expect(expectations.wereMet()).toBe(true);
  });

  it('a number is a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: 'phone' },
      { test: 948569845123466525 }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('a float is not a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'phone' }, { test: 13.1123 });

    expect(expectations.wereMet()).toBe(false);
  });

  it('does not allow scary characters', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: 'phone' },
      { test: '<123 321 123' }
    );

    expect(expectations.wereMet()).toBe(false);
  });
});
