import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

const BASEINPUT_MIN_HEIGHT: number = size['36'];
const BASEINPUT_BOTTOM_LINE_HEIGHT: number = size['1'];

// @todo: add animations for input here

const AnimatedBaseInputWrapper = (props: BaseBoxProps): React.ReactElement => (
  <BaseBox {...props} />
);

export { AnimatedBaseInputWrapper };
