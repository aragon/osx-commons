import {bytesToHex, hexToBytes} from '../../../src';

describe('hex/bytes', () => {
  describe('hexToBytes', () => {
    it('Should convert hex strings to a buffer', () => {
      const inputs = [
        {hex: '0x00', serializedBuffer: '0'},
        {hex: '0x10', serializedBuffer: '16'},
        {hex: '0xff', serializedBuffer: '255'},
        {hex: '0xffffffff', serializedBuffer: '255,255,255,255'},
        {
          hex: '0xaaaaaaaaaaaaaaaa',
          serializedBuffer: '170,170,170,170,170,170,170,170',
        },
        {hex: '00', serializedBuffer: '0'},
        {hex: '0x', serializedBuffer: ''},
        {hex: '10', serializedBuffer: '16'},
        {hex: 'ff', serializedBuffer: '255'},
        {hex: 'ffffffff', serializedBuffer: '255,255,255,255'},
        {
          hex: 'aaaaaaaaaaaaaaaa',
          serializedBuffer: '170,170,170,170,170,170,170,170',
        },
      ];

      for (const input of inputs) {
        const result = hexToBytes(input.hex);
        expect(result.join(',')).toEqual(input.serializedBuffer);
      }
    });
  });
  describe('bytesToHex', () => {
    it("Should convert Uint8Array's into hex strings", () => {
      const items = [
        {buffer: new Uint8Array([]), skip0x: false, output: '0x'},
        {buffer: new Uint8Array([]), skip0x: true, output: ''},
        {buffer: new Uint8Array([0]), skip0x: false, output: '0x00'},
        {buffer: new Uint8Array([0]), skip0x: true, output: '00'},
        {buffer: new Uint8Array([1]), skip0x: false, output: '0x01'},
        {buffer: new Uint8Array([1]), skip0x: true, output: '01'},
        {
          buffer: new Uint8Array([
            10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 250, 255,
          ]),
          skip0x: false,
          output: '0x0a141e28323c46505a64c8faff',
        },
        {
          buffer: new Uint8Array([
            10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 250, 255,
          ]),
          skip0x: true,
          output: '0a141e28323c46505a64c8faff',
        },
        {
          buffer: new Uint8Array([100, 100, 100, 100, 100, 100]),
          skip0x: false,
          output: '0x646464646464',
        },
        {
          buffer: new Uint8Array([100, 100, 100, 100, 100, 100]),
          skip0x: true,
          output: '646464646464',
        },
        {buffer: new Uint8Array([0, 255]), skip0x: false, output: '0x00ff'},
        {buffer: new Uint8Array([0, 255]), skip0x: true, output: '00ff'},
      ];

      for (const item of items) {
        const hex = bytesToHex(item.buffer, item.skip0x);
        expect(hex).toEqual(item.output);
      }
    });
  });
});
