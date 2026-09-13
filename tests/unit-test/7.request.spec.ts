import nock from 'nock';
import assert from 'assert';
import { TEST_EXECUTE } from '../setup';
import {
  getExternalResource,
  postExternalResource,
  patchExternalResource,
  deleteExternalResource,
} from '../../src/utils/request';
import { sendSlackMessage } from '../../src/utils';

describe('utils - request', function () {
  if (!(TEST_EXECUTE === 'ALL' || TEST_EXECUTE === '7')) {
    return;
  }

  const domain = 'https://example.com';

  const makeLogger = (calls: string[]) => ({
    info: () => calls.push('info'),
    error: () => calls.push('error'),
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('success, getExternalResource - no logger, headers and params', async () => {
    nock(domain).get('/api/resource').query({ q: '1' }).reply(200, { ok: true });
    const response = await getExternalResource(`${domain}/api/resource`, { Authorization: 'Bearer x' }, { q: '1' });
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, { ok: true });
  });

  it('success, getExternalResource - logger, null headers and params', async () => {
    nock(domain).get('/api/resource').reply(200, { ok: true });
    const calls: string[] = [];
    const response = await getExternalResource(`${domain}/api/resource`, null as any, null, makeLogger(calls));
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(calls, ['info']);
  });

  it('error, getExternalResource - no logger', async () => {
    nock(domain).get('/api/error').reply(500, { error: 'boom' });
    await assert.rejects(() => getExternalResource(`${domain}/api/error`), /Request failed with status code 500/);
  });

  it('error, getExternalResource - logger', async () => {
    nock(domain).get('/api/error').reply(500, { error: 'boom' });
    const calls: string[] = [];
    await assert.rejects(() => getExternalResource(`${domain}/api/error`, null as any, undefined, makeLogger(calls)));
    assert.deepStrictEqual(calls, ['info', 'error']);
  });

  it('success, postExternalResource - no logger, headers and params', async () => {
    nock(domain).post('/api/create', { a: 1 }).query({ q: '1' }).reply(201, { created: true });
    const response = await postExternalResource(
      `${domain}/api/create`,
      { a: 1 },
      { 'Content-Type': 'application/json' },
      { q: '1' }
    );
    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(response.data, { created: true });
  });

  it('success, postExternalResource - logger, null headers and params', async () => {
    nock(domain).post('/api/create').reply(201, { created: true });
    const calls: string[] = [];
    const response = await postExternalResource(`${domain}/api/create`, {}, null as any, null, makeLogger(calls));
    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(calls, ['info']);
  });

  it('error, postExternalResource - no logger', async () => {
    nock(domain).post('/api/create').reply(400, { error: 'bad' });
    await assert.rejects(() => postExternalResource(`${domain}/api/create`, {}), /Request failed with status code 400/);
  });

  it('error, postExternalResource - logger', async () => {
    nock(domain).post('/api/create').reply(400, { error: 'bad' });
    const calls: string[] = [];
    await assert.rejects(() => postExternalResource(`${domain}/api/create`, {}, null as any, undefined, makeLogger(calls)));
    assert.deepStrictEqual(calls, ['info', 'error']);
  });

  it('success, patchExternalResource - no logger, headers and params', async () => {
    nock(domain).patch('/api/update', { a: 2 }).query({ q: '1' }).reply(200, { updated: true });
    const response = await patchExternalResource(
      `${domain}/api/update`,
      { a: 2 },
      { 'Content-Type': 'application/json' },
      { q: '1' }
    );
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, { updated: true });
  });

  it('success, patchExternalResource - logger, null headers and params', async () => {
    nock(domain).patch('/api/update').reply(200, { updated: true });
    const calls: string[] = [];
    const response = await patchExternalResource(`${domain}/api/update`, {}, null as any, null, makeLogger(calls));
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(calls, ['info']);
  });

  it('error, patchExternalResource - no logger', async () => {
    nock(domain).patch('/api/update').reply(500);
    await assert.rejects(() => patchExternalResource(`${domain}/api/update`, {}), /Request failed with status code 500/);
  });

  it('error, patchExternalResource - logger', async () => {
    nock(domain).patch('/api/update').reply(500);
    const calls: string[] = [];
    await assert.rejects(() => patchExternalResource(`${domain}/api/update`, {}, null as any, undefined, makeLogger(calls)));
    assert.deepStrictEqual(calls, ['info', 'error']);
  });

  it('success, deleteExternalResource - no logger, headers and params', async () => {
    nock(domain).delete('/api/remove', { id: 1 }).query({ q: '1' }).reply(200, { deleted: true });
    const response = await deleteExternalResource(
      `${domain}/api/remove`,
      { id: 1 },
      { 'Content-Type': 'application/json' },
      { q: '1' }
    );
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, { deleted: true });
  });

  it('success, deleteExternalResource - logger, null headers and params', async () => {
    nock(domain).delete('/api/remove').reply(200, { deleted: true });
    const calls: string[] = [];
    const response = await deleteExternalResource(`${domain}/api/remove`, {}, null as any, null, makeLogger(calls));
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(calls, ['info']);
  });

  it('error, deleteExternalResource - no logger', async () => {
    nock(domain).delete('/api/remove').reply(404);
    await assert.rejects(() => deleteExternalResource(`${domain}/api/remove`, {}), /Request failed with status code 404/);
  });

  it('error, deleteExternalResource - logger', async () => {
    nock(domain).delete('/api/remove').reply(404);
    const calls: string[] = [];
    await assert.rejects(() => deleteExternalResource(`${domain}/api/remove`, {}, null as any, undefined, makeLogger(calls)));
    assert.deepStrictEqual(calls, ['info', 'error']);
  });

  it('error, sendSlackMessage - missing token', async () => {
    await assert.rejects(() => sendSlackMessage('channel', 'hello', ''), /Slack channel token is required/);
  });
});
