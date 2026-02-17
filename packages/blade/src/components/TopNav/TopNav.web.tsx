import React from 'react';
import type { BoxProps } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import {
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
} from '~components/SideNav/tokens';
import { size } from '~tokens/global';
import { makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { componentZIndices } from '~utils/componentZIndices';
import type { DataAnalyticsAttribute, BladeElementRef, TestID } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { TopNavContext, useTopNavContext } from './TopNavContext';
import { BladeProvider, useTheme } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

const TOP_NAV_HEIGHT = size[56];

type TopNavProps = {
  children: React.ReactNode;
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

const _TopNav = (
  { children, ...rest }: TopNavProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { colorScheme } = useTheme();

  return (
    <TopNavContext.Provider value={{ colorScheme }}>
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
        {...rest}
        {...metaAttribute({ name: MetaConstants.TopNav, testID: rest.testID })}
        {...makeAnalyticsAttribute(rest)}
      >
        {children}
      </BaseBox>
    </TopNavContext.Provider>
  );
};

const TopNav = React.forwardRef(_TopNav);

const TopNavBrand = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseBox
      flexDirection="row"
      alignSelf="center"
      width={{
        base: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
        xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
      }}
      {...metaAttribute({ name: MetaConstants.TopNavBrand })}
      paddingY="spacing.5"
    >
      <BaseBox width="100%" textAlign="center">
        {children}
      </BaseBox>
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
  return (
    <BaseBox
      alignSelf="flex-start"
      display="flex"
      gap="spacing.3"
      alignItems="center"
      marginTop="spacing.1"
      padding="spacing.3"
      borderTopLeftRadius="medium"
      borderTopRightRadius="medium"
      {...metaAttribute({ name: MetaConstants.TopNavActions })}
    >
      {topNavContext ? (
        <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
          {children}
        </BladeProvider>
      ) : (
        children
      )}
    </BaseBox>
  );
};

export { TopNav, TopNavBrand, TopNavContent, TopNavActions };
export type { TopNavProps };
