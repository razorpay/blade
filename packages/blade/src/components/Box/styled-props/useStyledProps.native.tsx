import type { CSSObject } from 'styled-components';
import { getStyledProps } from './getStyledProps';
import { getBaseBoxStyles } from '~components/Box/BaseBox/getBaseBoxStyles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStyledProps = (props: Record<string, any>): CSSObject => {
  const styledPropsStyles = getStyledProps(props);
  const styledPropsCSSObject = getBaseBoxStyles({ ...styledPropsStyles, theme: props.theme });
  return styledPropsCSSObject;
};

export { useStyledProps };
