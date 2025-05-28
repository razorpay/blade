/* eslint-disable react/jsx-no-useless-fragment */
import type {
  InfoGroupProps,
  InfoItemProps,
  InfoItemKeyProps,
  InfoItemValueProps,
  InfoItemIconProps,
} from './types';
import { throwBladeError } from '~utils/logger';

const InfoGroup = (_props: InfoGroupProps): React.ReactElement => {
  throwBladeError({
    message: 'InfoGroup is not yet implemented for React Native',
    moduleName: 'InfoGroup',
  });

  return <></>;
};

const InfoItem = (_props: InfoItemProps): React.ReactElement => {
  throwBladeError({
    message: 'InfoItem is not yet implemented for React Native',
    moduleName: 'InfoItem',
  });

  return <></>;
};

const InfoItemKey = (_props: InfoItemKeyProps): React.ReactElement => {
  throwBladeError({
    message: 'InfoItemKey is not yet implemented for React Native',
    moduleName: 'InfoItemKey',
  });

  return <></>;
};

const InfoItemValue = (_props: InfoItemValueProps): React.ReactElement => {
  throwBladeError({
    message: 'InfoItemValue is not yet implemented for React Native',
    moduleName: 'InfoItemValue',
  });

  return <></>;
};

const InfoItemIcon = (_props: InfoItemIconProps): React.ReactElement => {
  throwBladeError({
    message: 'InfoItemIcon is not yet implemented for React Native',
    moduleName: 'InfoItemIcon',
  });

  return <></>;
};

export { InfoGroup, InfoItem, InfoItemKey, InfoItemValue, InfoItemIcon };
