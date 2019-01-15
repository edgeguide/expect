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
