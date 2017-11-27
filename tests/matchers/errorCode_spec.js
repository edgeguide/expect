describe('Expect package (errorCode):', () => {

  it('can handle several errors', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'object',
        errorCode: 'missing parameter',
        equalTo: 'foo',
        equalToErrorCode: 'not equal'
      },
      foo: 'string'
    }, {
      foo: 'test'
    });

    expect(expectations.errors()).toEqual({
      test: ['missing parameter', 'not equal']
    });
  });

  it('can handle several matching errors', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'object',
        errorCode: 'missing parameter',
        equalTo: 'foo',
        equalToErrorCode: 'not equal',
        regexp: /\d/g,
        regexpErrorCode: 'did not match'
      },
      foo: 'string'
    }, {
      foo: 'test'
    });

    expect(expectations.errors()).toEqual({
      test: ['missing parameter', 'not equal', 'did not match']
    });
  });
});
