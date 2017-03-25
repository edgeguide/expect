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

  it('tests that an empty array is an array', () => {
    let expectModule = require('../src');
    let expectations = expectModule({
      test: 'array'
    }, {
      test: []
    });

    expect(expectations.wereMet()).toBe(true);
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
});
