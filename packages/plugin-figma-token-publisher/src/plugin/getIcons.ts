/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable default-case */
import showNotification from './showNotification';

/* eslint-disable no-bitwise */
function utf8ArrayToString(array: Uint8Array): string {
  var out: string, i: number, len: number, c: number;
  var char2: number, char3: number;

  out = '';
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0),
        );
        break;
    }
  }

  return out;
}

const getIcons = async (): Promise<void> => {
  const selection = figma.currentPage.selection[0];
  const svgStrings: Record<string, string>[] = [];
  const exportedIcons = (selection as GroupNode).children.map((child) => {
    return child.exportAsync({ format: 'SVG' }).then((data) => {
      const svgString = utf8ArrayToString(data);
      svgStrings.push({ [child.name]: svgString });
    });
  });
  await Promise.all(exportedIcons);

  showNotification({
    figma,
    type: 'information',
    text: '✅ Icons Exported!',
  });
  figma.ui.postMessage({
    type: 'export-svg-icons',
    data: svgStrings,
  });
  figma.ui.show();
};

export default getIcons;
