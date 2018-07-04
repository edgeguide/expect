describe('Expect package (string validation):', () => {
  it('tests for string type correctly', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'string'
      },
      {
        test: 'batman'
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not a string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'string'
      },
      {
        test: null
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'string'
      },
      {
        test: undefined
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an array is not a string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'string'
      },
      {
        test: []
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'string'
      },
      {
        test: {}
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not a string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'string'
      },
      {
        test: 1
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('empty string should not be a string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'string'
      },
      {
        test: ''
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          allowNull: true
        }
      },
      {
        test: null
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('a string should be counted as a string even if allowed to be null', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          allowNull: true
        }
      },
      {
        test: 'test'
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('empty string should be allowed with the allowNull options', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          allowNull: true
        }
      },
      {
        test: ''
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects the errorCode option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          errorCode: 'missing parameter'
        }
      },
      {}
    );

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });

  it('is not required if another field is null', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          requiredIf: 'foo'
        },
        foo: {
          type: 'string',
          allowNull: true
        }
      },
      {
        foo: ''
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('is not required if another field is null, even if matchers fail', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          requiredIf: 'foo',
          regexp: /^testfest$/
        },
        foo: {
          type: 'string',
          allowNull: true
        }
      },
      {
        foo: ''
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('is required if another field is not undefined', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          requiredIf: 'foo'
        },
        foo: 'string'
      },
      {
        foo: '123'
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the nullCode option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          nullCode: 'missing parameter',
          errorCode: 'error'
        }
      },
      {}
    );

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });

  it('parses numbers if the parse option is specified', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          parse: true
        }
      },
      {
        test: 1
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('parses dates if the parse option is specified', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          parse: true
        }
      },
      {
        test: new Date('2017-01-01')
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('parses arrays if the parse option is specified', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          parse: true
        }
      },
      {
        test: [1, 2, 3]
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('parses objects if the parse option is specified', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          parse: true
        }
      },
      {
        test: { foo: 'bar' }
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('parses booleans if the parse option is specified', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          parse: true
        }
      },
      {
        test: false
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it("doesn't mutate the input value when parsing", () => {
    const testObject = {
      test: 1337
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          parse: true
        }
      },
      testObject
    );

    expect(testObject.test).toEqual(jasmine.any(Number));
    expect(testObject.test).toEqual(testObject.test);
  });

  it('correctly returns the parsed value', () => {
    const testObject = {
      test: 1337
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          parse: true
        }
      },
      testObject
    );

    expect(expectations.getParsed()).toEqual({
      test: '1337'
    });
  });

  it('returns the initial if no parsing is specified', () => {
    const testObject = {
      test: '1337'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string'
        }
      },
      testObject
    );

    expect(expectations.getParsed()).toEqual({
      test: '1337'
    });
  });

  it('can parse null', () => {
    const testObject = {
      test: null
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          parse: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(true);
  });

  it("doesn't destroy correct values when parsing", () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          parse: true
        }
      },
      {
        test: 'hello world'
      }
    );

    expect(expectations.getParsed()).toEqual({
      test: 'hello world'
    });
  });

  it('fails to parse undefined', () => {
    const testObject = {
      test: undefined
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string'
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(false);
  });

  it('blocks unsafe input with the blockUnsafe flag', () => {
    const testObject = {
      test: '<div>I am unsafe</div>'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          blockUnsafe: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(false);
  });

  it('returns a correct error message when blocking unsafe characters', () => {
    const testObject = {
      test: '<div>I am unsafe</div>'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          blockUnsafe: true
        }
      },
      testObject
    );

    expect(expectations.errors()).toEqual({
      test: ['Parameter test contained unsafe, unescaped characters']
    });
  });

  it('allows safe input with the blockUnsafe flag', () => {
    const testObject = {
      test: 'I am so very safe'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          blockUnsafe: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(true);
  });

  it('allows some unsafe input with the blockUnsafe flag when not in strict mode', () => {
    const testObject = {
      test:
        'I am so very safe (Even though I contain some questionable characters)!'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          blockUnsafe: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(true);
  });

  it('blocks assitional unsafe input with the blockUnsafe flag when in strict mode', () => {
    const testObject = {
      test: "I am not exactly safe (though it's hard to evert be)!"
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          blockUnsafe: true,
          strictEntities: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(false);
  });

  it('allows some specified characters in strict mode', () => {
    const testObject = {
      test: 'This is not strictly safe, but whatever: foo@bar.xcc'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          blockUnsafe: true,
          strictEntities: true,
          allowed: ['@']
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(true);
  });

  it('allows several specified characters in strict mode', () => {
    const testObject = {
      test: 'This [should] get a pass even in strict mode (yay)'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          blockUnsafe: true,
          strictEntities: true,
          allowed: ['(', ')', '[', ']']
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(true);
  });

  it('blocks input even with several specified characters in strict mode', () => {
    const testObject = {
      test: 'This [should] NOT get a pass in strict mode (aaaww)'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          blockUnsafe: true,
          strictEntities: true,
          allowed: ['(', ')', '[']
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(false);
  });

  it('blocks input with surrogate pairs', () => {
    const testObject = {
      test: 'Some japanese characters (日本語) should be handled correctly'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          blockUnsafe: true,
          strictEntities: true,
          allowed: ['(', '[']
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(false);
  });

  it('sanitized strings and put them in the parsed field', () => {
    const testObject = {
      test: '<p>Sanitize this dangerous input</p>'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          sanitize: true
        }
      },
      testObject
    );

    expect(expectations.getParsed()).toEqual({
      test: '&lt;p&gt;Sanitize this dangerous input&lt;/p&gt;'
    });
  });

  it('does not sanitize non-strict characters when not in strict mode', () => {
    const testObject = {
      test: 'Skip this (not so) dangerous input!'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          sanitize: true
        }
      },
      testObject
    );

    expect(expectations.getParsed()).toEqual({
      test: 'Skip this (not so) dangerous input!'
    });
  });

  it('sanitized strings and put them in the parsed field', () => {
    const testObject = {
      test: '<p>Sanitize this dangerous input</p>'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          sanitize: true
        }
      },
      testObject
    );

    expect(expectations.getParsed()).toEqual({
      test: '&lt;p&gt;Sanitize this dangerous input&lt;/p&gt;'
    });
  });

  it('can still sanitize some characters when not in strict mode', () => {
    const testObject = {
      test: '<p>sanitize this</p>Skip this (not so) dangerous input!'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          sanitize: true
        }
      },
      testObject
    );

    expect(expectations.getParsed()).toEqual({
      test:
        '&lt;p&gt;sanitize this&lt;/p&gt;Skip this (not so) dangerous input!'
    });
  });

  it('can sanitize all characters when in strict mode', () => {
    const testObject = {
      test: '<p>sanitize this</p>Sanitize this (not so) dangerous input!'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          sanitize: true,
          strictEntities: true
        }
      },
      testObject
    );

    expect(expectations.getParsed()).toEqual({
      test:
        '&lt;p&gt;sanitize this&lt;/p&gt;Sanitize this &lpar;not so&rpar; dangerous input&excl;'
    });
  });

  it('can skip allowed characters when in strict mode', () => {
    const testObject = {
      test: '<p>sanitize this</p>Sanitize this (not so) dangerous input!'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          sanitize: true,
          strictEntities: true,
          allowed: ['(', ')']
        }
      },
      testObject
    );

    expect(expectations.getParsed()).toEqual({
      test:
        '&lt;p&gt;sanitize this&lt;/p&gt;Sanitize this (not so) dangerous input&excl;'
    });
  });

  it('does not destroy the original value when sanitizing', () => {
    const testObject = {
      test: '<p>sanitize this</p>Sanitize this (not so) dangerous input!'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          sanitize: true,
          strictEntities: true,
          allowed: ['(', ')']
        }
      },
      testObject
    );

    expect(testObject).toEqual({
      test: '<p>sanitize this</p>Sanitize this (not so) dangerous input!'
    });
  });

  it('does not destroy surrogate pairs when sanitizing', () => {
    const testObject = {
      test: 'Some japanese characters (日本語) should be handled correctly'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          sanitize: true,
          strictEntities: true
        }
      },
      testObject
    );

    expect(expectations.getParsed()).toEqual({
      test:
        'Some japanese characters &lpar;日本語&rpar; should be handled correctly'
    });
  });

  it('fails if a string contains non-alphanumeric characters (with the alphanumeric option)', () => {
    const testObject = {
      test: 'This should not pass!'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          alphanumeric: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('Accepts non-ascii characters with the alphanumeric option', () => {
    const testObject = {
      test: '日本語'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          alphanumeric: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('Accepts numbers with the alphanumeric option', () => {
    const testObject = {
      test: 'test123'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          alphanumeric: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('Blocks underscores with the alphanumeric option', () => {
    const testObject = {
      test: 'test_123'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          alphanumeric: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('condition lower priority than requiredIf', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'boolean',
          requiredIf: 'fest',
          condition: test => test !== null
        }
      },
      {}
    );
    expect(expectations.wereMet()).toEqual(true);
  });

  it('condition lower priority than allowNull', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'boolean',
          allowNull: true,
          condition: test => test !== null
        }
      },
      {}
    );
    expect(expectations.wereMet()).toEqual(true);
  });
});
