import { timer } from 'rxjs';

// eslint-disable-next-line
type AsyncFunc = (signal: AbortController) => Promise<any>;

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
