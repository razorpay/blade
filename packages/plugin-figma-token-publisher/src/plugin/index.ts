/* eslint-disable @typescript-eslint/no-explicit-any */
import makeGlobalColorTokens from './makeGlobalColorTokens';
import makeThemeColorTokens from './makeThemeColorTokens';
import makeDevTokenNames from './makeDevTokenNames';
import showNotification from './showNotification';
figma.showUI(__html__, { visible: false, width: 350, height: 250 });

console.log(figma.command);

if (figma.command === 'globalColorTokens') {
  makeGlobalColorTokens();
} else if (figma.command === 'themeColorTokens') {
  makeThemeColorTokens();
} else if (figma.command === 'devTokenNames') {
  makeDevTokenNames();
}

figma.ui.onmessage = (message: any): void => {
  showNotification({ figma, type: message.type, text: message.text });
};
