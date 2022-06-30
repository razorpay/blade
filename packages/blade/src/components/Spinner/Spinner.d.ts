import type { DotNotationColorStringToken } from '../../../_helpers/types';
import type { Theme } from '../../BladeProvider';
import type { SpinnerSize } from './spinnerTokens';

export { default } from './Spinner.web';

export type SpinnerProps = {
  color: DotNotationColorStringToken<Theme['colors']>;
  size: SpinnerSize;
};
