import {InvalidPromiseError, InvalidTimeoutError, TimeoutError} from './errors';

/**
 * Run a promise with a timeout
 *
 * @export
 * @template T
 * @param {Promise<T>} prom The promise to track
 * @param {number} timeout Timeout (in milliseconds) to wait before failing
 * @param {string} [timeoutMessage] (optional) Message to use when throwing a timeout error. By default: `"Time out"`
 * @return {*}  {Promise<T>}
 */
export function promiseWithTimeout<T>(
  prom: Promise<T>,
  timeout: number,
  timeoutMessage?: string
): Promise<T> {
  if (
    !prom ||
    typeof prom.then !== 'function' ||
    typeof prom.catch !== 'function'
  ) {
    throw new InvalidPromiseError();
  } else if (isNaN(timeout) || timeout < 0) throw new InvalidTimeoutError();

  return new Promise((resolve, reject) => {
    setTimeout(
      () => reject(new TimeoutError(timeoutMessage || 'Time out')),
      timeout
    );

    return prom.then(result => resolve(result)).catch(err => reject(err));
  });
}

/**
 * Run a promise and retry it until it succeeds or the `shouldRetry` function returns false
 *
 * @export
 * @template T
 * @param {{
 *   func: () => Promise<T>;
 *   onFail?: (e: Error) => void;
 *   shouldRetry: () => boolean;
 * }} { func, onFail, shouldRetry }
 * @return {*}
 */
export async function runAndRetry<T>({
  func,
  onFail,
  shouldRetry,
}: {
  func: () => Promise<T>;
  onFail?: (e: Error) => void;
  shouldRetry: () => boolean;
}) {
  let lastErr: Error;
  do {
    try {
      const result = await func();
      // it worked
      return result;
    } catch (err) {
      lastErr = err as Error;
      if (typeof onFail === 'function') {
        onFail(err as Error);
      }
    }
  } while (shouldRetry());

  // all the iterations failed
  throw lastErr;
}
