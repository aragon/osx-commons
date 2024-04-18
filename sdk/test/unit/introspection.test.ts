import {getInterfaceId} from '../../src';
import {Interface} from '@ethersproject/abi';

describe('introspection', () => {
  describe('getInterfaceId', () => {
    it('should return the correct interfaceId', () => {
      const iface = new Interface([
        'function foo()',
        'function bar()',
        'function baz()',
      ]);
      const interfaceId = getInterfaceId(iface);
      expect(interfaceId).toEqual('0x9bb235aa');
    });
  });
});
