import React from 'react';
import type { CSSObject } from 'styled-components';
import { getStyledProps } from './getStyledProps';
import { getBaseBoxStyles, getDependencyProps } from '~components/Box/BaseBox/getBaseBoxStyles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStyledProps = (props: Record<string, any>): CSSObject => {
  const styledPropsStyles = getStyledProps(props);
  const styledPropsMemoDependency = getDependencyProps(styledPropsStyles);
  const styledPropsCSSObject = React.useMemo(
    () => getBaseBoxStyles({ ...styledPropsStyles, theme: props.theme }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [styledPropsMemoDependency],
  );

  return styledPropsCSSObject;
};

export { useStyledProps };
