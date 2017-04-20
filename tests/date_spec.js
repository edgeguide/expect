describe('Expect package (date validation):', () => {

  it('tests for date type correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'date'
    }, {
      test: new Date()
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a correctly formatted string is a date', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'date'
    }, {
      test: '2017-01-01 23:59:59'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that an incorrectly formatted string is a not date', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'date'
    }, {
      test: '2017-01ab-01 23:59:59'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an empty array is not date', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'date'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that null is not a date', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'date'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a date', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'date'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that an object is not a date', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'date'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests a number is not a date', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'date'
    }, {
      test: 1
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'date',
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
        type: 'date',
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
        type: 'date',
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
        type: 'date',
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
        type: 'date',
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
        type: 'date',
        parse: true
      }
    }, {
      test: '2017-01-01'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('doesn\'t mutate the input value when parsing', () => {
    let testObject =  {
      test: new Date()
    };
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'date',
        parse: true
      }
    }, testObject);

    expect(testObject.test).toEqual(jasmine.any(Date));
    expect(testObject.test).toEqual(testObject.test);
  });

  it('correctly returns the parsed value', () => {
    let testObject =  {
      test: '2017-01-01'
    };
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'date',
        parse: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual({
      test: new Date('2017-01-01')
    });
  });

  it('returns the initial if no parsing is specified', () => {
    let testObject =  {
      test: new Date()
    };
    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'date'
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual(testObject);
  });


  it('doesn\'t destroy correct values when parsing', () => {
    let testObject =  {
      test: new Date()
    };

    let expectModule = require('../src');
    let expectations = expectModule({
      test: {
        type: 'date',
        parse: true
      }
    }, testObject);

    expect(expectations.getParsed()).toEqual(testObject);
  });
});
