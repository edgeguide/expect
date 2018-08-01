describe('Expect package (README examples):', () => {
  it('Usage - Validate parameters on the server', () => {
    const expectModule = require('../src');

    const schema = { foo: 'string' };
    const validInput = { foo: 'test' };
    const invalidInput = {};

    const valid = expectModule(schema, validInput);
    const invalid = expectModule(schema, invalidInput);

    expect(valid.wereMet()).toBe(true);
    expect(invalid.wereMet()).toBe(false);

    expect(valid.errors()).toEqual({});
    expect(invalid.errors()).toEqual({
      foo: 'Expected parameter foo to be of type string but it was undefined'
    });

    expect(valid.getParsed()).toEqual({ foo: 'test' });
    expect(invalid.getParsed()).toEqual({});
  });

  it('Options', () => {
    const expectModule = require('../src');

    expect(
      expectModule(
        {
          foo: 'string',
          bar: { type: 'string' }
        },
        {
          foo: 'deadbeef',
          bar: 'deadbeef'
        }
      ).wereMet()
    ).toBe(true);
  });

  it('Options - allowNull', () => {
    const expectModule = require('../src');

    expect(
      expectModule(
        {
          foo: 'string',
          bar: { type: 'string', allowNull: true }
        },
        { foo: 'deadbeef' }
      ).wereMet()
    ).toBe(true);
  });

  it('Options - requiredIf', () => {
    const expectModule = require('../src');

    expect(
      expectModule(
        {
          foo: { type: 'string', allowNull: true },
          bar: { type: 'string', allowNull: true, requiredIf: 'foo' }
        },
        { foo: 'test' }
      ).wereMet()
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: { type: 'string', allowNull: true },
          bar: { type: 'string', requiredIf: 'foo' }
        },
        { foo: null }
      ).wereMet()
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: { type: 'string', allowNull: true },
          bar: { type: 'string', requiredIf: 'foo' }
        },
        { foo: 'test' }
      ).wereMet()
    ).toBe(false);

    expect(
      expectModule(
        {
          foo: {
            type: 'object',
            keys: { buzz: { type: 'string', allowNull: true } }
          },
          bar: { type: 'string', requiredIf: ['foo', 'buzz'] }
        },
        {
          foo: { buzz: null },
          bar: null
        }
      ).wereMet()
    ).toBe(true);
  });

  it('Options - parse', () => {
    const expectModule = require('../src');
    expect(
      expectModule(
        { test: { type: 'number', parse: test => Number(test) } },
        { test: '123' }
      ).getParsed()
    ).toEqual({ test: 123 });

    const invalid = expectModule(
      { test: { type: 'string', allowNull: false, parse: true } },
      { test: null }
    );
    expect(invalid.wereMet()).toBe(false);
    expect(invalid.getParsed()).toEqual({});

    const valid = expectModule(
      { test: { type: 'string', allowNull: true, parse: true } },
      { test: null }
    );
    expect(valid.wereMet()).toBe(true);
    expect(valid.getParsed()).toEqual({ test: 'null' });

    const alsoValid = expectModule(
      { test: { type: 'string', allowNull: true, parse: () => null } },
      { test: 'test' }
    );
    expect(alsoValid.wereMet()).toBe(true); // true
    expect(alsoValid.getParsed()).toEqual({ test: null });

    const anotherOne = expectModule(
      {
        test: { type: 'string', requiredIf: 'existing' },
        existing: { type: 'string', allowNull: true, parse: () => 'test' }
      },
      { test: null, existing: null }
    );
    expect(anotherOne.wereMet()).toBe(true);
    expect(anotherOne.getParsed()).toEqual({ test: null, existing: 'test' });
  });

  it('Options - condition', () => {
    const expectModule = require('../src');

    expect(
      expectModule(
        {
          foo: {
            type: 'array',
            condition: test => test.length
          }
        },
        { foo: [] }
      ).wereMet()
    ).toBe(false);

    expect(
      expectModule(
        {
          foo: {
            type: 'array',
            condition: test => test !== null,
            allowNull: true
          }
        },
        { foo: null }
      ).wereMet()
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: {
            type: 'boolean',
            parse: foo => !!foo,
            condition: foo => typeof foo !== 'string'
          }
        },
        { foo: 'bar' }
      ).wereMet()
    ).toBe(true);
  });

  it('Options - errorCode', () => {
    const expectModule = require('../src');

    expect(
      expectModule(
        {
          bar: { type: 'string' }
        },
        { bar: {} }
      ).errors()
    ).toEqual({
      bar: 'Expected parameter bar to be of type string but it was {}'
    });

    expect(
      expectModule(
        {
          bar: { type: 'string', errorCode: 'Invalid format' }
        },
        { bar: {} }
      ).errors()
    ).toEqual({ bar: 'Invalid format' });
  });

  it('Type explanations - object', () => {
    const expectModule = require('../src');
    expect(
      expectModule(
        {
          bar: {
            type: 'object',
            keys: { fizz: 'number', buzz: 'string' }
          }
        },
        { bar: { fizz: 1, buzz: 1 } }
      ).errors()
    ).toEqual({
      bar: {
        buzz: 'Expected parameter bar.buzz to be of type string but it was 1'
      }
    });

    expect(
      expectModule(
        {
          bar: {
            type: 'object',
            keys: {
              fizz: 'number',
              buzz: { type: 'object', keys: { bizz: 'number' } }
            }
          }
        },
        { bar: { fizz: 1, buzz: { bizz: 'hello' } } }
      ).errors()
    ).toEqual({
      bar: {
        buzz: {
          bizz:
            'Expected parameter bar.buzz.bizz to be of type number but it was "hello"'
        }
      }
    });

    expect(
      expectModule(
        {
          bar: {
            type: 'object',
            strictKeyCheck: true,
            keys: {
              fizz: 'number',
              buzz: { type: 'object', keys: { bizz: 'number' } }
            }
          }
        },
        {
          bar: {
            fizz: 1,
            buzz: { bizz: 2 },
            kizz: 3
          }
        }
      ).errors()
    ).toEqual({ bar: 'Object contained unchecked keys "kizz"' });
  });

  it('Type explanations - array', () => {
    const expectModule = require('../src');

    expect(
      expectModule(
        {
          beef: {
            type: 'array',
            items: {
              type: 'object',
              keys: { foo: 'number', bar: 'boolean' }
            }
          }
        },
        {
          beef: [
            { foo: 1, bar: true },
            { foo: 2, bar: true },
            { foo: 3, bar: false },
            { foo: 4, bar: false }
          ]
        }
      ).wereMet()
    ).toBe(true);

    const schema = {
      beef: {
        type: 'array',
        items: item => ({
          type: 'object',
          keys: {
            foo: item.bar ? 'number' : 'string',
            bar: 'boolean'
          }
        })
      }
    };

    expect(
      expectModule(schema, {
        beef: [{ foo: 1, bar: true }, { foo: 2, bar: true }]
      }).wereMet()
    ).toBe(true);

    expect(
      expectModule(schema, {
        beef: [{ foo: '1', bar: false }, { foo: '2', bar: false }]
      }).wereMet()
    ).toBe(true);

    expect(
      expectModule(schema, {
        beef: [{ foo: '1', bar: true }, { foo: '2', bar: true }]
      }).wereMet()
    ).toBe(false);
  });

  it('Matchers - equalTo', () => {
    const expectModule = require('../src');

    expect(
      expectModule(
        {
          foo: { type: 'boolean', equalTo: 'bar' },
          bar: 'boolean'
        },
        { foo: true, bar: true }
      ).wereMet()
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: { type: 'boolean', parse: true, equalTo: 'bar' },
          bar: 'boolean'
        },
        { foo: 'true', bar: true }
      ).wereMet()
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: { type: 'boolean', equalTo: 'bar' },
          bar: 'boolean'
        },
        { foo: true, bar: false }
      ).wereMet()
    ).toBe(false);

    expect(
      expectModule(
        {
          foo: { type: 'boolean', allowNull: true, equalTo: 'bar' },
          bar: { type: 'boolean', allowNull: true }
        },
        { foo: null, bar: null }
      ).wereMet()
    ).toBe(true);

    expect(
      expectModule(
        {
          foo: { type: 'object', keys: { buzz: 'string' } },
          bar: { type: 'string', equalTo: ['foo', 'buzz'] }
        },
        {
          foo: { buzz: 'abc' },
          bar: 'abc'
        }
      ).wereMet()
    ).toBe(true);
  });

  it('Matchers - blockUnsafe', () => {
    const expectModule = require('../src');

    expect(
      expectModule(
        { test: { type: 'string', blockUnsafe: true } },
        { test: '<div>Some html</div>' }
      ).wereMet()
    ).toBe(false);

    expect(
      expectModule(
        { test: { type: 'string', blockUnsafe: true } },
        { test: 'This is not so unsafe in non-strict mode!' }
      ).wereMet()
    ).toBe(true);

    expect(
      expectModule(
        { test: { type: 'string', blockUnsafe: true, strictEntities: true } },
        { test: 'But it is not safe in strict mode!' }
      ).wereMet()
    ).toBe(false);

    expect(
      expectModule(
        { test: { type: 'email', blockUnsafe: true, strictEntities: true } },
        { test: 'thisisok@foo.xcc' }
      ).wereMet()
    ).toBe(true);

    expect(
      expectModule(
        {
          test: {
            type: 'string',
            blockUnsafe: true,
            strictEntities: true,
            allowed: ['!']
          }
        },
        { test: 'This would normally be considered unsafe!' }
      ).wereMet()
    ).toBe(true);
  });

  it('Matchers - sanitize', () => {
    const expectModule = require('../src');

    expect(
      expectModule(
        { test: { type: 'string', sanitize: true } },
        { test: '<div>Some html</div>' }
      ).getParsed()
    ).toEqual({ test: '&lt;div&gt;Some html&lt;/div&gt;' });

    expect(
      expectModule(
        { test: { type: 'string', sanitize: true } },
        { test: 'This will be kept as-is in non-strict mode!' }
      ).getParsed()
    ).toEqual({ test: 'This will be kept as-is in non-strict mode!' });

    expect(
      expectModule(
        { test: { type: 'string', sanitize: true, strictEntities: true } },
        { test: 'But sanitized in strict mode!' }
      ).getParsed()
    ).toEqual({ test: 'But sanitized in strict mode&excl;' });

    expect(
      expectModule(
        {
          test: {
            type: 'string',
            sanitize: true,
            strictEntities: true,
            allowed: ['(', ')']
          }
        },
        { test: 'keep (some) of this as it is [test]' }
      ).getParsed()
    ).toEqual({ test: 'keep (some) of this as it is &lbrack;test&rbrack;' });
  });
});
