describe('Expect package (number validation):', () => {

  it('tests for number type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that NaN is not a number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: NaN
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that 0 is a number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: 0
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that Infinity is a number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: Infinity
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that an array is not a number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that null is not a number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        allowNull: true
      }
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('test that "1" is not a number with the strict option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        strict: true
      }
    }, {
      test: "1"
    });

    expect(expectations.wereMet()).toBe(false);
  });
});
