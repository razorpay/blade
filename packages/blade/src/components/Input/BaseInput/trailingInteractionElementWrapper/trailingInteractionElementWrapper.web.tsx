import type { trailingInteractionElementWrapperProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';

const TrailingInteractionElementWrapper = (
  props: trailingInteractionElementWrapperProps & BaseBoxProps & { [key: string]: unknown },
): React.ReactElement => {
  return <BaseBox {...props}>{props.children}</BaseBox>;
};

export { TrailingInteractionElementWrapper };
