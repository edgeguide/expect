describe('Expect package (equality validation):', () => {

  it('tests a regexp correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'number',
        regexp: /\d/g
      },
      bar: 'number'
    }, {
      foo: 1,
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
});
