import type { SpinnerSize } from './spinnerTokens';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~src/_helpers/types';

export { default } from './Spinner.web';

export type SpinnerProps = {
  color: DotNotationColorStringToken<Theme['colors']>;
  size: SpinnerSize;
};
