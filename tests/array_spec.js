describe('Expect package (array validation):', () => {

  it('tests for array type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: [1,2,3]
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that an empty array validates to true', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that an empty array does not validate to true in strict mode', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        strict: true
      }
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the emptyErrorCode ', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        strict: true,
        emptyErrorCode: 'emptyArray'
      }
    }, {
      test: []
    });

    expect(expectations.errors()).toEqual({
      test: ['emptyArray']
    });
  });

  it('tests that null is not a array', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a array', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a array', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not a array', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        allowNull: true
      }
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects the errorCode option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        errorCode: 'missing parameter'
      }
    }, {});

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });

  it('is not required if another field is null', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
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

  it('is required if another field is not undefined', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        requiredIf: 'foo'
      },
      foo: 'string'
    }, {
      foo: '123'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the nullCode option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        nullCode: 'missing parameter',
        errorCode: 'error'
      }
    }, {});

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });

  it('parses the actual value if the parse option is specified', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        parse: true
      }
    }, {
      test: '[1,2,3]'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('doesn\'t mutate the input value when parsing', () => {
    let testObject =  {
      test: '[1,2,3]'
    };
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        parse: true
      }
    }, testObject);

    expect(testObject.test).toEqual(jasmine.any(String));
    expect(testObject.test).toEqual('[1,2,3]');
  });

  it('correctly returns the parsed value', () => {
    let testObject =  {
      test: '[1,2,3]'
    };
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        parse: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: [1,2,3]
    });
  });

  it('returns the initial if no parsing is specified', () => {
    let testObject =  {
      test: [1,2,3]
    };
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array'
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: [1,2,3]
    });
  });

  it('doesn\'t destroy correct values when parsing', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        parse: true
      }
    }, {
      test: [1,2,3]
    });

    expect(expectations.getParsed()).toEqual({
      test: [1,2,3]
    });
  });

  it('can validate all items', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        items: 'number'
      }
    }, {
      test: [1,2,3]
    });

    expect(expectations.wereMet()).toEqual(true);
  });

  it('fails if some item is of the incorrect type', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        items: {
          type: 'number',
          strict: true
        }
      }
    }, {
      test: [1,2,'3']
    });

    expect(expectations.wereMet()).toEqual(false);
  });

  it('gives a proper error if some item is of the incorrect type', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        items: {
          type: 'number',
          strict: true
        }
      }
    }, {
      test: [1,2,'3']
    });

    expect(expectations.errors()).toEqual({
      'test.2': ['Expected parameter test.2 to be a number but it was "3"']
    });
  });

  it('respects the errorCode option for item validation', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        items: {
          type: 'number',
          strict: true,
          errorCode: 'incorrect.item.format'
        }
      }
    }, {
      test: [1,2,'3']
    });

    expect(expectations.errors()).toEqual({
      'test.2': ['incorrect.item.format']
    });
  });

  it('parses items', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        items: {
          type: 'date',
          strict: true,
          errorCode: 'incorrect.item.format',
          allowNull: true,
          parse: true
        }
      }
    }, {
      test: [1,2,'3']
    });

    expect(expectations.wereMet()).toEqual(true);
  });

  it('can allow items to be null', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'array',
        items: {
          type: 'date',
          strict: true,
          errorCode: 'incorrect.item.format',
          allowNull: true
        }
      }
    }, {
      test: ['2017-01-01', null, null]
    });

    expect(expectations.wereMet()).toEqual(true);
  });
});
