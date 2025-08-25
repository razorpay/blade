/* eslint-disable no-undef */
import { calculateBladeCoverage } from './blade-coverage-script';
import { getAccessibilityCoverage } from './accessibility-coverage-script';

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'executeScript') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const response = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: calculateBladeCoverage,
        args: [message.shouldHighlightNodes],
      });
      console.log('response', response);
      chrome.runtime.sendMessage({ action: 'blade-coverage', coverage: response[0].result });
    });
  }

  if (message.action === 'executeAccessibilityScript') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const response = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getAccessibilityCoverage,
        args: [message.shouldHighlightNodes],
      });
      console.log('response', response);
      chrome.runtime.sendMessage({
        action: 'accessibility-coverage',
        coverage: response[0].result,
      });
    });
  }
});
