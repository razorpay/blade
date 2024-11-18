import { TouchableOpacity } from 'react-native';
import type { TouchableOpacityProps } from 'react-native';
import type { trailingInteractionElementWrapperProps } from './types';
import type { BaseBoxProps } from '~components/Box/BaseBox';

const TrailingInteractionElementWrapper = (
  props: trailingInteractionElementWrapperProps & BaseBoxProps & { [key: string]: unknown },
): React.ReactElement => {
  return (
    <TouchableOpacity onPress={props.onClick} {...(props as TouchableOpacityProps)}>
      {props.children}
    </TouchableOpacity>
  );
};

export { TrailingInteractionElementWrapper };
