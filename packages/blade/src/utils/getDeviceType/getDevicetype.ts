import isMobile from 'ismobilejs';

const getDeviceType = (): 'desktop' | 'mobile' => {
  // TODO: add event listener for orientation change
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    // react-native
    return 'mobile';
  } else if (typeof document !== 'undefined') {
    // browser
    if (isMobile().any) {
      // tablet is also categorised as mobile
      return 'mobile';
    }

    return 'desktop';
  } else {
    // node
    //@TODO: Check for useragent for node
    return 'desktop';
  }
};

export default getDeviceType;
