import React from 'react';
import type { CSSObject } from 'styled-components';
import { getBaseBoxStyles } from './getBaseBoxStyles';
import type { BaseBoxProps } from './types';
import type { Theme } from '~components/BladeProvider';

const getDependencyProps = (props: BaseBoxProps & { theme?: Theme }): string | BaseBoxProps => {
  // These are the props that change nothing in the getBaseBoxStyles calculations
  const { theme, children, className, id, ...rest } = props;
  let dependencyPropString: string | BaseBoxProps = '';
  try {
    dependencyPropString = JSON.stringify(rest);
  } catch (err: unknown) {
    console.warn(
      '[Blade - BaseBox]: stringification of props failed in BaseBox so falling back to re-calculations on all changes\n\n If you see this warning, please create issue on https://github.com/razorpay/blade as this could degrade runtime styling performance',
      err,
    );

    dependencyPropString = rest;
  }

  return dependencyPropString;
};

/**
 * Uses `React.useMemo` to watch over changing dependencies and only calculate `getBaseBoxStyles` when needed.
 *
 * This helps us in not doing the CSS calculations on screen size change or randomly when not required
 *
 * Without memo, the Box style recalculations will run on things like screen size change or randomly during scroll.
 * With memo, it only runs once for each box and then runs when any of the prop changes
 *
 * Checkout: https://github.com/razorpay/blade/pull/1009#discussion_r1113767442 for benchmarks
 */
const useMemoizedStyles = (boxProps: BaseBoxProps & { theme: Theme }): CSSObject => {
  const boxPropsMemoDependency = getDependencyProps(boxProps);
  const boxPropsCSSObject = React.useMemo(
    () => getBaseBoxStyles({ ...boxProps, theme: boxProps.theme }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boxPropsMemoDependency],
  );

  return boxPropsCSSObject;
};

export { useMemoizedStyles, getDependencyProps };
