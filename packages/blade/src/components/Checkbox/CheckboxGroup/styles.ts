import type { CSSObject } from 'styled-components';
import type { Theme } from '../../BladeProvider';
import type { CheckboxGroupProps } from './CheckboxGroup';
import { makeSpace } from '~utils';

type WithTheme = {
  theme: Theme;
};

const getCheckboxGroupContentStyles = ({
  theme,
  labelPosition,
}: WithTheme & Pick<CheckboxGroupProps, 'labelPosition'>): CSSObject => {
  return {
    display: 'flex',
    flexDirection: 'column',
    marginTop: labelPosition === 'top' ? makeSpace(theme.spacing[1]) : 'auto',
    marginBottom: makeSpace(theme.spacing[1]),
    gap: makeSpace(theme.spacing[1]),
  };
};

const getCheckboxGroupFieldStyles = ({
  labelPosition,
}: Pick<CheckboxGroupProps, 'labelPosition'>): CSSObject => {
  return {
    display: 'flex',
    flexDirection: labelPosition === 'top' ? 'column' : 'row',
  };
};

export { getCheckboxGroupContentStyles, getCheckboxGroupFieldStyles };
