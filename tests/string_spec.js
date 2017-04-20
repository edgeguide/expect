describe('Expect package (string validation):', () => {

  it('tests for string type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: 'batman'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an array is not a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('empty string should not be a string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'string'
    }, {
      test: ''
    });

    expect(expectations.wereMet()).toBe(false);
  });


  it('respects the allowNull option', () => {
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
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
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'string',
        parse: true
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(true);
  });

  it('doesn\'t destroy correct values when parsing', () => {
    let expectModule = require('../src');
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
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'string'
      }
    }, testObject);

    expect(expectations.wereMet()).toEqual(false);
  });
});
