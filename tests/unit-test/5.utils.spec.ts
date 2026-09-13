import nock from 'nock';
import assert from 'assert';
import { TEST_EXECUTE } from '../setup';
import { identifierTypeEcuadorMock } from '../mocks/identifierType.mock';
import { intervalWithRetries } from '../../src/utils/intervalWithRetries';
import {
  applyStringMask,
  sendSlackMessage,
  createExamOrderNumber,
  validateIdentifierInput,
  executeBasicFunctionString,
  validateStringChartAccepted,
} from '../../src/utils';

describe('utils', function () {
  if (!(TEST_EXECUTE === 'ALL' || TEST_EXECUTE === '5')) {
    return;
  }

  const slackDomain = 'https://slack.com';
  const slackUrl = `/api/chat.postMessage`;

  before(async () => {
    nock(slackDomain)
      .persist()
      .post(slackUrl)
      .reply((_, body: any) => {
        try {
          assert.strictEqual(body.channel, 'testId');
          assert.strictEqual(body.blocks[0].text.text, 'hello world!');
        } catch (error) {
          console.log(error);
          return [400, { error: 'Bad Request' }];
        }
        return [
          200,
          {
            ok: true,
            channel: 'test',
            ts: '1755881405.868859',
            message: {
              user: 'U0926T1JV2B',
              type: 'message',
              ts: '1755881405.868859',
              bot_id: 'testUX',
              app_id: 'tets',
              text: 'hello world!',
              team: 'test',
              bot_profile: {
                id: 'test',
                app_id: 'test',
                user_id: 'test',
                name: 'test-notifications',
                icons: {
                  image_36: 'test',
                  image_48: 'test',
                  image_72: 'test',
                },
                deleted: false,
                updated: 1750683992,
                team_id: 'test',
              },
              blocks: [
                {
                  type: 'test',
                  block_id: 'twest',
                  text: {
                    type: 'mrkdwn',
                    text: 'hello world!',
                    verbatim: false,
                  },
                },
              ],
            },
            warning: 'missing_charset',
            response_metadata: {
              warnings: ['missing_charset'],
            },
          },
        ];
      });
  });

  it('success, send slack message', async () => {
    const response = await sendSlackMessage('testId', 'hello world!', 'Bearer eqeqweq');
    assert.strictEqual(typeof response.data, 'object');
    assert.strictEqual(response.status, 200);
  });

  it('success, interval with retries', async function () {
    this.timeout('3s');
    const response = await intervalWithRetries(
      () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve('done');
          }, 2000);
        });
      },
      1,
      3000,
      5000
    );

    assert.strictEqual(response, 'done');
  });

  it('success, interval with retries - timeout', async function () {
    this.timeout('3s');
    const response = await intervalWithRetries(
      () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve('done');
          }, 2000);
        });
      },
      1,
      3000,
      1000
    );

    assert.strictEqual(response, 0);
  });

  it('success, interval with retries - max retries', async function () {
    this.timeout('3s');
    const response = await intervalWithRetries(
      () => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject('reject');
          }, 50);
        });
      },
      5,
      500
    );

    assert.strictEqual(response, null);
  });

  it('success, interval with retries - signal.abort', async function () {
    this.timeout('3s');
    const response = await intervalWithRetries(
      (signal) => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject('reject');
          }, 5000);
          setTimeout(() => {
            signal.abort();
          }, 500);
        });
      },
      1,
      1000
    );

    assert.strictEqual(response, -1);
  });

  it('success, interval with retries - timeout during retry wait', async function () {
    this.timeout('3s');
    const response = await intervalWithRetries(
      () => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject('reject');
          }, 50);
        });
      },
      2,
      1000,
      500
    );

    assert.strictEqual(response, 0);
    await new Promise((resolve) => setTimeout(resolve, 800));
  });

  it('success, create exam order number', function () {
    const orderNumber = createExamOrderNumber();
    const regex = /^[0-9]{18}$/; // YYYYMMDDHHmmss + 4 random digits
    assert.ok(regex.test(orderNumber), `Order number format is incorrect ${orderNumber}`);
    assert.strictEqual(orderNumber.length <= 18, true, `Order number length is incorrect ${orderNumber}`);
  });

  it('success, validate string chart accepted', function () {
    const identifier = '123456789';

    const result = validateStringChartAccepted(identifier, identifierTypeEcuadorMock.acceptedCharacters);
    assert.strictEqual(result, true, 'The identifier should be valid');

    const result2 = validateStringChartAccepted(`${identifier}0A`, identifierTypeEcuadorMock.acceptedCharacters);
    assert.strictEqual(result2, false, 'The identifier should be invalid');
  });

  it('success, apply string mask', function () {
    const identifier = '123456789';

    const result = applyStringMask(identifierTypeEcuadorMock.format, identifier);
    assert.strictEqual(result, '12345678-9');
  });

  it('succes, execute function string', function () {
    const property = 'value';
    const _function = 'return value.length === 10 ? true : "The identifier is not valid";';

    const result = executeBasicFunctionString('1234567890', _function, property);
    assert.strictEqual(result, true);

    const result2 = executeBasicFunctionString('123456789', _function, property);
    assert.strictEqual(result2, 'The identifier is not valid');
  });

  it('success, validate identifier type', function () {
    const identifierValid = '1802722296';
    const identifierInvalid = '1802722297';

    const result = validateIdentifierInput(
      applyStringMask(identifierTypeEcuadorMock.format, identifierValid),
      identifierTypeEcuadorMock
    );
    assert.strictEqual(result, null, 'The identifier should be valid');

    const result2 = validateIdentifierInput(
      applyStringMask(identifierTypeEcuadorMock.format, identifierInvalid),
      identifierTypeEcuadorMock,
      'es'
    );
    assert.strictEqual(result2, 'The identifier is not valid', 'The identifier should be invalid');
  });

  after(() => {
    nock.cleanAll();
  });
});
