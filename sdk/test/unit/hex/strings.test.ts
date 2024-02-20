import {ensure0x, strip0x} from '../../../src';

describe('hex/strings', () => {
  describe('ensure0x', () => {
    it('Should ensure 0x prefixes', () => {
      const inputs = [
        // strip
        {in: '0', out: '0x0'},
        {in: '00', out: '0x00'},
        {in: '1234', out: '0x1234'},
        {in: '55555555555555555555', out: '0x55555555555555555555'},
        // skip
        {in: '0x1234', out: '0x1234'},
        {in: '0xabcd', out: '0xabcd'},
        {in: '0x1234567890abcdef', out: '0x1234567890abcdef'},
      ];

      for (const input of inputs) {
        const result = ensure0x(input.in);
        expect(result).toEqual(input.out);
      }
    });
  });
  describe('strip0x', () => {
    it('Should strip 0x prefixes', () => {
      const inputs = [
        // strip
        {in: '0x0', out: '0'},
        {in: '0x00', out: '00'},
        {in: '0x1234', out: '1234'},
        {in: '0x55555555555555555555', out: '55555555555555555555'},
        // skip
        {in: '1234', out: '1234'},
        {in: 'abcd', out: 'abcd'},
        {in: '1234567890abcdef', out: '1234567890abcdef'},
      ];

      for (const input of inputs) {
        const result = strip0x(input.in);
        expect(result).toEqual(input.out);
      }
    });
  });
});
