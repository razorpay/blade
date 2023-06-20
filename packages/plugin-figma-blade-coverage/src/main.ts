import { loadFontsAsync, once, showUI } from '@create-figma-plugin/utilities';
import type { InsertCodeHandler } from './types';

const main = (): void => {
  once<InsertCodeHandler>('INSERT_CODE', async (code: string) => {
    const text = figma.createText();
    await loadFontsAsync([text]);
    text.characters = code;
    figma.currentPage.selection = [text];
    figma.viewport.scrollAndZoomIntoView([text]);
    figma.closePlugin();
  });
  showUI({ height: 240, width: 320 });
};

export default main;
