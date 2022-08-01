import { Easing } from 'react-native-reanimated';
import paymentLightThemeWeb from './paymentLightTheme.web';
import type { Theme } from '~components/BladeProvider';

const paymentLightTheme: Theme = {
  ...paymentLightThemeWeb,
  motion: {
    ...paymentLightThemeWeb.motion,
    easing: {
      standard: {
        attentive: Easing.bezier(0.5, 0, 0.3, 1.5),
        effective: Easing.bezier(0.3, 0, 0.2, 1),
        revealing: Easing.bezier(0.5, 0, 0, 1),
        wary: Easing.bezier(1, 0.5, 0, 0.5),
      },
      entrance: {
        attentive: Easing.bezier(0.5, 0, 0.3, 1.5),
        effective: Easing.bezier(0, 0, 0.2, 1),
        revealing: Easing.bezier(0, 0, 0, 1),
      },
      exit: {
        attentive: Easing.bezier(0.7, 0, 0.5, 1),
        effective: Easing.bezier(0.17, 0, 1, 1),
        revealing: Easing.bezier(0.5, 0, 1, 1),
      },
    },
  },
};

export default paymentLightTheme;
