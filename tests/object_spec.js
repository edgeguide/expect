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
      test: ['missing parameter']
    });
  });

  it('is not required if another field is falsy', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'object',
        requiredIf: 'test'
      },
      foo: {
        type: 'string',
        allowNull: true
      }
    }, {
      foo: ''
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('is required if another field is not undefined', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'object',
        requiredIf: 'foo'
      },
      foo: 'string'
    }, {
      foo: '123'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the nullCode option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'object',
        nullCode: 'missing parameter',
        errorCode: 'error'
      }
    }, {});

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });
});
