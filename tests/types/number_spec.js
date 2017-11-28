describe('Expect package (number validation):', () => {

  it('tests for number type correctly', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that NaN is not a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: NaN
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that NaN is not a number in strict mode', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        strict: true
      }
    }, {
      test: NaN
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that 0 is a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: 0
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that 12300001 is a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: 12300001
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that "12300001" is a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: '12300001'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that "1230 0001" is not a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: '1230 0001'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that "1230 0001" is a number with the parse option', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        parse: true
      }
    }, {
      test: '1230 0001'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that the parsed "1230 0001" is 12300001', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        parse: true
      }
    }, {
      test: '1230 0001'
    });

    expect(expectations.getParsed().test).toBe(12300001);
  });

  it('tests that "1230.0001" is a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: '1230.0001'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that "1230.0001" is a number with the parse option', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        parse: true
      }
    }, {
      test: '1230.0001'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that the parsed "1230.0001" is 1230.0001', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        parse: true
      }
    }, {
      test: '1230.0001'
    });

    expect(expectations.getParsed().test).toBe(1230.0001);
  });

  it('tests that Infinity is a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: Infinity
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that an array is not a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that null is not a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a string with non-numerical characters is not a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: 'foo~~ bar'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a string containing non-numerical characters is not a number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'number'
    }, {
      test: '123a'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        allowNull: true
      }
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('test that "1" is not a number with the strict option', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        strict: true
      }
    }, {
      test: "1"
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the errorCode option', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
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
        type: 'number',
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
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
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
        type: 'number',
        nullCode: 'missing parameter',
        errorCode: 'error'
      }
    }, {});

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });

  it('parses the actual value if the parse option is specified', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        parse: true
      }
    }, {
      test: '1'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('doesn\'t mutate the input value when parsing', () => {
    let testObject =  {
      test: '1337'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        parse: true
      }
    }, testObject);

    expect(testObject.test).toEqual(jasmine.any(String));
    expect(testObject.test).toEqual(testObject.test);
  });

  it('correctly returns the parsed value', () => {
    let testObject =  {
      test: '1337'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        parse: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: 1337
    });
  });

  it('correctly returns the parsed falsy value', () => {
    let testObject =  {
      test: '0'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        parse: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: 0
    });
  });

  it('returns the initial if no parsing is specified', () => {
    let testObject =  {
      test: '1337'
    };
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'date'
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: '1337'
    });
  });


  it('doesn\'t destroy correct values when parsing', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: {
        type: 'number',
        parse: true
      }
    },{
      test: 1
    });

    expect(expectations.getParsed()).toEqual({
      test: 1
    });
  });
});