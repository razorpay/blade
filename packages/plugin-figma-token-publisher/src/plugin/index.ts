/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
import getIcons from './getIcons';
import makeColorTokens from './makeColorTokens';
import makeDevTokenNames from './makeDevTokenNames';
import showNotification from './showNotification';
figma.showUI(__html__, { visible: false, width: 350, height: 250 });

if (figma.command === 'colorTokens') {
  makeColorTokens();
} else if (figma.command === 'devTokenNames') {
  makeDevTokenNames();
} else if (figma.command === 'exportIcons') {
  getIcons();
}

figma.ui.onmessage = (message: any): void => {
  showNotification({ figma, type: message.type, text: message.text });
};
