describe('Expect package (object validation):', () => {

  it('tests for object type correctly', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'object'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not an object', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'object'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not an object', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'object'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an array is not an object', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'object'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not an object', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'object'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'object',
        allowNull: true
      }
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects the errorCode option', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'object',
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
        type: 'object',
        requiredIf: 'test'
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
        type: 'object',
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
        type: 'object',
        nullCode: 'missing parameter',
        errorCode: 'error'
      }
    }, {});

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });

  it('validates object keys if given the keys option', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      foo: {
        type: 'object',
        nullCode: 'missing parameter',
        errorCode: 'error',
        keys: {
          bar: {
            type: 'number',
            errorCode: 'invalid type'
          },
          fest: 'string'
        }
      }
    }, {
      foo: {
        bar: 'testest',
        fest: 'festfest'
      }
    });

    expect(expectations.errors()).toEqual({
      'foo.bar': ['invalid type']
    });
  });

  it('validates nested objects with the keys option', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      foo: {
        type: 'object',
        nullCode: 'missing parameter',
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
    }, {
      foo: {
        dead: {
          beef: 'fail'
        },
        bar: 'festfest'
      }
    });

    expect(expectations.errors()).toEqual({
      'foo.dead.beef': [
        'Expected parameter foo.dead.beef to be a number but it was "fail"'
      ]
    });
  });

  it('validates nested objects with errors on several levels', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      foo: {
        type: 'object',
        nullCode: 'missing parameter',
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
    }, {
      foo: {
        dead: {
          beef: 'fail'
        },
        bar: 'festfest',
        bizz: '1a'
      }
    });

    expect(expectations.errors()).toEqual({
      'foo.bizz': ['Expected parameter foo.bizz to be a number but it was "1a"'],
      'foo.dead.beef': [
        'Expected parameter foo.dead.beef to be a number but it was "fail"'
      ]
    });
  });

  it('validates an array with objects', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      foo: {
        type: 'array',
        nullCode: 'missing parameter',
        items: {
          type: 'object',
          keys: {
            dead: 'string',
            beef: 'number'
          }
        }
      }
    }, {
      foo: [{
        dead: 'fed',
        beef: 1
      }, {
        dead: 'fed',
        beef: 2
      }, {
        dead: 'fed',
        beef: 3
      }, {
        dead: 'fed',
        beef: 4
      }, {
        dead: 'fed',
        beef: 5
      }]
    });

    expect(expectations.wereMet()).toEqual(true);
  });

  it('validates an array with objects where one is incorrect', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      foo: {
        type: 'array',
        nullCode: 'missing parameter',
        items: {
          type: 'object',
          keys: {
            dead: 'string',
            beef: 'number'
          }
        }
      }
    }, {
      foo: [{
        dead: 'fed',
        beef: 1
      }, {
        dead: 'fed',
        beef: 2
      }, {
        dead: 'fed',
        beef: 'hello'
      }, {
        dead: 'fed',
        beef: 4
      }, {
        dead: 'fed',
        beef: 5
      }]
    });

    expect(expectations.wereMet()).toEqual(false);
  });

  it('prints out an error when validation an array with objects where one is incorrect', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      foo: {
        type: 'array',
        nullCode: 'missing parameter',
        items: {
          type: 'object',
          keys: {
            dead: 'string',
            beef: 'number'
          }
        }
      }
    }, {
      foo: [{
        dead: 'fed',
        beef: 1
      }, {
        dead: 'fed',
        beef: 2
      }, {
        dead: 'fed',
        beef: 'hello'
      }, {
        dead: 'fed',
        beef: 4
      }, {
        dead: 'fed',
        beef: 5
      }]
    });

    expect(expectations.errors()).toEqual({
      'foo.2.beef': [
        'Expected parameter foo.2.beef to be a number but it was "hello"'
      ]
    });
  });

  it('detects null for nested objects', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      foo: {
        type: 'object',
        nullCode: 'missing parameter',
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
    }, {
      foo: {
        dead: {
          beef: null
        },
        bar: 'festfest'
      }
    });
  
    expect(expectations.errors()).toEqual({
      'foo.dead.beef': ['Expected parameter foo.dead.beef to be a number but it was null']
    });
  });
  
  it('allows null for nested objects', () => {
    let expectModule = require('../../src');
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
                type: 'number',
                allowNull: true
              }
            }
          },
          bar: 'string'
        }
      }
    }, {
      foo: {
        dead: {
          beef: null
        },
        bar: 'festfest'
      }
    });
  
    expect(expectations.errors()).toEqual({});
  });
  
  it('can parse values deep in a nested object', () => {
    let expectModule = require('../../src');
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
                type: 'boolean',
                strict: true,
                parse: true
              }
            }
          },
          bar: 'string'
        }
      }
    }, {
      foo: {
        dead: {
          beef: 'true'
        },
        bar: 'festfest'
      }
    });
  
    expect(expectations.errors()).toEqual({});
  });
  
  it('can parse values deep in a nested object', () => {
    let expectModule = require('../../src');
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
                type: 'boolean',
                strict: true,
                parse: true
              }
            }
          },
          bar: 'string'
        }
      }
    }, {
      foo: {
        dead: {
          beef: 'true'
        },
        bar: 'festfest'
      }
    });
  
    expect(expectations.errors()).toEqual({});
  });
  
  it('getParsed returns correct values for nested objects', () => {
    let expectModule = require('../../src');
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
    }, {
      foo: {
        dead: {
          beef: 'true'
        },
        bar: '1',
        bizz: '[1,2,3,4,5]'
      }
    });
  
    expect(expectations.wereMet()).toBe(true);
    expect(expectations.getParsed()).toEqual({
      foo: {
        dead: {
          beef: true
        },
        bar: 1,
        bizz: [1,2,3,4,5]
      }
    });
  });
  
  it('fails if an object contains unused keys when the strictKeyCheck mode is enabled', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
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
    }, {
      foo: {
        dead: {
          beef: 'true'
        },
        bar: '1',
        bizz: '[1,2,3,4,5]',
        buzz: '1337'
      }
    });
  
    expect(expectations.wereMet()).toBe(false);
    expect(expectations.errors()).toEqual({
      foo: ['Object contained unchecked keys "buzz"']
    });
  });
  
  it('fails if a nested object contains unused keys when the strictKeyCheck mode is enabled', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      foo: {
        type: 'object',
        keys: {
          dead: {
            type: 'object',
            strictKeyCheck: true,
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
    }, {
      foo: {
        dead: {
          beef: 'true',
          well: 'fed'
        },
        bar: '1',
        bizz: '[1,2,3,4,5]',
        buzz: '1337'
      }
    });
  
    expect(expectations.wereMet()).toBe(false);
    expect(expectations.errors()).toEqual({
      'foo.dead': ['Object contained unchecked keys "well"']
    });
  });
  
  it('passes if a nested object contains null keys when the strictKeyCheck mode is enabled', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
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
    }, {
      foo: {
        dead: {
          beef: null
        },
        bar: '1',
        bizz: '[1,2,3,4,5]',
        buzz: '1337'
      }
    });
  
    expect(expectations.wereMet()).toBe(true);
    expect(expectations.errors()).toEqual({});
  });

  it('allows nested requiredIf statements ', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
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
          },
        }
      },
      bar: {
        type: 'number',
        parse: true,
        requiredIf: ['foo', 'dead', 'beef']
      }
    }, {
      foo: {
        dead: {
          beef: null
        },
        bar: '',
      }
    });
  
    expect(expectations.wereMet()).toBe(true);
    expect(expectations.errors()).toEqual({});
  });
});  


