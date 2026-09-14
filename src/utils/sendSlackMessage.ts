import { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { postExternalResource } from './request';

/**
 * Sends a message to a Slack channel using the `chat.postMessage` API.
 *
 * @example
 * ```ts
 * await sendSlackMessage('C12345', 'Hello world!', 'Bearer xoxb-...');
 * ```
 *
 * @param channelId - Slack channel id.
 * @param message - Message text.
 * @param slackChannelToken - Slack token (e.g. `'Bearer xoxb-...'`).
 * @returns The Axios response of the Slack API.
 * @throws {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} if `slackChannelToken` is empty.
 *
 * @category Async & HTTP
 */
export const sendSlackMessage = async (
  channelId: string,
  message: string,
  slackChannelToken: string
): Promise<AxiosResponse<any>> => {
  if (!slackChannelToken) {
    throw new Error('Slack channel token is required');
  }

  return await postExternalResource(
    'https://slack.com/api/chat.postMessage',
    {
      channel: channelId,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message,
          },
        },
      ],
    },
    {
      Authorization: slackChannelToken,
    } as RawAxiosRequestHeaders
  );
};
