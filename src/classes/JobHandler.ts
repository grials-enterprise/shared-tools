import { Subject } from 'rxjs';
import { parseTimeToMiliseconds } from '../utils';

/**
 * A job handled by {@link JobHandler}.
 *
 * @category Classes
 */
export interface IJob {
  /** Unique job identifier. */
  id: string;
  /** Data resolved when the job completes. */
  data: any;
  /** RxJS subject used to notify completion or error. */
  listener: Subject<any>;
}

/**
 * Manages a queue of asynchronous jobs that can be completed or cancelled
 * from anywhere in the codebase.
 *
 * A job is created with {@link JobHandler.startNewJob} and remains pending until
 * {@link JobHandler.completeJob} is called with its `id`, or until it times out.
 *
 * @example
 * ```ts
 * import { JobHandler } from '@grials/shared-tools';
 *
 * const handler = new JobHandler();
 * const jobId = 'my-job';
 *
 * setTimeout(() => handler.completeJob(jobId, { ok: true }), 500);
 *
 * const result = await handler.startNewJob(jobId, '1s');
 * console.log(result); // { ok: true }
 * ```
 *
 * @category Classes
 */
export class JobHandler {
  #queueJobs: IJob[] = [];

  constructor() {}

  /**
   * Starts a new job and returns a promise that resolves when the job is
   * completed via {@link JobHandler.completeJob}, or rejects if it times out
   * or is cancelled.
   *
   * @param jobId - Unique identifier for the job.
   * @param _maxTime - Maximum time to wait before timing out (e.g. `'5s'`). Defaults to `'5s'`.
   * @returns A promise resolved with the data passed to {@link JobHandler.completeJob}.
   * @throws {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} `'Job timed out'` if the job is not completed within `_maxTime`.
   */
  startNewJob(jobId: string, _maxTime?: string): Promise<any> {
    const maxTime = _maxTime || '5s';
    return new Promise((resolve, reject) => {
      let alreadyResolved = false;
      const job = {
        id: jobId,
        data: null,
        listener: new Subject<any>(),
      };
      this.#queueJobs.push(job);

      job.listener.subscribe({
        next: (data) => {
          job.data = data;
          resolve(data);
          alreadyResolved = true;
        },
        error: (err) => {
          reject(err);
          alreadyResolved = true;
        },
      });

      const timeInMs = parseTimeToMiliseconds(maxTime);
      setTimeout(() => {
        if (!job.data && !alreadyResolved) {
          job.listener.error(new Error('Job timed out'));
          job.listener.complete();
          this.#queueJobs = this.#queueJobs.filter((job) => job.id !== jobId);
        }
      }, timeInMs);
    });
  }

  /**
   * Completes a pending job with the given data and removes it from the queue.
   *
   * @param jobId - Identifier of the job to complete.
   * @param data - Data to resolve the job with.
   * @returns The number of remaining jobs in the queue.
   * @throws {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} if the job does not exist.
   */
  completeJob(jobId: string, data: any): number {
    const jobIndex = this.#queueJobs.findIndex((job) => job.id === jobId);
    if (jobIndex !== -1) {
      this.#queueJobs[jobIndex].listener.next(data);
      this.#queueJobs[jobIndex].listener.complete();
      this.#queueJobs.splice(jobIndex, 1);
      return this.#queueJobs.length;
    } else {
      throw new Error(`Job with ID ${jobId} not found`);
    }
  }

  /**
   * Returns the identifiers of all jobs currently waiting in the queue.
   *
   * @returns Array of pending job ids.
   */
  getAllJobIds(): string[] {
    return this.#queueJobs.map((job) => job.id);
  }

  /**
   * Cancels every pending job, rejecting their promises with
   * `'Job cancelled'`, and empties the queue.
   */
  clearQueue(): void {
    this.#queueJobs.forEach((job) => {
      job.listener.error(new Error('Job cancelled'));
      job.listener.complete();
    });
    this.#queueJobs = [];
  }
}
