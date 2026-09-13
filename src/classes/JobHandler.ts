import { Subject } from 'rxjs';
import { parseTimeToMiliseconds } from '../utils';

export interface IJob {
  id: string;
  data: any;
  listener: Subject<any>;
}

export class JobHandler {
  #queueJobs: IJob[] = [];

  constructor() {}

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

  getAllJobIds(): string[] {
    return this.#queueJobs.map((job) => job.id);
  }

  clearQueue(): void {
    this.#queueJobs.forEach((job) => {
      job.listener.error(new Error('Job cancelled'));
      job.listener.complete();
    });
    this.#queueJobs = [];
  }
}
