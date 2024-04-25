import {findEvent, findEventTopicLog} from '../../src';
import {getDummyContractReceipt} from '../utils';
import {DAO__factory} from '@aragon/osx-ethers';
import {EventFragment, Interface} from '@ethersproject/abi';
import {Event} from '@ethersproject/contracts';
import {ContractReceipt} from '@ethersproject/contracts';

describe('events', () => {
  let event: EventFragment;
  let nonExistingEvent: EventFragment;
  let iface: Interface;
  const eventArgs = ['https://aragon.org'];
  let receipt: ContractReceipt;
  beforeAll(() => {
    iface = DAO__factory.createInterface();
    event = iface.getEvent('NewURI');
    nonExistingEvent = iface.getEvent('Deposited');
    receipt = getDummyContractReceipt(event, eventArgs);
  });
  describe('findEvent', () => {
    it('should not find the event in the contract receipt and throw an error', () => {
      expect(() => {
        findEvent(receipt, nonExistingEvent.name);
      }).toThrow();
    });
    it('should find the event in the contract receipt', () => {
      const e = findEvent<Event>(receipt, event.name);
      expect(e).toBeDefined();
      expect(e.event).toEqual(event.name);
      expect(e.args).toBeDefined();
      if (!e.args) {
        throw new Error('e.args is undefined');
      }
      for (const [i, arg] of e.args.entries()) {
        expect(arg).toBe(eventArgs[i]);
      }
    });
  });
  describe('findEventTopicLog', () => {
    it('should not find the event in the contract receipt and throw an error', () => {
      expect(() => {
        findEventTopicLog(receipt, iface, nonExistingEvent.name);
      }).toThrow();
    });
    it('should find the event topic in the contract receipt', () => {
      const log = findEventTopicLog(receipt, iface, event.name);
      expect(log).toBeDefined();
      expect(log.name).toEqual(event.name);
      expect(log.args).toBeDefined();
      if (!log.args) {
        throw new Error('log.args is undefined');
      }
      for (const [i, arg] of log.args.entries()) {
        expect(arg).toBe(eventArgs[i]);
      }
    });
  });
});
