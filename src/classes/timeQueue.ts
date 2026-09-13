import { Subject } from 'rxjs';
import { v4 as randomUUID } from 'uuid';

export interface ITimeQueueListener {
  data?: boolean | string | number | object;
  event?: 'error' | 'complete' | 'next';
}

export interface IQueue {
  id: string;
  listener: Subject<ITimeQueueListener>;
}

export interface ITimeQueue {
  started: boolean;
  time: string;
  jobs: IQueue[];
}

export class TimeQueue {
  #queueTimes: Map<string, ITimeQueue> = new Map();
  #validateRegx = {
    time: /^[0-9]+(s|m|h|d)$/,
  };

  constructor() {}

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

  getQueue(time: string): IQueue[] {
    return this.#queueTimes.get(time)?.jobs || [];
  }

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

  getAllQueueIds(): { [key: string]: string[] } {
    const queues: { [key: string]: string[] } = {};

    for (const key of this.#queueTimes.keys()) {
      const queue = this.#queueTimes.get(key)!;
      queues[key] = queue.jobs.map((job) => job.id);
    }

    return queues;
  }
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
