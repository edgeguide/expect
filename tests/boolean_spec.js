describe('Expect package (boolean validation):', () => {

  it('tests for boolean type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: true
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that undefined is not a boolean', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is a boolean with the allowUndefined flag', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'boolean',
        allowUndefined: true
      }
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not a boolean', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a boolean', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not a boolean', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'boolean',
        allowNull: true
      }
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(true);
  });
});
