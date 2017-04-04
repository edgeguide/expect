describe('Expect package (errorCode):', () => {

  it('can handle several errors', () => {
    let expectModule = require('../src');
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
      test: ['not equal', 'missing parameter']
    });
  });


    it('can handle several matching errors', () => {
      let expectModule = require('../src');
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
        test: ['not equal', 'did not match', 'missing parameter']
      });
    });
});
