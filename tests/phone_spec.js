describe('Expect package (phone validation):', () => {

  it('tests for phone number type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'phone'
    }, {
      test: '0701113210'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a phone number with a country code is valid', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'phone'
    }, {
      test: '+46701a123210'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a invalid phone number is invalid', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'phone'
    }, {
      test: '0701a123210'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a phone number is valid in strict mode', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'phone',
        strict: true
      }
    }, {
      test: '0701113210'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not a phone number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'phone'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a phone number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'phone'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a array is not a phone number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'phone'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a digit is a phone number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'phone'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a number is a phone number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'phone'
    }, {
      test: 948569845123466525
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a float is not a phone number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'phone'
    }, {
      test: 13.1123
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'phone',
        allowNull: true
      }
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects the errorCode option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'phone',
        errorCode: 'missing parameter'
      }
    }, {});

    expect(expectations.errors()).toEqual({
      test: 'missing parameter'
    });
  });
});
