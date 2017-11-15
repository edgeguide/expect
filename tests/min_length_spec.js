describe('Expect package (min length validation):', () => {

  it('tests for minLength correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'string',
        minLength: 5
      },
    }, {
      foo: 'hello world',
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('prevents parameters to pass if the length was shorter than the minLength', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'string',
        minLength: 13
      },
    }, {
      foo: 'hello world',
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('allows parameters to pass if the length equal to the minLength', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'string',
        minLength: 11
      },
    }, {
      foo: 'hello world',
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('returns the correct error code if nothing else was specified', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'string',
        minLength: 12
      },
    }, {
      foo: 'hello world',
    });

    expect(expectations.errors()).toEqual({
      foo: ['hello world was shorter than 12 (it was 11)']
    });
  });

  it('respects the minLengthErrorCode parameter', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'string',
        minLength: 12,
        minLengthErrorCode: 'lengthError'
      },
    }, {
      foo: 'hello world',
    });

    expect(expectations.errors()).toEqual({
      foo: ['lengthError']
    });
  });

  it('fails numbers correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'number',
        minLength: 12,
        minLengthErrorCode: 'lengthError'
      },
    }, {
      foo: 123456789,
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('can pass numbers', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'number',
        minLength: 7,
        minLengthErrorCode: 'lengthError'
      },
    }, {
      foo: 12345678,
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('fails arrays correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'array',
        minLength: 11,
        minLengthErrorCode: 'lengthError'
      },
    }, {
      foo: [1,2,3,4,5,6,7,8,9],
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('can pass arrays', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'array',
        minLength: 8,
        minLengthErrorCode: 'lengthError'
      },
    }, {
      foo: [1,2,3,4,5,6,7,8]
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('can combine length errors with type errors for arrays', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'array',
        minLength: 5,
        minLengthErrorCode: 'lengthError',
        items: {
          type: 'string',
          errorCode: 'typeError'
        }
      },
    }, {
      foo: ['1',2,'3','4']
    });

    expect(expectations.errors()).toEqual({
      foo: ['lengthError'],
      'foo.1': ['typeError']
    });
  });
});
