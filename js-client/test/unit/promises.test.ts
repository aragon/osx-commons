import { promiseWithTimeout, runAndRetry } from '../../src';

describe('Test promise helpers', () => {
  describe('runAndRetry', () => {
    it('Should run and retry 3 times', async () => {
      let countFunc = 0;
      let countOnFail = 0;
      const message = 'success';

      const res = await runAndRetry({
        func: async () => {
          countFunc++;
          if (countFunc < 3) {
            throw new Error();
          } else {
            return message;
          }
        },
        onFail: () => countOnFail++,
        shouldRetry: () => true,
      });

      expect(countFunc).toBe(3);
      expect(res).toBe(message);
      expect(countOnFail).toBe(2);
    });
    it('Should run and throw', async () => {
      let countRetries = 0;
      await expect(async () => {
        await runAndRetry({
          func: () => {
            countRetries++;
            throw new Error();
          },
          shouldRetry: () => countRetries < 3,
        });
      }).rejects.toThrow();
      expect(countRetries).toBe(3);
    });
  });
  describe('promiseWithTimeout', () => {
    it('Should timeout', async () => {
      const timeout = 100;
      const promise = new Promise((resolve) =>
        setTimeout(resolve, timeout * 2)
      );
      await expect(promiseWithTimeout(promise, timeout)).rejects.toThrow(
        'Time out'
      );
    });
    it('Should not timeout', async () => {
      const timeout = 100;
      const promise = new Promise((resolve) =>
        setTimeout(resolve, timeout / 2)
      );
      await expect(
        promiseWithTimeout(promise, timeout)
      ).resolves.toBeUndefined();
    });
  });
});
