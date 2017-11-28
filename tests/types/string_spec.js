describe('Expect package (string validation):', () => {

  it('tests for string type correctly', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: 'batman'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not a string', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a string', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an array is not a string', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a string', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not a string', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('empty string should not be a string', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: ''
    });

    expect(expectations.wereMet()).toBe(false);
  });


  it('respects the allowNull option', () => {
    let expectModule = require('../../src');
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
    let expectModule = require('../../src');
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
    let expectModule = require('../../src');
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
    let expectModule = require('../../src');
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

  it('is not required if another field is null', () => {
    let expectModule = require('../../src');
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

  it('is not required if another field is null, even if matchers fail', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        requiredIf: 'foo',
        regexp: /^testfest$/
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
    let expectModule = require('../../src');
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
    let expectModule = require('../../src');
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

  it('parses numbers if the parse option is specified', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        parse: true
      }
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('parses dates if the parse option is specified', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        parse: true
      }
    }, {
      test: new Date('2017-01-01')
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('parses arrays if the parse option is specified', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        parse: true
      }
    }, {
      test: [1,2,3]
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('parses objects if the parse option is specified', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        parse: true
      }
    }, {
      test: { foo: 'bar' }
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('parses booleans if the parse option is specified', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        parse: true
      }
    }, {
      test: false
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('doesn\'t mutate the input value when parsing', () => {
    let testObject =  {
      test: 1337
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        parse: true
      }
    }, testObject);

    expect(testObject.test).toEqual(jasmine.any(Number));
    expect(testObject.test).toEqual(testObject.test);
  });

  it('correctly returns the parsed value', () => {
    let testObject =  {
      test: 1337
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        parse: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: '1337'
    });
  });

  it('returns the initial if no parsing is specified', () => {
    let testObject =  {
      test: '1337'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string'
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: '1337'
    });
  });

  it('can parse null', () => {
    let testObject =  {
      test: null
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        parse: true
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(true);
  });

  it('doesn\'t destroy correct values when parsing', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        parse: true
      }
    },{
      test: 'hello world'
    });

    expect(expectations.getParsed()).toEqual({
      test: 'hello world'
    });
  });

  it('fails to parse undefined', () => {
    let testObject =  {
      test: undefined
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string'
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(false);
  });


  it('blocks unsafe input with the blockUnsafe flag', () => {
    let testObject =  {
      test: '<div>I am unsafe</div>'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        blockUnsafe: true
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(false);
  });

  it('returns a correct error message when blocking unsafe characters', () => {
    let testObject =  {
      test: '<div>I am unsafe</div>'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        blockUnsafe: true
      }
    }, testObject);

    expect(expectations.errors()).toEqual({
      test: ['Parameter test contained unsafe, unescaped characters']
    });
  });

  it('allows safe input with the blockUnsafe flag', () => {
    let testObject =  {
      test: 'I am so very safe'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        blockUnsafe: true
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(true);
  });

  it('allows some unsafe input with the blockUnsafe flag when not in strict mode', () => {
    let testObject =  {
      test: 'I am so very safe (Even though I contain some questionable characters)!'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        blockUnsafe: true
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(true);
  });

  it('blocks assitional unsafe input with the blockUnsafe flag when in strict mode', () => {
    let testObject =  {
      test: 'I am not exactly safe (though it\'s hard to evert be)!'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        blockUnsafe: true,
        strictEntities: true
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(false);
  });

  it('allows some specified characters in strict mode', () => {
    let testObject =  {
      test: 'This is not strictly safe, but whatever: foo@bar.xcc'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        blockUnsafe: true,
        strictEntities: true,
        allowed: ['@']
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(true);
  });

  it('allows several specified characters in strict mode', () => {
    let testObject =  {
      test: 'This [should] get a pass even in strict mode (yay)'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        blockUnsafe: true,
        strictEntities: true,
        allowed: ['(', ')', '[', ']']
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(true);
  });

  it('blocks input even with several specified characters in strict mode', () => {
    let testObject =  {
      test: 'This [should] NOT get a pass in strict mode (aaaww)'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        blockUnsafe: true,
        strictEntities: true,
        allowed: ['(', ')', '[']
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(false);
  });

  it('blocks input with surrogate pairs', () => {
    let testObject =  {
      test: 'Some japanese characters (日本語) should be handled correctly'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        blockUnsafe: true,
        strictEntities: true,
        allowed: ['(', '[']
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(false);
  });

  it('sanitized strings and put them in the parsed field', () => {
    let testObject =  {
      test: '<p>Sanitize this dangerous input</p>'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        sanitize: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: '&lt;p&gt;Sanitize this dangerous input&lt;/p&gt;'
    });
  });

  it('does not sanitize non-strict characters when not in strict mode', () => {
    let testObject =  {
      test: 'Skip this (not so) dangerous input!'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        sanitize: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: 'Skip this (not so) dangerous input!'
    });
  });

  it('sanitized strings and put them in the parsed field', () => {
    let testObject =  {
      test: '<p>Sanitize this dangerous input</p>'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        sanitize: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: '&lt;p&gt;Sanitize this dangerous input&lt;/p&gt;'
    });
  });

  it('can still sanitize some characters when not in strict mode', () => {
    let testObject =  {
      test: '<p>sanitize this</p>Skip this (not so) dangerous input!'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        sanitize: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: '&lt;p&gt;sanitize this&lt;/p&gt;Skip this (not so) dangerous input!'
    });
  });

  it('can sanitize all characters when in strict mode', () => {
    let testObject =  {
      test: '<p>sanitize this</p>Sanitize this (not so) dangerous input!'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        sanitize: true,
        strictEntities: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: '&lt;p&gt;sanitize this&lt;/p&gt;Sanitize this &lpar;not so&rpar; dangerous input&excl;'
    });
  });

  it('can skip allowed characters when in strict mode', () => {
    let testObject =  {
      test: '<p>sanitize this</p>Sanitize this (not so) dangerous input!'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        sanitize: true,
        strictEntities: true,
        allowed: ['(', ')']
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: '&lt;p&gt;sanitize this&lt;/p&gt;Sanitize this (not so) dangerous input&excl;'
    });
  });

  it('does not destroy the original value when sanitizing', () => {
    let testObject =  {
      test: '<p>sanitize this</p>Sanitize this (not so) dangerous input!'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        sanitize: true,
        strictEntities: true,
        allowed: ['(', ')']
      }
    }, testObject);

    expect(testObject).toEqual({
      test: '<p>sanitize this</p>Sanitize this (not so) dangerous input!'
    });
  });

  it('does not destroy surrogate pairs when sanitizing', () => {
    let testObject =  {
      test: 'Some japanese characters (日本語) should be handled correctly'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        sanitize: true,
        strictEntities: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: 'Some japanese characters &lpar;日本語&rpar; should be handled correctly'
    });
  });


  it('fails if a string contains non-alphanumeric characters (with the alphanumeric option)', () => {
    let testObject =  {
      test: 'This should not pass!'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        alphanumeric: true
      }
    }, testObject);

    expect(expectations.wereMet()).toBe(false);
  });

  it('Accepts non-ascii characters with the alphanumeric option', () => {
    let testObject =  {
      test: '日本語'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        alphanumeric: true
      }
    }, testObject);

    expect(expectations.wereMet()).toBe(true);
  });

  it('Accepts numbers with the alphanumeric option', () => {
    let testObject =  {
      test: 'test123'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        alphanumeric: true
      }
    }, testObject);

    expect(expectations.wereMet()).toBe(true);
  });

  it('Blocks underscores with the alphanumeric option', () => {
    let testObject =  {
      test: 'test_123'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        alphanumeric: true
      }
    }, testObject);

    expect(expectations.wereMet()).toBe(false);
  });
});
