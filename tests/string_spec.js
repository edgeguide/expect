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

  it('empty string should not be a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: ''
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

  it('a string should be counted as a string even if allowed to be null', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        allowNull: true
      }
    }, {
      test: "test"
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('empty string should be allowed with the allowNull options', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        allowNull: true
      }
    }, {
      test: ''
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects the errorCode option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'string',
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
        type: 'string',
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
        type: 'string',
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
        type: 'string',
        nullCode: 'missing parameter',
        errorCode: 'error'
      }
    }, {});

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });
});
