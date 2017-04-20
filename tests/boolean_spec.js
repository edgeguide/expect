describe('Expect package (boolean validation):', () => {

  it('tests for boolean type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: true
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that undefined is a boolean', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that undefined is not a boolean with the strict flag', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'boolean',
        strict: true
      }
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that null is not a boolean', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a boolean', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not a boolean', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a string is not a boolean', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: 'foo'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests an array is not a boolean', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'boolean'
    }, {
      test: [1,2,3,4,5]
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'boolean',
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
        type: 'boolean',
        errorCode: 'missing parameter'
      }
    }, {
      test: 'hello world'
    });

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });

  it('is not required if another field is null', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'boolean',
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
        type: 'boolean',
        requiredIf: 'foo',
        strict: true
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
        type: 'boolean',
        nullCode: 'missing parameter',
        errorCode: 'error',
        strict: true
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
        type: 'boolean',
        parse: true
      }
    }, {
      test: 'true'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('doesn\'t mutate the input value when parsing', () => {
    let testObject =  {
      test: 'true'
    };
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'boolean',
        parse: true
      }
    }, testObject);

    expect(testObject.test).toEqual(jasmine.any(String));
    expect(testObject.test).toEqual('true');
  });

  it('correctly returns the parsed value', () => {
    let testObject =  {
      test: 'true'
    };
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'boolean',
        parse: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: true
    });
  });

  it('returns the initial if no parsing is specified', () => {
    let testObject =  {
      test: true
    };
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'boolean'
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: true
    });
  });

  it('doesn\'t destroy correct values when parsing', () => {

    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'boolean',
        parse: true
      }
    }, {
      test: true
    });

    expect(expectations.getParsed()).toEqual({
      test: true
    });
  });
});
