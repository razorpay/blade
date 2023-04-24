/* eslint-disable @typescript-eslint/no-explicit-any */
import makeThemeColorTokens from './makeThemeColorTokens';
import showNotification from './showNotification';
figma.showUI(__html__, { visible: false, width: 350, height: 250 });

makeThemeColorTokens(figma);

figma.ui.onmessage = (message: any): void => {
  showNotification({ figma, type: message.type, text: message.text });
};
