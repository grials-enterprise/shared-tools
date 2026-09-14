import { Subject } from 'rxjs';
import { v4 as randomUUID } from 'uuid';

/**
 * Data emitted by a {@link TimeQueue} job listener.
 *
 * @category Classes
 */
export interface ITimeQueueListener {
  /** Payload sent to the listener. */
  data?: boolean | string | number | object;
  /** Event type emitted to the listener. */
  event?: 'error' | 'complete' | 'next';
}

/**
 * A single job registered in a {@link TimeQueue}.
 *
 * @category Classes
 */
export interface IQueue {
  /** Unique job identifier. */
  id: string;
  /** RxJS subject used to notify the job. */
  listener: Subject<ITimeQueueListener>;
}

/**
 * A time-based queue that groups jobs by their interval time.
 *
 * @category Classes
 */
export interface ITimeQueue {
  /** Whether the queue is currently running. */
  started: boolean;
  /** Interval time (e.g. `'5s'`, `'10m'`). */
  time: string;
  /** Jobs waiting to be processed. */
  jobs: IQueue[];
}

/**
 * Runs jobs grouped by a time interval. Each queue processes one job per
 * interval tick until it is empty.
 *
 * @example
 * ```ts
 * import { TimeQueue } from '@grials/shared-tools';
 *
 * const queue = new TimeQueue();
 * queue.addNewTimeQueue('1s');
 *
 * const listener = queue.addJobToQueue('1s');
 * listener.subscribe(({ data }) => console.log(data)); // true
 *
 * queue.startQueue('1s');
 * ```
 *
 * @category Classes
 */
export class TimeQueue {
  #queueTimes: Map<string, ITimeQueue> = new Map();
  #validateRegx = {
    time: /^[0-9]+(s|m|h|d)$/,
  };

  constructor() {}

  /**
   * Starts processing the jobs of the given time queue. Emits one job per
   * interval until the queue is empty, then stops.
   *
   * @param time - Time queue to start (must have been created with {@link TimeQueue.addNewTimeQueue}).
   * @throws {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} if the queue does not exist.
   */
  startQueue(time: string) {
    const queue = this.#queueTimes.get(time);
    if (!queue) {
      throw new Error(`Queue with time ${time} does not exist`);
    }
    if (queue.started) {
      return;
    }
    queue.started = true;

    const timeInMs = this.#convertTimeToMs(time);
    const interval = setInterval(() => {
      const currentQueue = this.#queueTimes.get(time);
      if (currentQueue) {
        const job = currentQueue.jobs.shift();

        if (job) {
          job.listener.next({ event: 'complete', data: true });
          job.listener.complete();
        }

        if (currentQueue.jobs.length === 0) {
          clearInterval(interval);
          currentQueue.started = false;
        }
      }
    }, timeInMs);
  }

  /**
   * Creates a new time queue. No-op if the queue already exists.
   *
   * @param time - Interval in the format `[0-9]+(s|m|h|d)` (e.g. `'5s'`, `'10m'`, `'2h'`, `'1d'`).
   * @throws {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} if the format is invalid.
   */
  addNewTimeQueue(time: string) {
    if (!this.#validateRegx.time.test(time)) {
      throw new Error('Invalid time format. Use format like 5s, 10m, 2h, etc.');
    }

    if (this.#queueTimes.has(time)) {
      return;
    }
    this.#queueTimes.set(time, {
      started: false,
      time,
      jobs: [],
    });
  }

  /**
   * Returns the jobs registered in a time queue.
   *
   * @param time - Time queue to inspect.
   * @returns Array of jobs, or an empty array if the queue does not exist.
   */
  getQueue(time: string): IQueue[] {
    return this.#queueTimes.get(time)?.jobs || [];
  }

  /**
   * Registers a new job in a time queue and returns its listener.
   *
   * @param time - Time queue to add the job to.
   * @returns An RxJS subject that will emit when the job is processed.
   * @throws {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} if the queue does not exist.
   */
  addJobToQueue(time: string): Subject<ITimeQueueListener> {
    if (!this.#queueTimes.has(time)) {
      throw new Error(`Queue with time ${time} does not exist`);
    }
    const listener = new Subject<ITimeQueueListener>();
    const jobId = randomUUID();
    const job: IQueue = {
      id: jobId,
      listener,
    };
    this.#queueTimes.get(time)!.jobs.push(job);

    return listener;
  }

  /**
   * Returns a map of every time queue with the ids of its pending jobs.
   *
   * @returns Map keyed by time with the list of job ids.
   */
  getAllQueueIds(): { [key: string]: string[] } {
    const queues: { [key: string]: string[] } = {};

    for (const key of this.#queueTimes.keys()) {
      const queue = this.#queueTimes.get(key)!;
      queues[key] = queue.jobs.map((job) => job.id);
    }

    return queues;
  }

  /**
   * Cancels every job of every queue (emitting `'Job cancelled'`) and clears
   * all queues.
   */
  clearQueue(): void {
    this.#queueTimes.forEach((queue: ITimeQueue) => {
      for (const job of queue.jobs) {
        job.listener.error(new Error('Job cancelled'));
        job.listener.complete();
      }
    });
    this.#queueTimes = new Map();
  }

  #convertTimeToMs(time: string): number {
    const timeValue = parseInt(time.slice(0, -1), 10);
    const timeUnit = time.slice(-1).toLowerCase() as 's' | 'm' | 'h' | 'd';
    const factors: Record<'s' | 'm' | 'h' | 'd', number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return timeValue * factors[timeUnit];
  }
}
