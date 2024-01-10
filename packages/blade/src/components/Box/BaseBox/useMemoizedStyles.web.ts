import React from 'react';
import type { CSSObject } from 'styled-components';
import { getBaseBoxStyles } from './baseBoxStyles';
import type { BaseBoxProps } from './types';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import type { ColorSchemeNames } from '~tokens/theme';
import { logger } from '~utils/logger';

const getMemoDependency = (
  props: BaseBoxProps & { theme?: Theme } & { colorScheme: ColorSchemeNames },
): string | BaseBoxProps => {
  // These are the props that change nothing in the getBaseBoxStyles calculations
  const { theme, colorScheme, children, className, id, ...rest } = props;
  let dependencyPropString: string | BaseBoxProps = '';
  try {
    // I know this looks illegal but Dan approves it - https://twitter.com/dan_abramov/status/1104414272753487872?s=20
    // A lot of times passing object to dependency prop isn't efficient and mostly won't work
    // Hence we JSON.strinfigy and pass the string as dependency prop. React handles this way better.
    dependencyPropString = `${JSON.stringify(rest)}-${theme?.name}-${colorScheme}`;
  } catch (err: unknown) {
    if (__DEV__) {
      logger({
        message: `stringification of props failed in BaseBox so falling back to re-calculations on all changes\n\n If you see this warning, please create issue on https://github.com/razorpay/blade as this could degrade runtime styling performance ${err}`,
        moduleName: 'BaseBox',
        type: 'warn',
      });
    }

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
  const { colorScheme } = useTheme();
  const boxPropsMemoDependency = getMemoDependency({ ...boxProps, colorScheme });
  const boxPropsCSSObject = React.useMemo(
    () => getBaseBoxStyles({ ...boxProps, theme: boxProps.theme }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boxPropsMemoDependency],
  );

  return boxPropsCSSObject;
};

export { useMemoizedStyles, getMemoDependency };
