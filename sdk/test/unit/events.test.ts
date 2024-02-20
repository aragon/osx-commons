import {DaoEvents, IDaoEvents, findEvent, findEventTopicLog} from '../../src';
import {getContractReceipt} from '../utils';
import {DAO__factory} from '@aragon/osx-ethers';
import {EventFragment, Interface} from '@ethersproject/abi';
import {Event} from '@ethersproject/contracts';
import {ContractReceipt} from '@ethersproject/contracts';

describe('events', () => {
  let event: EventFragment;
  let iface: Interface;
  const eventName = DaoEvents.NEW_URI;
  const eventArgs = ['https://aragon.org'];
  let cr: ContractReceipt;
  beforeAll(() => {
    iface = DAO__factory.createInterface();
    event = iface.getEvent(eventName);
    cr = getContractReceipt(event, eventArgs);
  });
  describe('findEvent', () => {
    it('should not find the event in the contract receipt and throw an error', () => {
      expect(() => {
        findEvent(cr, IDaoEvents.DEPOSITED);
      }).toThrow();
    });
    it('should find the event in the contract receipt', () => {
      const cr = getContractReceipt(event, eventArgs);
      const e = findEvent<Event>(cr, eventName);
      expect(e).toBeDefined();
      expect(e.event).toEqual(eventName);
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
        findEventTopicLog(cr, iface, IDaoEvents.DEPOSITED);
      }).toThrow();
    });
    it('should find the event topic in the contract receipt', () => {
      const log = findEventTopicLog(cr, iface, eventName);
      expect(log).toBeDefined();
      expect(log.name).toEqual(eventName);
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
