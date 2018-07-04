describe('Expect package (email validation):', () => {
  it('tests for email type correctly', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'email'
      },
      {
        test: 'tester@mydomain.cxx'
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that an invalid email is invalid', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'email'
      },
      {
        test: 'testermydomain.cxx'
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an email is invalid in strict mode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          strict: true
        }
      },
      {
        test: 'teste r@mydomain.cxx'
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an email is valid in strict mode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          strict: true
        }
      },
      {
        test: 'tester@mydomain.cxx'
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not an email', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'email'
      },
      {
        test: null
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not an email', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'email'
      },
      {
        test: undefined
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an array is not an email', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'email'
      },
      {
        test: []
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not an email', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'email'
      },
      {
        test: 1
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          allowNull: true
        }
      },
      {
        test: null
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects the errorCode option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
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
          type: 'email',
          requiredIf: 'foo'
        },
        foo: {
          type: 'email',
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
          type: 'email',
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
          type: 'email',
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

  it('blocks unsafe input with the blockUnsafe flag', () => {
    const testObject = {
      test: 'hello@unsafeinput.<div>some html</div>'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          blockUnsafe: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(false);
  });

  it('returns a correct error message when blocking unsafe characters', () => {
    const testObject = {
      test: 'hello@unsafeinput.<div>some html</div>'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
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
      test: 'hello@safeinput.xcc'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          blockUnsafe: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(true);
  });

  it('always allows @ for the email type, even in strict mode', () => {
    const testObject = {
      test: 'hello@safeinput.xcc'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          blockUnsafe: true,
          strictEntities: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(true);
  });

  it('allows some unsafe input with the blockUnsafe flag when not in strict mode', () => {
    const testObject = {
      test: 'hello@(kind of)safe.xcc!'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          blockUnsafe: true
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(true);
  });

  it('blocks assitional unsafe input with the blockUnsafe flag when in strict mode', () => {
    const testObject = {
      test: 'hello@(kind of)safe.xcc!'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
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
      test: 'hello@(kind of)safe.xcc!'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          blockUnsafe: true,
          strictEntities: true,
          allowed: ['(', ')', '!']
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(true);
  });

  it('allows several specified characters in strict mode', () => {
    const testObject = {
      test: 'foo[should]@bar(yay).xcc'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
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
      test: 'foo[should]@bar(yay).xcc'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
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
      test: '日本語(japanese)@unsafe.xcc'
    };
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          blockUnsafe: true,
          strictEntities: true,
          allowed: ['(', '[']
        }
      },
      testObject
    );

    expect(expectations.wereMet()).toEqual(false);
  });

  it('condition met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          condition: test => typeof test === 'string' && test.startsWith('test')
        }
      },
      { test: 'test@test.com' }
    );
    expect(expectations.wereMet()).toEqual(true);
  });

  it('condition not met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'email',
          condition: test => typeof test === 'string' && test.startsWith('test')
        }
      },
      { test: 'fest@fest.com' }
    );
    expect(expectations.wereMet()).toEqual(false);
  });
});
