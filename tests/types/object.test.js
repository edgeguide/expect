describe('Expect package (object validation):', () => {
  it('tests for object type correctly', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'object'
      },
      {
        test: {}
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not an object', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'object'
      },
      {
        test: null
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not an object', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'object'
      },
      {
        test: undefined
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an array is not an object', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'object'
      },
      {
        test: []
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not an object', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'object'
      },
      {
        test: 1
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('validates object keys if given the keys option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          allowNullErrorCode: 'missing',
          errorCode: 'error',
          keys: {
            bar: { type: 'number', errorCode: 'invalid type' },
            fest: 'string'
          }
        }
      },
      { foo: { bar: 'testest', fest: 'festfest' } }
    );

    expect(expectations.errors()).toEqual({ foo: { bar: 'invalid type' } });
  });

  it('validates nested objects with the keys option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          allowNullErrorCode: 'missing',
          errorCode: 'error',
          keys: {
            dead: {
              type: 'object',
              keys: {
                beef: 'number'
              }
            },
            bar: 'string'
          }
        }
      },
      {
        foo: {
          dead: {
            beef: 'fail'
          },
          bar: 'festfest'
        }
      }
    );

    expect(expectations.errors()).toEqual({
      foo: {
        dead: {
          beef:
            'Expected parameter foo.dead.beef to be of type number but it was "fail"'
        }
      }
    });
  });

  it('validates nested objects with errors on several levels', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          allowNullErrorCode: 'missing',
          errorCode: 'error',
          keys: {
            dead: {
              type: 'object',
              keys: {
                beef: 'number'
              }
            },
            bar: 'string',
            bizz: 'number'
          }
        }
      },
      {
        foo: {
          dead: {
            beef: 'fail'
          },
          bar: 'festfest',
          bizz: '1a'
        }
      }
    );

    expect(expectations.errors()).toEqual({
      foo: {
        bizz:
          'Expected parameter foo.bizz to be of type number but it was "1a"',
        dead: {
          beef:
            'Expected parameter foo.dead.beef to be of type number but it was "fail"'
        }
      }
    });
  });

  it('validates an array with objects', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'array',
          allowNullErrorCode: 'missing',
          items: {
            type: 'object',
            keys: {
              dead: 'string',
              beef: 'number'
            }
          }
        }
      },
      {
        foo: [
          {
            dead: 'fed',
            beef: 1
          },
          {
            dead: 'fed',
            beef: 2
          },
          {
            dead: 'fed',
            beef: 3
          },
          {
            dead: 'fed',
            beef: 4
          },
          {
            dead: 'fed',
            beef: 5
          }
        ]
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('validates an array with objects where one is incorrect', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'array',
          allowNullErrorCode: 'missing',
          items: {
            type: 'object',
            keys: {
              dead: 'string',
              beef: 'number'
            }
          }
        }
      },
      {
        foo: [
          {
            dead: 'fed',
            beef: 1
          },
          {
            dead: 'fed',
            beef: 2
          },
          {
            dead: 'fed',
            beef: 'hello'
          },
          {
            dead: 'fed',
            beef: 4
          },
          {
            dead: 'fed',
            beef: 5
          }
        ]
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('prints out an error when validation an array with objects where one is incorrect', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'array',
          allowNullErrorCode: 'missing',
          items: {
            type: 'object',
            keys: {
              dead: 'string',
              beef: 'number'
            }
          }
        }
      },
      {
        foo: [
          {
            dead: 'fed',
            beef: 1
          },
          {
            dead: 'fed',
            beef: 2
          },
          {
            dead: 'fed',
            beef: 'hello'
          },
          {
            dead: 'fed',
            beef: 4
          },
          {
            dead: 'fed',
            beef: 5
          }
        ]
      }
    );

    expect(expectations.errors()).toEqual({
      foo: {
        2: {
          beef:
            'Expected parameter foo.2.beef to be of type number but it was "hello"'
        }
      }
    });
  });

  it('detects null for nested objects', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          allowNullErrorCode: 'missing',
          errorCode: 'error',
          keys: {
            dead: {
              type: 'object',
              keys: {
                beef: 'number'
              }
            },
            bar: 'string'
          }
        }
      },
      {
        foo: {
          dead: {
            beef: null
          },
          bar: 'festfest'
        }
      }
    );

    expect(expectations.errors()).toEqual({
      foo: {
        dead: {
          beef:
            'Expected parameter foo.dead.beef to be of type number but it was null'
        }
      }
    });
  });

  it('allows null for nested objects', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          allowNullErrorCode: 'missing',
          errorCode: 'error',
          keys: {
            dead: {
              type: 'object',
              keys: {
                beef: {
                  type: 'number',
                  allowNull: true
                }
              }
            },
            bar: 'string'
          }
        }
      },
      {
        foo: {
          dead: {
            beef: null
          },
          bar: 'festfest'
        }
      }
    );

    expect(expectations.errors()).toEqual({});
  });

  it('can parse values deep in a nested object', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          allowNullErrorCode: 'missing',
          errorCode: 'error',
          keys: {
            dead: {
              type: 'object',
              keys: {
                beef: {
                  type: 'boolean',
                  strict: true,
                  parse: true
                }
              }
            },
            bar: 'string'
          }
        }
      },
      {
        foo: {
          dead: {
            beef: 'true'
          },
          bar: 'festfest'
        }
      }
    );

    expect(expectations.errors()).toEqual({});
  });

  it('can parse values deep in a nested object', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          allowNullErrorCode: 'missing',
          errorCode: 'error',
          keys: {
            dead: {
              type: 'object',
              keys: {
                beef: {
                  type: 'boolean',
                  strict: true,
                  parse: true
                }
              }
            },
            bar: 'string'
          }
        }
      },
      {
        foo: {
          dead: {
            beef: 'true'
          },
          bar: 'festfest'
        }
      }
    );

    expect(expectations.errors()).toEqual({});
  });

  it('getParsed returns correct values for valid nested objects', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          keys: {
            dead: {
              type: 'object',
              keys: { beef: { type: 'boolean', parse: true } }
            },
            bar: { type: 'number', parse: true },
            bizz: { type: 'array', parse: true }
          }
        }
      },
      {
        foo: {
          dead: { beef: 'true' },
          bar: '1',
          bizz: '[1, 2, 3]'
        }
      }
    );

    expect(expectations.wereMet()).toBe(true);
    expect(expectations.getParsed()).toEqual({
      foo: {
        dead: { beef: true },
        bar: 1,
        bizz: [1, 2, 3]
      }
    });
  });

  it('errors for invalid nested objects', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          keys: {
            dead: {
              type: 'object',
              keys: { beef: 'boolean' }
            },
            bar: { type: 'string', allowNull: true },
            bizz: 'array'
          }
        }
      },
      {
        foo: {
          dead: { beef: 'true' },
          bar: '',
          bizz: [1, 2, 3]
        }
      }
    );

    expect(expectations.wereMet()).toBe(false);
    expect(expectations.getParsed()).toEqual({});
    expect(expectations.errors()).toEqual({
      foo: {
        dead: {
          beef:
            'Expected parameter foo.dead.beef to be of type boolean but it was "true"'
        }
      }
    });
  });

  it('fails if an object contains unused keys when the strictKeyCheck mode is enabled', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          strictKeyCheck: true,
          keys: {
            dead: {
              type: 'object',
              keys: {
                beef: {
                  type: 'boolean',
                  strict: true,
                  parse: true
                }
              }
            },
            bar: {
              type: 'number',
              parse: true
            },
            bizz: {
              type: 'array',
              parse: true
            }
          }
        }
      },
      {
        foo: {
          dead: {
            beef: 'true'
          },
          bar: '1',
          bizz: '[1,2,3,4,5]',
          buzz: '1337'
        }
      }
    );

    expect(expectations.wereMet()).toBe(false);
    expect(expectations.errors()).toEqual({
      foo: 'Object contained unchecked keys "buzz"'
    });
  });

  it('fails if a nested object contains unused keys when the strictKeyCheck mode is enabled', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          keys: {
            dead: {
              type: 'object',
              strictKeyCheck: true,
              keys: { beef: { type: 'boolean', parse: true } }
            },
            bar: { type: 'number', parse: true },
            bizz: { type: 'array', parse: true }
          }
        }
      },
      {
        foo: {
          dead: { beef: 'true', well: 'fed' },
          bar: '1',
          bizz: '[1,2,3,4,5]',
          buzz: '1337'
        }
      }
    );

    expect(expectations.wereMet()).toBe(false);
    expect(expectations.errors()).toEqual({
      foo: { dead: 'Object contained unchecked keys "well"' }
    });
  });

  it('passes if a nested object contains null keys when the strictKeyCheck mode is enabled', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          keys: {
            dead: {
              type: 'object',
              strictKeyCheck: true,
              keys: { beef: { type: 'boolean', allowNull: true, parse: true } }
            },
            bar: { type: 'number', parse: true },
            bizz: { type: 'array', parse: true }
          }
        }
      },
      {
        foo: {
          dead: { beef: null },
          bar: '1',
          bizz: '[1,2,3,4,5]',
          buzz: '1337'
        }
      }
    );

    expect(expectations.wereMet()).toBe(true);
    expect(expectations.errors()).toEqual({});
  });

  it('allows nested requiredIf statements ', () => {
    const expectModule = require('../../src');

    const expectations = expectModule(
      {
        foo: {
          type: 'object',
          keys: {
            dead: {
              type: 'object',
              strictKeyCheck: true,
              keys: {
                beef: {
                  type: 'boolean',
                  allowNull: true,
                  strict: true,
                  parse: true
                }
              }
            }
          }
        },
        bar: {
          type: 'number',
          parse: true,
          requiredIf: ['foo', 'dead', 'beef']
        }
      },
      { foo: { dead: { beef: null } }, bar: '' }
    );

    expect(expectations.wereMet()).toBe(true);
    expect(expectations.errors()).toEqual({});
  });

  it('does not throw error if nested requiredIf is missing ', () => {
    const expectModule = require('../../src');
    expect(() =>
      expectModule(
        { test: { type: 'string', requiredIf: ['foo', 'dead', 'beef'] } },
        {}
      )
    ).not.toThrow();
  });

  it('keys errors have higher priority than parent error', () => {
    const expectModule = require('../../src');
    expect(
      expectModule(
        {
          foo: {
            type: 'object',
            errorCode: 'foo error',
            condition: foo => Object.keys(foo) > 10,
            keys: {
              bar: { type: 'number', errorCode: 'bar error' }
            }
          }
        },
        { foo: { bar: '123' } }
      ).errors()
    ).toEqual({ foo: { bar: 'bar error' } });

    expect(
      expectModule(
        {
          foo: {
            type: 'object',
            errorCode: 'foo error',
            condition: foo => Object.keys(foo) > 10,
            keys: {
              bar: { type: 'number', errorCode: 'bar error' }
            }
          }
        },
        { foo: { bar: 123 } }
      ).errors()
    ).toEqual({ foo: 'foo error' });
  });
});
