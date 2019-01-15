import expectModule = require('../../src');

const types: any = [
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

types.forEach((type: any) =>
  describe(`errorCode - type ${type}`, () => {
    it('option can be used', () => {
      expect(
        expectModule({ test: { type, errorCode: 'error' } }, {}).errors()
      ).toEqual({ test: 'error' });
    });
  })
);
