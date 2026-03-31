import React from 'react';
import { TopNavContext, useTopNavContext } from './TopNavContext';
import type { BoxProps } from '~components/Box';
import { BladeProvider, useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import {
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
} from '~components/SideNav/tokens';
import { size } from '~tokens/global';
import { bladeTheme } from '~tokens/theme';
import { makeSize } from '~utils';
import { componentZIndices } from '~utils/componentZIndices';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { DataAnalyticsAttribute, BladeElementRef, TestID } from '~utils/types';

const TOP_NAV_HEIGHT = size[56];

type TopNavProps = {
  children: React.ReactNode;
  /**
   * Sets the background color variant of the TopNav.
   *
   * - `'neutral'` (default): Uses the static black background. Existing behavior.
   * - `'primary'`: Uses the primary brand color (`surface.background.primary.intense`).
   *
   * Passing an explicit `backgroundColor` prop will override this variant.
   *
   * @default 'neutral'
   */
  variant?: 'primary' | 'neutral';
} & Pick<
  BoxProps,
  | 'padding'
  | 'paddingTop'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingX'
  | 'paddingY'
  | 'backgroundColor'
  | 'position'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'width'
  | 'zIndex'
  | keyof DataAnalyticsAttribute
> &
  TestID &
  StyledPropsBlade;

const TOP_NAV_BACKGROUND_COLOR: Record<
  NonNullable<TopNavProps['variant']>,
  BaseBoxProps['backgroundColor']
> = {
  neutral: 'interactive.background.staticBlack.default',
  primary: 'surface.background.primary.intense',
};

const _TopNav = (
  { children, variant = 'neutral', backgroundColor, ...rest }: TopNavProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { colorScheme } = useTheme();
  const resolvedBackgroundColor = backgroundColor ?? TOP_NAV_BACKGROUND_COLOR[variant];

  return (
    <TopNavContext.Provider value={{ colorScheme, variant }}>
      {/* We are forcing the theme to dark here because the TopNav is always in dark mode.
       we also want components inside the TopNav to be in the same theme as the TopNav.
      */}
      <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
        <BaseBox
          ref={ref as never}
          display="grid"
          gridTemplateColumns="auto minmax(0, 1fr) auto"
          alignItems="center"
          position="sticky"
          top="0px"
          width="100%"
          paddingY={{ base: 'spacing.3', m: 'spacing.0' }}
          paddingX={{ base: 'spacing.4', m: 'spacing.3' }}
          height={makeSize(TOP_NAV_HEIGHT)}
          zIndex={componentZIndices.topnav}
          backgroundColor={resolvedBackgroundColor}
          {...rest}
          {...metaAttribute({ name: MetaConstants.TopNav, testID: rest.testID })}
          {...makeAnalyticsAttribute(rest)}
        >
          {children}
        </BaseBox>
      </BladeProvider>
    </TopNavContext.Provider>
  );
};

const TopNav = React.forwardRef(_TopNav);

const TopNavBrand = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseBox
      flexDirection="row"
      width={{
        base: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
        xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
      }}
      {...metaAttribute({ name: MetaConstants.TopNavBrand })}
      paddingY="spacing.5"
      marginLeft="spacing.6"
    >
      <BaseBox width="100%">{children}</BaseBox>
    </BaseBox>
  );
};

const TopNavContent = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      alignItems="center"
      alignSelf="center"
      justifyContent="center"
      {...metaAttribute({ name: MetaConstants.TopNavContent })}
    >
      {children}
    </BaseBox>
  );
};

const TopNavActions = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const topNavContext = useTopNavContext();
  const { colorScheme } = useTheme();
  const topNavActions = (
    <BaseBox
      alignSelf="flex-start"
      display="flex"
      gap="spacing.3"
      alignItems="center"
      marginTop="spacing.1"
      padding="spacing.3"
      paddingRight="spacing.2"
      borderTopLeftRadius="medium"
      borderTopRightRadius="medium"
      {...metaAttribute({ name: MetaConstants.TopNavActions })}
    >
      {children}
    </BaseBox>
  );

  if (topNavContext) {
    return topNavActions;
  }

  return (
    <TopNavContext.Provider value={{ colorScheme }}>
      <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
        {topNavActions}
      </BladeProvider>
    </TopNavContext.Provider>
  );
};

export { TopNav, TopNavBrand, TopNavContent, TopNavActions };
export type { TopNavProps };
