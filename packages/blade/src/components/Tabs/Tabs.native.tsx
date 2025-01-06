/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable babel/new-cap */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { TabBar, TabView } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import type { TabsProps } from './types';
import { TabsContext } from './TabsContext';
import { StyledTabButton } from './TabItem.native';
import { iconColor, textColor, trackColor } from './tabTokens';
import { iconSizeMap, useTabsItemPropRestriction } from './utils';
import { TabIndicator } from './TabIndicator';
import { SafeSceneMap } from './SafeSceneMap.native';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { useTheme } from '~components/BladeProvider';
import { useControllableState } from '~utils/useControllable';
import { Divider } from '~components/Divider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const getTabs = (node: React.ReactNode): React.ReactElement[] => {
  const children = React.Children.toArray(node);
  const tabList = children.find((child) => getComponentId(child) === 'TabList');
  if (!tabList || !React.isValidElement(tabList)) {
    throw new Error('TabList is required');
  }

  return tabList.props.children;
};

const getTabPanels = (node: React.ReactNode): Record<string, () => React.ReactElement> => {
  const children = React.Children.toArray(node) as React.ReactElement[];
  return children
    .filter((child) => getComponentId(child) === 'TabPanel')
    .reduce((prev, curr) => {
      return { ...prev, [curr.props.value]: () => curr.props.children };
    }, {});
};

const getRoutes = (tabs: React.ReactElement[]) => {
  return tabs.map((TabComponent, index) => ({
    index,
    title: TabComponent.props.children,
    key: TabComponent.props.value,
    value: TabComponent.props.value,
    leading: TabComponent.props.leading,
    trailing: TabComponent.props.trailing,
  }));
};

type Route = {
  value?: string;
  index?: number;
};

const getRouteIndexFromValue = ({ value, routes }: { value?: string; routes: Route[] }) =>
  routes.findIndex((route) => route.value === value);

const getRouteValueFromIndex = ({ index, routes }: { index?: number; routes: Route[] }) =>
  routes.find((route) => route.index === index)?.value!;

const _Tabs = ({
  children,
  defaultValue,
  value,
  onChange,
  size = 'medium',
  variant = 'bordered',
  isFullWidthTabItem = false,
  isLazy = false,
}: TabsProps): React.ReactElement => {
  const { theme } = useTheme();
  const tabs = getTabs(children);
  const panels = getTabPanels(children);
  const routes = getRoutes(tabs);
  const isFilled = variant === 'filled';

  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: (value) => {
      onChange?.(value);
    },
  });

  const routeIndex = getRouteIndexFromValue({
    value: selectedValue,
    routes,
  });

  const setIndex = React.useCallback(
    (index: number, skipUpdate = false) => {
      const value = getRouteValueFromIndex({ index, routes });
      // If skipUpdate is true, useControlledState will not call the onChange callback
      // This is useful when we want to set the initial value
      setSelectedValue(() => value, skipUpdate);
    },
    [routes, setSelectedValue],
  );

  // In mobile we can't have vertical tabs because of the lack of screen space
  // So we always set it to false
  const isVertical = false;
  const contextValue = {
    baseId: '',
    selectedValue,
    isVertical,
    size,
    variant,
    isFullWidthTabItem,
  };

  // Set initial value
  React.useLayoutEffect(() => {
    if (selectedValue) return;
    setIndex(0, true);
  }, [selectedValue, setIndex]);

  const renderTabLabel = React.useCallback(
    ({
      route,
      focused,
    }: {
      route: { title: string; leading?: React.ComponentType<any>; trailing?: React.ReactNode };
      focused: boolean;
    }) => {
      const { title, leading: Leading, trailing } = route;
      const selectedState = focused ? 'selected' : 'unselected';
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const validatedTrailingComponent = useTabsItemPropRestriction(trailing, size);

      return (
        <StyledTabButton
          size={size}
          variant={variant}
          isFullWidthTabItem={!isFullWidthTabItem && !isFilled}
          {...metaAttribute({ name: MetaConstants.TabItem })}
        >
          <Box display="flex" alignItems="center" flexDirection="row" gap="spacing.3">
            {Leading ? (
              <Leading size={iconSizeMap[size]} color={iconColor[selectedState].default} />
            ) : null}
            <Text
              color={textColor[selectedState].default}
              size={size === 'medium' ? 'medium' : 'large'}
              weight="semibold"
            >
              {title}
            </Text>
            {validatedTrailingComponent}
          </Box>
        </StyledTabButton>
      );
    },
    [isFullWidthTabItem, isFilled, size, variant],
  );

  const renderTabBar = React.useCallback(
    (props: any) => (
      <TabBar
        {...props}
        {...metaAttribute({ name: MetaConstants.TabList })}
        gap={0}
        android_ripple={{ borderless: true, color: 'transparent' }}
        scrollEnabled={!isFullWidthTabItem && !isFilled}
        tabStyle={{
          padding: 0,
          margin: 0,
          minHeight: 0,
        }}
        style={{
          ...(isFilled
            ? {
                shadowOpacity: 0,
                shadowColor: 'transparent',
                borderRadius: theme.border.radius.small,
                borderWidth: theme.border.width.thick,
                borderColor: theme.colors.interactive.border.gray.faded,
                backgroundColor: theme.colors.surface.background.gray.intense,
                padding: theme.spacing[2],
              }
            : {
                shadowOpacity: 0,
                shadowColor: 'transparent',
                backgroundColor: 'transparent',
                ...(variant !== 'borderless' && {
                  borderBottomColor: getIn(theme.colors, trackColor),
                  borderBottomWidth: theme.border.width.thin,
                }),
              }),
        }}
        renderIndicator={TabIndicator}
        renderLabel={renderTabLabel}
        // This is a bit hacky, but this is the only way to put a divider between tabs
        // Since there is no way to use tablist.map() to render the tabs
        renderBadge={() => {
          if (!isFilled) return null;
          if (routeIndex === 0) {
            return null;
          }
          return (
            <Divider
              left="1px"
              height="20px"
              variant="normal"
              orientation="vertical"
              // again, hacky but no way to get exact height of the tabbar
              // Since we already know the height of large,medium size tabs, I just hardcode it here.
              top={size === 'large' ? '6px' : '4px'}
            />
          );
        }}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFullWidthTabItem, isFilled, renderTabLabel],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <TabView
        navigationState={{
          index: routeIndex,
          routes,
        }}
        renderScene={SafeSceneMap(panels)}
        renderTabBar={renderTabBar}
        onIndexChange={(idx) => {
          setIndex(idx);
        }}
        initialLayout={initialLayout}
        lazy={isLazy}
      />
    </TabsContext.Provider>
  );
};

const Tabs = React.forwardRef(_Tabs);

export { Tabs };
