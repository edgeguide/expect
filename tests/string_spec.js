describe('Expect package (string validation):', () => {

  it('tests for string type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: 'batman'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an array is not a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        allowNull: true
      }
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(true);
  });
});
