/* eslint-disable @typescript-eslint/no-explicit-any */
import getIcons from './getIcons';
import makeColorTokens from './makeColorTokens';
import makeDevTokenNames from './makeDevTokenNames';
import showNotification from './showNotification';
// Starting size for the token field and buttons alone. `makeColorTokens` grows the window when it
// has a validation report to show.
figma.showUI(__html__, { visible: false, width: 400, height: 260 });

const runCommand = async (): Promise<void> => {
  if (figma.command === 'colorTokens') {
    await makeColorTokens();
  } else if (figma.command === 'devTokenNames') {
    await makeDevTokenNames();
  } else if (figma.command === 'exportIcons') {
    await getIcons();
  }
};

runCommand().catch((error) => {
  console.error(error);
  showNotification({
    figma,
    type: 'error',
    text: `⛔️ Something went wrong: ${error} `,
  });
});

figma.ui.onmessage = (message: any): void => {
  showNotification({ figma, type: message.type, text: message.text });
};
