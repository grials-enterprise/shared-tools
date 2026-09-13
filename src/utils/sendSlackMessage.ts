import { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { postExternalResource } from './request';

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
