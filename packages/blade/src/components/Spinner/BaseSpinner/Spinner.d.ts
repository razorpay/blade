import type { DotNotationColorStringToken } from '../../../_helpers/types';
import type { Theme } from '../../BladeProvider';
import type { SpinnerSizes } from './spinnerTokens';

export { default } from './Spinner.web';

export type SpinnerProps = {
  color: DotNotationColorStringToken<Theme['colors']>;
  size: keyof SpinnerSizes;
};
