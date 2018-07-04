describe('Expect package (phone validation):', () => {
  it('tests for phone number type correctly', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'phone'
      },
      {
        test: '0701113210'
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a phone number with a country code is valid', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'phone'
      },
      {
        test: '+46701a123210'
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a invalid phone number is invalid', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'phone'
      },
      {
        test: '0701a123210'
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a phone number is valid in strict mode', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'phone',
          strict: true
        }
      },
      {
        test: '0701113210'
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that null is not a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'phone'
      },
      {
        test: null
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that undefined is not a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'phone'
      },
      {
        test: undefined
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a array is not a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'phone'
      },
      {
        test: []
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('tests that a digit is a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'phone'
      },
      {
        test: 1
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a number is a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'phone'
      },
      {
        test: 948569845123466525
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('tests that a float is not a phone number', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: 'phone'
      },
      {
        test: 13.1123
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the allowNull option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'phone',
          allowNull: true
        }
      },
      {
        test: null
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('respects the errorCode option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'phone',
          errorCode: 'missing parameter'
        }
      },
      {}
    );

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });

  it('not required if function evaluates to falsy', () => {
    const expectModule = require('../../src');
    expect(
      expectModule(
        { test: { type: 'phone', requiredIf: () => 0 } },
        {}
      ).wereMet()
    ).toBe(true);
  });

  it('required if function evaluates to truthy', () => {
    const expectModule = require('../../src');
    expect(
      expectModule(
        { test: { type: 'phone', requiredIf: () => 1 } },
        {}
      ).wereMet()
    ).toBe(false);

    expect(
      expectModule(
        { test: { type: 'phone', requiredIf: () => 1 } },
        { test: '0701113210' }
      ).wereMet()
    ).toBe(true);
  });

  it('is not required if another field is null', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'phone',
          requiredIf: 'foo'
        },
        foo: {
          type: 'string',
          allowNull: true
        }
      },
      {
        foo: ''
      }
    );

    expect(expectations.wereMet()).toBe(true);
  });

  it('is required if another field is not undefined', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'phone',
          requiredIf: 'foo'
        },
        foo: 'string'
      },
      {
        foo: '123'
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('respects the nullCode option', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'phone',
          nullCode: 'missing parameter',
          errorCode: 'error'
        }
      },
      {}
    );

    expect(expectations.errors()).toEqual({
      test: ['missing parameter']
    });
  });

  it('does not allow scary characters', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      {
        test: {
          type: 'phone'
        }
      },
      {
        test: '<123 321 123'
      }
    );

    expect(expectations.wereMet()).toBe(false);
  });

  it('condition met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'phone', condition: test => /^\+46\d+/.test(test) } },
      { test: '+46701113210' }
    );
    expect(expectations.wereMet()).toEqual(true);
  });

  it('condition not met', () => {
    const expectModule = require('../../src');
    const expectations = expectModule(
      { test: { type: 'phone', condition: test => /^\+46\d+/.test(test) } },
      { tesT: '0701113210' }
    );
    expect(expectations.wereMet()).toEqual(false);
  });
});
