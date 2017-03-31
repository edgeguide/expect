describe('Expect package (object validation):', () => {

  it('tests for object type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'object'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not an object', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'object'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not an object', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'object'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an array is not an object', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'object'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not an object', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'object'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'object',
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
        type: 'object',
        errorCode: 'missing parameter'
      }
    }, {});

    expect(expectations.errors()).toEqual({
      test: 'missing parameter'
    });
  });
});
