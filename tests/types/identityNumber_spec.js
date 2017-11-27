describe('Expect package (identityNumber validation):', () => {

  it('tests for identityNumber type correctly', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: '550128-6149'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('an object is not an identity number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: {}
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('an array is not an identity number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('a number is not an identity number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: 5501286149
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('a boolean is not an identity number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: true
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('null is not an identity number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: null
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('undefined is not an identity number', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: undefined
    });

    expect(expectations.wereMet()).toBe(false);
  });


  it('allows identity numbers with a plus', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: '550128+6149'
    });

    expect(expectations.wereMet()).toBe(true);
  });


  it('allows identity numbers without a plus or minus', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: '5501286149'
    });

    expect(expectations.wereMet()).toBe(true);
  });


  it('rejects identity numbers which are too long', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: '55012861491'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('allows full 1900 years to be specified', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: '195501286149'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('allows full 2000 years to be specified', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: '200107212144'
    });

    expect(expectations.wereMet()).toBe(true);
  });

  it('rejects badly formatted identity number 1101286141', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: '1101286141'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('rejects badly formatted identity number 0101286149', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: '0101286149'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('rejects badly formatted identity number 1901286149', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: '1901286149'
    });

    expect(expectations.wereMet()).toBe(false);
  });

  it('acceptes identity number 0101286144', () => {
    let expectModule = require('../../src');
    let expectations = expectModule({
      test: 'identityNumber'
    }, {
      test: '0101286144'
    });

    expect(expectations.wereMet()).toBe(true);
  });
});
