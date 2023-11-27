/* eslint-disable @typescript-eslint/no-explicit-any */
const showNotification = ({ figma, type, text }: any): void => {
  // show notification
  if (text !== undefined && text !== '') {
    figma.notify(text);
  }

  if (type === 'error' || type === 'success' || type === 'closePlugin') {
    // close plugin
    figma.ui.hide();
    figma.closePlugin();
  }
};

export default showNotification;
