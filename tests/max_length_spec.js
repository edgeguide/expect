describe('Expect package (max length validation):', () => {

  it('tests for maxLength correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'string',
        maxLength: 5
      },
    }, {
      foo: 'hello world',
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('allows parameters to pass if the length was shorter than the maxLength', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'string',
        maxLength: 13
      },
    }, {
      foo: 'hello world',
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('allows parameters to pass if the length equal to the maxLength', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'string',
        maxLength: 11
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
        maxLength: 8
      },
    }, {
      foo: 'hello world',
    });

    expect(expectations.errors()).toEqual({
      foo: ['hello world was longer than 8 (it was 11)']
    });
  });

  it('respects the maxLengthErrorCode parameter', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'string',
        maxLength: 8,
        maxLengthErrorCode: 'lengthError'
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
        maxLength: 8,
        maxLengthErrorCode: 'lengthError'
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
        maxLength: 8,
        maxLengthErrorCode: 'lengthError'
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
        maxLength: 8,
        maxLengthErrorCode: 'lengthError'
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
        maxLength: 8,
        maxLengthErrorCode: 'lengthError'
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
        maxLength: 5,
        maxLengthErrorCode: 'lengthError',
        items: {
          type: 'string',
          errorCode: 'typeError'
        }
      },
    }, {
      foo: ['1','2','3','4','5','6',7,'8']
    });

    expect(expectations.errors()).toEqual({
      foo: ['lengthError'],
      'foo.6': ['typeError']
    });
  });
});

