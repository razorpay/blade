/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const GITHUB_BASE_URL = 'https://api.github.com/repos';

type ColorTokens = Record<string, any>;

export const uploadTokens = async ({
  orgName = 'razorpay',
  repoName,
  workflowFileName,
  personalAccessToken,
  colorTokens,
}: {
  orgName: string;
  repoName: string;
  workflowFileName: string;
  personalAccessToken: string;
  colorTokens: ColorTokens;
}): Promise<void> => {
  const API_URL = `${GITHUB_BASE_URL}/${orgName}/${repoName}/actions/workflows/${workflowFileName}/dispatches`;

  const getFetchOptions = (colorTokens: ColorTokens) => ({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${personalAccessToken}`,
    },
    body: JSON.stringify({
      ref: 'master',
      inputs: {
        tokens: JSON.stringify(colorTokens),
      },
    }),
  });

  try {
    const response = await fetch(API_URL, getFetchOptions(colorTokens));

    const isRequestSuccess = response.status === 204;
    if (isRequestSuccess) {
      // nosemgrep
      parent.postMessage(
        {
          pluginMessage: {
            type: 'success',
            text: '🎉 Color tokens published to server',
          },
        },
        '*',
      );
    } else {
      const responseJson = await response.json();
      // nosemgrep
      parent.postMessage(
        {
          pluginMessage: {
            type: 'error',
            text: `⛔️ ${responseJson.message}`,
          },
        },
        '*',
      );
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
