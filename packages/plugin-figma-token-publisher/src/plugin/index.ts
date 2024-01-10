/* eslint-disable @typescript-eslint/no-explicit-any */
import makeColorTokens from './makeColorTokens';
import makeDevTokenNames from './makeDevTokenNames';
import showNotification from './showNotification';
figma.showUI(__html__, { visible: false, width: 350, height: 250 });

if (figma.command === 'colorTokens') {
  makeColorTokens();
} else if (figma.command === 'devTokenNames') {
  makeDevTokenNames();
}

figma.ui.onmessage = (message: any): void => {
  showNotification({ figma, type: message.type, text: message.text });
};
