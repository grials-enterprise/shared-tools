import { timer } from 'rxjs';

/**
 * Async function executed by {@link intervalWithRetries}.
 *
 * @category Async & HTTP
 */
// eslint-disable-next-line
export type AsyncFunc = (signal: AbortController) => Promise<any>;

/**
 * Executes an async function with retries until it succeeds, times out, or the
 * maximum number of retries is reached.
 *
 * @example
 * ```ts
 * const result = await intervalWithRetries(
 *   () => Promise.resolve('done'),
 *   3,
 *   1000,
 *   5000
 * );
 * // 'done'
 * ```
 *
 * @param asyncFunc - Async function to execute. It receives an `AbortController`
 *   signal that can be aborted to cancel the operation.
 * @param maxRetries - Maximum number of attempts.
 * @param intervalTime - Delay in milliseconds between retries.
 * @param maxTime - Optional global timeout in milliseconds. When reached the
 *   function resolves with `0`.
 * @returns The async function result, `0` on global timeout, `-1` when the
 *   signal is aborted, or `null` when retries are exhausted.
 *
 * @category Async & HTTP
 */
export const intervalWithRetries = (
  asyncFunc: AsyncFunc,
  maxRetries: number,
  intervalTime: number,
  maxTime?: number
): Promise<-1 | 0 | null | any> => {
  return new Promise(async (resolve) => {
    const controller = new AbortController();
    controller.signal.addEventListener('abort', () => {
      resolve(-1);
    });
    let isTimeout = false;
    if (maxTime && maxTime > 0) {
      timer(maxTime).subscribe(() => {
        isTimeout = true;
        resolve(0);
      });
    }
    let tryCount = 1;
    do {
      if (isTimeout) {
        break;
      }
      try {
        resolve(await asyncFunc(controller));
        break;
        // eslint-disable-next-line
      } catch (error) {
        await new Promise((resolve) => timer(intervalTime).subscribe(resolve));
      }
    } while (maxRetries > tryCount++);
    resolve(null);
  });
};
