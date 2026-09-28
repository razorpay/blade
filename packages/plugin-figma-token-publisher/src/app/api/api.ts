/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import pako from 'pako';

const GITHUB_BASE_URL = 'https://api.github.com/repos';
const WORKFLOW_INPUT_LIMIT = 65535;

type ColorTokens = Record<string, any>;
export type ExportedIcons = Record<string, string>[];
/** `react` is `@razorpay/blade`, one component for web and native. */
export type IconTarget = 'react' | 'svelte';

// GitHub's workflow_dispatch inputs are capped at 65,535 characters. The token payload can
// exceed that (especially with multiple themes), so we gzip + base64 it before sending.
// The workflow scripts decompress it back.
const compressPayload = (payload: unknown): string => {
  const gzipped = pako.gzip(JSON.stringify(payload));
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

const notify = (type: 'success' | 'error', text: string) => {
  // nosemgrep
  parent.postMessage({ pluginMessage: { type, text } }, '*');
};

const dispatchWorkflow = async ({
  orgName,
  repoName,
  workflowFileName,
  personalAccessToken,
  inputs,
  successText,
}: {
  orgName: string;
  repoName: string;
  workflowFileName: string;
  personalAccessToken: string;
  inputs: Record<string, string>;
  successText: string;
}): Promise<void> => {
  const API_URL = `${GITHUB_BASE_URL}/${orgName}/${repoName}/actions/workflows/${workflowFileName}/dispatches`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${personalAccessToken}`,
      },
      body: JSON.stringify({ ref: 'master', inputs }),
    });

    if (response.status === 204) {
      notify('success', successText);
    } else {
      const responseJson = await response.json();
      notify('error', `⛔️ ${responseJson.message}`);
    }
  } catch (error: any) {
    throw new Error(error);
  }
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
}): Promise<void> =>
  dispatchWorkflow({
    orgName,
    repoName,
    workflowFileName,
    personalAccessToken,
    inputs: { tokens: compressPayload(colorTokens) },
    successText: '🎉 Color tokens published to server',
  });

export const uploadIcons = async ({
  orgName = 'razorpay',
  repoName,
  workflowFileName,
  personalAccessToken,
  icons,
  targets,
}: {
  orgName: string;
  repoName: string;
  workflowFileName: string;
  personalAccessToken: string;
  icons: ExportedIcons;
  targets: IconTarget[];
}): Promise<void> => {
  const payload = compressPayload(icons);
  // SVG paths compress well, but a large enough board still does not fit in one dispatch
  if (payload.length > WORKFLOW_INPUT_LIMIT) {
    notify(
      'error',
      `⛔️ ${icons.length} icons are too large for one PR. Export them in smaller batches.`,
    );
    return;
  }

  await dispatchWorkflow({
    orgName,
    repoName,
    workflowFileName,
    personalAccessToken,
    inputs: { icons: payload, targets: targets.join(',') },
    successText: `🎉 Icon PR requested for ${icons.length} icon${
      icons.length === 1 ? '' : 's'
    }. It opens on razorpay/blade in a few minutes.`,
  });
};
