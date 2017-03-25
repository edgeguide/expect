describe('Expect package (equality validation):', () => {

  it('tests for equality with numbers correctly', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'number',
        equalTo: 'bar'
      },
      bar: 'number'
    }, {
      foo: 1,
      bar: 1
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that numbers and string types are not equal', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'number',
        equalTo: 'bar'
      },
      bar: 'number'
    }, {
      foo: 1,
      bar: '1'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that dates can be equal', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'date',
        equalTo: 'bar'
      },
      bar: 'date'
    }, {
      foo: new Date('2017-01-01'),
      bar: new Date('2017-01-01')
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that dates can be unequal', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'date',
        equalTo: 'bar'
      },
      bar: 'date'
    }, {
      foo: new Date('2017-01-01'),
      bar: new Date('2017-01-02')
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a date can be equal to a date string', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'date',
        equalTo: 'bar'
      },
      bar: 'string'
    }, {
      foo: new Date('2017-01-01'),
      bar: '2017-01-01T00:00:00.000Z'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a date can be equal a number', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'date',
        equalTo: 'bar'
      },
      bar: 'number'
    }, {
      foo: new Date('2017-01-01'),
      bar: 1483228800000
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a date can not equal an object', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'date',
        equalTo: 'bar'
      },
      bar: 'object'
    }, {
      foo: new Date('2017-01-01'),
      bar: { date: new Date() }
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a date can not equal null', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'date',
        equalTo: 'bar'
      },
      bar: 'object'
    }, {
      foo: new Date('2017-01-01'),
      bar: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a date can not equal undefined', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'date',
        equalTo: 'bar'
      },
      bar: 'object'
    }, {
      foo: new Date('2017-01-01'),
      bar: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that 0 does not equal undefined', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      foo: {
        type: 'number',
        equalTo: 'bar'
      },
      bar: 'number'
    }, {
      foo: 0,
      bar: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });
});
