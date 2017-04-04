describe('Expect package (email validation):', () => {

  it('tests for email type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'email'
    }, {
      test: 'tester@mydomain.cxx'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that an invalid email is invalid', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'email'
    }, {
      test: 'testermydomain.cxx'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an email is invalid in strict mode', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'email',
        strict: true
      }
    }, {
      test: 'teste r@mydomain.cxx'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an email is valid in strict mode', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'email',
        strict: true
      }
    }, {
      test: 'tester@mydomain.cxx'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not an email', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'email'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not an email', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'email'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an array is not an email', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'email'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not an email', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'email'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'email',
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
        type: 'email',
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
        type: 'email',
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
        type: 'email',
        requiredIf: 'foo'
      },
      foo: 'string'
    }, {
      foo: '123'
    });

    expect(expectations.wereMet()).toBe(false);
  });
});
