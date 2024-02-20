import { findEventTopicLog } from './utils';
import { ContractReceipt, Interface, LogDescription } from 'ethers';

describe('findEventTopicLog', () => {
  const cr: ContractReceipt = {
    logs: [
      {
        topics: ['0x1234567890'],
        data: '0x',
        blockNumber: 1,
        transactionIndex: 0,
        transactionHash: '0xabcdef',
        logIndex: 0,
        address: '0x1234567890',
      },
      {
        topics: ['0xabcdef'],
        data: '0x',
        blockNumber: 2,
        transactionIndex: 1,
        transactionHash: '0xabcdef',
        logIndex: 1,
        address: '0xabcdef',
      },
    ],
  };

  const iface: Interface = new Interface([]);

  test('should return the correct log when the event is found', () => {
    const eventName = 'EventName';
    const expectedLog: LogDescription = {
      topics: ['0x1234567890'],
      data: '0x',
      blockNumber: 1,
      transactionIndex: 0,
      transactionHash: '0xabcdef',
      logIndex: 0,
      address: '0x1234567890',
    };

    const result = findEventTopicLog(cr, iface, eventName);

    expect(result).toEqual(expectedLog);
  });

  test('should throw an error when the event is not found', () => {
    const eventName = 'NonExistentEvent';

    expect(() => {
      findEventTopicLog(cr, iface, eventName);
    }).toThrowError('EventNotFoundError');
  });
});