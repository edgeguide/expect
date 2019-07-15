import expectModule = require('../src');

[null, undefined, true, 1, NaN, Infinity, '', Symbol()].forEach((input: any) =>
  describe(`Invalid input: ${
    typeof input === 'symbol' ? input.toString() : input
  }`, () => {
    it('Throws error on invalid validation schema', () => {
      expect(() => expectModule(input, { x: 'test' })).toThrow();
    });

    it('Does not throw error on invalid input', () => {
      const expectFunction = () => expectModule({ x: 'string' }, input);
      expect(expectFunction).not.toThrow();
      expect(expectFunction().wereMet()).toBe(false);
    });
  })
);

describe('handling of __proto__ poisoning', () => {
  it('does not include the __proto__ key if parse is true for objects', () => {
    const expectations = expectModule(
      {
        test: {
          type: 'object',
          parse: true
        }
      },
      {
        test: '{ "b": 5, "__proto__": { "c": 6 } }'
      }
    );
    const values = expectations.getParsed();
    expect(values.test.__proto__).toEqual(Object.prototype);
  });

  it('should not accept __proto__ as type', () => {
    const expectFunction = () =>
      expectModule(
        {
          test: {
            type: '__proto__',
            parse: true
          } as any
        },
        {
          test: '{ "b": 5, "__proto__": { "c": 6 } }'
        }
      );

    expect(expectFunction).toThrow(
      'Invalid type "__proto__" for parameter test'
    );
  });
});
