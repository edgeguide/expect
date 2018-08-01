const types = [
  'any',
  'number',
  'boolean',
  'string',
  'array',
  'object',
  'date',
  'phone',
  'email',
  'identityNumber'
];

types.forEach(type =>
  describe(`errorCode - type ${type}`, () => {
    it('option can be used', () => {
      const expectModule = require('../../src');
      expect(
        expectModule({ test: { type, errorCode: 'error' } }, {}).errors()
      ).toEqual({ test: 'error' });
    });
  })
);
