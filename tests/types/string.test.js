describe('Expect package (string validation):', () => {
  it('accepts non-empty string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'string' }, { test: 'batman' });

    expect(expectations.wereMet()).toBe(true);
  });

  it('rejects empty string', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'string' }, { test: '' });
    expect(expectations.wereMet()).toBe(false);
  });

  it('rejects other data types', () => {
    const expectModule = require('../../src');
    const tests = [null, undefined, true, 1, NaN, Infinity, [], {}, Symbol()];
    tests.forEach(test => {
      const expectations = expectModule({ test: 'string' }, { test });
      expect(expectations.wereMet()).toBe(false);
    });
  });

  it('respects allowNull', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', allowNull: true } },
      {}
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('allowNull has higher priority than parse', () => {
    const expectModule = require('../../src');
    const validExpectations = expectModule(
      { foo: { type: 'string', allowNull: true, parse: true } },
      { foo: null }
    );
    const invalidExpectations = expectModule(
      { foo: { type: 'string', parse: true } },
      { foo: null }
    );

    expect(validExpectations.wereMet()).toBe(true);
    expect(validExpectations.getParsed()).toEqual({ foo: 'null' });

    expect(invalidExpectations.wereMet()).toBe(false);
    expect(invalidExpectations.getParsed()).toEqual({});
  });

  it('a string should be counted as a string even if allowed to be null', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', allowNull: true } },
      { test: 'test' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('empty string should be allowed with the allowNull options', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', allowNull: true } },
      { test: '' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects the errorCode option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', errorCode: 'missing' } },
      {}
    );

    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });

  it('respects requiredIf', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: { type: 'string', requiredIf: 'foo' },
        foo: { type: 'string', allowNull: true }
      },
      {}
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('nullCode has higher priority than errorCode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          nullCode: 'missing',
          errorCode: 'error'
        }
      },
      {}
    );

    expect(expectations.errors()).toEqual({ test: ['missing'] });
  });

  it('parse numbers', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', parse: true } },
      { test: 1 }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('parse dates', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', parse: true } },
      { test: new Date('2017-01-01') }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('parse arrays', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', parse: true } },
      { test: [1, 2, 3] }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('parse objects', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', parse: true } },
      { test: { foo: 'bar' } }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('parse booleans', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', parse: true } },
      { test: false }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('does not mutate the input value when parsing', () => {
    const testObject = { test: 1337 };
    const expectModule = require('../../src');
    expectModule({ test: { type: 'string', parse: true } }, testObject);

    expect(testObject.test).toEqual(jasmine.any(Number));
    expect(testObject.test).toEqual(testObject.test);
  });

  it('correctly returns the parsed value', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', parse: true } },
      { test: 1337 }
    );

    expect(expectations.getParsed()).toEqual({ test: '1337' });
  });

  it('returns the initial if no parsing is specified', () => {
    const testObject = { test: '1337' };
    const expectModule = require('../../src');
    const expectations = expectModule({ test: 'string' }, testObject);
    expect(expectations.getParsed()).toEqual(testObject);
  });

  it('parse null', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'string',
          allowNull: true,
          parse: true
        }
      },
      { test: null }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('does not destroy correct values when parsing', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', parse: true } },
      { test: 'hello world' }
    );

    expect(expectations.getParsed()).toEqual({ test: 'hello world' });
  });

  it('fails to parse undefined', () => {
    const expectModule = require('../../src');
    const expectations = expectModule({ test: { type: 'string' } }, {});

    expect(expectations.wereMet()).toBe(false);
  });

  it('blocks unsafe input with the blockUnsafe flag', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', blockUnsafe: true } },
      { test: '<div>I am unsafe</div>' }
    );
    expect(expectations.wereMet()).toBe(false);
  });

  it('returns a correct error message when blocking unsafe characters', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', blockUnsafe: true } },
      { test: '<div>I am unsafe</div>' }
    );

    expect(expectations.errors()).toEqual({
      test: ['Parameter test contained unsafe, unescaped characters']
    });
  });

  it('allows safe input with the blockUnsafe flag', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', blockUnsafe: true } },
      { test: 'I am so very safe' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('allows some unsafe input with the blockUnsafe flag when not in strict mode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', blockUnsafe: true } },
      { test: 'I am safe (though I contain some questionable characters)!' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('blocks assitional unsafe input with the blockUnsafe flag when in strict mode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'string', blockUnsafe: true, strictEntities: true } },
      { test: 'I am not exactly safe (though it is hard to ever be)!' }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('allows some specified characters in strict mode', () => {
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
      { test: 'This is not strictly safe, but whatever: foo@bar.xcc' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('allows several specified characters in strict mode', () => {
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
      { test: 'This [should] get a pass even in strict mode (yay)' }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('blocks input even with several specified characters in strict mode', () => {
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
      { test: 'This [should] NOT get a pass in strict mode (aaaww)' }
    );

    expect(expectations.wereMet()).toBe(false);
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

    expect(expectations.wereMet()).toBe(false);
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
    expectModule(
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
    expect(expectations.wereMet()).toBe(true);
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
    expect(expectations.wereMet()).toBe(true);
  });
});
