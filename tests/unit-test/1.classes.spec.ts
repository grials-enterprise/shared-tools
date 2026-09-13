import { Subject } from 'rxjs';
import * as assert from 'assert';
import { TEST_EXECUTE } from '../setup';
import { JobHandler } from '../../src/classes/JobHandler';
import { ITimeQueueListener, TimeQueue } from '../../src/classes/timeQueue';

describe('classes', function () {
  if (!(TEST_EXECUTE === 'ALL' || TEST_EXECUTE === '1')) {
    return;
  }
  this.timeout('60s');
  it('success, execute job', async () => {
    const jobId = 'test-job';
    const data = {
      key: 'value',
    };
    const jobHandler = new JobHandler();

    setTimeout(() => {
      jobHandler.completeJob(jobId, data);
    }, 500);

    const response = await jobHandler.startNewJob(jobId, '1s');
    assert.strictEqual(response?.key, 'value');
    assert.strictEqual(jobHandler.getAllJobIds().length, 0);
  });
  it('success, execute 5 job', async () => {
    const jobHandler = new JobHandler();
    const jobs = [
      { id: 'job-1', data: { key: 'value-1' } },
      { id: 'job-2', data: { key: 'value-2' } },
      { id: 'job-3', data: { key: 'value-3' } },
      { id: 'job-4', data: { key: 'value-4' } },
      { id: 'job-5', data: { key: 'value-5' } },
    ];
    const jobsConsumers: Promise<any>[] = [];

    jobs.forEach((job, index) => {
      setTimeout(
        () => {
          jobHandler.completeJob(job.id, job.data);
        },
        (index + 1) * 100
      );
      jobsConsumers.push(jobHandler.startNewJob(job.id, '1s'));
    });

    const response = await Promise.all(jobsConsumers);
    assert.strictEqual(response.length, 5);
    response.forEach((res, index) => {
      assert.strictEqual(res?.key, `value-${index + 1}`);
    });

    assert.strictEqual(jobHandler.getAllJobIds().length, 0);
  });
  it('success, cancel all jobs', async () => {
    const jobHandler = new JobHandler();
    const jobs = [
      { id: 'job-1', data: { key: 'value-1' } },
      { id: 'job-2', data: { key: 'value-2' } },
      { id: 'job-3', data: { key: 'value-3' } },
      { id: 'job-4', data: { key: 'value-4' } },
      { id: 'job-5', data: { key: 'value-5' } },
    ];
    const jobsConsumers: Promise<any>[] = [];

    jobs.forEach((job, index) => {
      setTimeout(() => {
        jobHandler.completeJob(job.id, job.data);
      }, 50000000);
      jobsConsumers.push(jobHandler.startNewJob(job.id, '50s'));
    });

    setTimeout(() => {
      jobHandler.clearQueue();
    }, 1000);

    const response = await Promise.allSettled(jobsConsumers);

    assert.strictEqual(jobHandler.getAllJobIds().length, 0);
    response.forEach((res: any) => {
      assert.strictEqual(res.status, 'rejected');
      assert.strictEqual(res.reason.message, 'Job cancelled');
    });
  });

  it('success, timeQueue add and get queues', () => {
    const timeQueue = new TimeQueue();
    timeQueue.addNewTimeQueue('1s');
    timeQueue.addNewTimeQueue('10s');

    const queue1 = timeQueue.getQueue('1s');
    const queue10 = timeQueue.getQueue('10s');

    assert.strictEqual(Array.isArray(queue1), true);
    assert.strictEqual(Array.isArray(queue10), true);
    assert.strictEqual(queue1.length, 0);
    assert.strictEqual(queue10.length, 0);

    timeQueue.addJobToQueue('1s');
    timeQueue.addJobToQueue('1s');
    timeQueue.addJobToQueue('10s');

    const allQueues = timeQueue.getAllQueueIds();
    assert.strictEqual(allQueues['1s'].length, 2);
    assert.strictEqual(allQueues['10s'].length, 1);

    timeQueue.clearQueue();
    const allQueuesAfterClear = timeQueue.getAllQueueIds();
    assert.strictEqual(Object.keys(allQueuesAfterClear).length, 0);
  });
  it('success, execute queue', async () => {
    const timeQueue = new TimeQueue();
    const time = '3s';
    timeQueue.addNewTimeQueue(time);

    const jobListener = timeQueue.addJobToQueue(time);
    const jobListener2 = timeQueue.addJobToQueue(time);
    const jobListener3 = timeQueue.addJobToQueue(time);

    const queueJobs: Subject<ITimeQueueListener>[] = [jobListener, jobListener2, jobListener3];
    let completedJobs = 0;
    let date = Date.now();
    await new Promise<void>((resolve) => {
      queueJobs.forEach((job, index) => {
        job.subscribe({
          next: (data) => {
            assert.strictEqual(data.data, true);
          },
          error: (err) => {
            assert.fail(`Job ${index + 1} failed with error: ${err.message}`);
          },
          complete: () => {
            completedJobs += 1;
            if (completedJobs === queueJobs.length) {
              resolve();
            }
          },
        });
      });

      timeQueue.startQueue(time);
    });
    const elapsed = Date.now() - date;
    assert.ok(elapsed >= 3000, `Elapsed time ${elapsed}ms is less than expected 3000ms`);

    assert.strictEqual(timeQueue.getAllQueueIds()[time].length, 0);
    assert.strictEqual(completedJobs, 3);
  });
});
