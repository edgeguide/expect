describe('Expect package (array validation):', () => {

  it('tests for array type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: [1,2,3]
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that an empty array is an array', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not a array', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a array', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a array', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not a array', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
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
        type: 'array',
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
        type: 'array',
        requiredIf: 'foo'
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
        type: 'array',
        requiredIf: 'foo'
      },
      foo: 'string'
    }, {
      foo: '123'
    });

    expect(expectations.wereMet()).toBe(false);
  });
});
