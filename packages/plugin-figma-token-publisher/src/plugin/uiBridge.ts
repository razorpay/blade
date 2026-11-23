/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The plugin thread and the UI iframe start at the same time, and the UI only listens once React
 * has mounted. A message posted before then is dropped, not queued — and the token window then
 * shows up looking normal while holding an empty `{}` payload. That is how two token pushes
 * reached the workflow with nothing in them.
 *
 * So the UI says when it is listening (`UI_READY`), and everything sent to it before that waits
 * here.
 */
export const UI_READY = 'ui-ready';

let isUIReady = false;
const pendingMessages: any[] = [];

export const postToUI = (message: any): void => {
  if (isUIReady) {
    figma.ui.postMessage(message);
  } else {
    pendingMessages.push(message);
  }
};

export const markUIReady = (): void => {
  isUIReady = true;
  pendingMessages.splice(0).forEach((message) => figma.ui.postMessage(message));
};
