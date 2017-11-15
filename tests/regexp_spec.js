describe('Expect package (equality validation):', () => {

  it('tests a regexp correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'string',
        regexp: /\d[a-z]/g
      },
      bar: 'number'
    }, {
      foo: '1a',
      bar: 1
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('fails a regexp correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'number',
        regexp: /[a-z]/g
      },
      bar: 'number'
    }, {
      foo: 1,
      bar: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the error code parameter', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'number',
        regexp: /[a-z]/g,
        regexpErrorCode: 'did not match'
      },
      bar: 'number'
    }, {
      foo: 1,
      bar: 1
    });

    expect(expectations.errors()).toEqual({
      foo: ['did not match']
    });
  });

  it('does not fail if the allow null option is specified', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'phone',
        allowNull: true,
        regexp: /^\D?[\d\s\(\)-]*$/,
        regexpErrorCode: 'did not match'
      }
    }, {
      foo: ''
    });

    expect(expectations.wereMet()).toEqual(true);
  });

  it('fails if the allow null option is not specified', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'phone',
        regexp: /^\D?[\d\s\(\)-]*$/,
        regexpErrorCode: 'did not match'
      }
    }, {
      foo: ''
    });

    expect(expectations.wereMet()).toEqual(false);
  });
});

it('validates nested objects', () => {
  let expectModule = require('../src');
  let expectations = expectModule({
    foo: {
      type: 'array',
      keys: {
        dead: {
          type: 'object',
          keys: {
            beef: {
              type: 'string',
              regexp: /abc/
            }
          }
        }
      }
    }
  }, {
    foo: [{
      dead: {
        beef: 'abc'
      }
    }]
  });

  expect(expectations.wereMet()).toBe(true);
});

it('validates nested objects with errors on several levels', () => {
  let expectModule = require('../src');
  let expectations = expectModule({
    foo: {
      type: 'object',
      nullCode: 'missing parameter',
      errorCode: 'error',
      keys: {
        dead: {
          type: 'object',
          keys: {
            beef: {
              type: 'string',
              regexp: /^\d+$/
            }
          }
        },
        bar: 'string',
      }
    }
  }, {
    foo: {
      dead: {
        beef: 'fail'
      },
      bar: 'festfest',
    }
  });

  expect(expectations.errors()).toEqual({
    'foo.dead.beef': ['fail did not match the regexp /^\\d+$/']
  });
});