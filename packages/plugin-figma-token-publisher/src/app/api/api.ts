/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import pako from 'pako';

const GITHUB_BASE_URL = 'https://api.github.com/repos';

type ColorTokens = Record<string, any>;

// GitHub's workflow_dispatch inputs are capped at 65,535 characters. The token payload can
// exceed that (especially with multiple themes), so we gzip + base64 it before sending.
// The workflow's uploadTokens.js script decompresses it back.
const compressTokens = (colorTokens: ColorTokens): string => {
  const gzipped = pako.gzip(JSON.stringify(colorTokens));
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < gzipped.length; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      (gzipped.subarray(i, i + chunkSize) as unknown) as number[],
    );
  }
  return btoa(binary);
};

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
        tokens: compressTokens(colorTokens),
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
