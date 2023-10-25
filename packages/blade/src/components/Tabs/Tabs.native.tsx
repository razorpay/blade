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
import { textColor } from './tabTokens';
import { iconSizeMap, useTabsItemPropRestriction } from './utils';
import { TabIndicator } from './TabIndicator';
import { SafeSceneMap } from './SafeSceneMap.native';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { useTheme } from '~utils';
import { useControllableState } from '~utils/useControllable';
import { Divider } from '~components/Divider';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const getTabs = (children: React.ReactNode): React.ReactElement[] => {
  const childs = React.Children.toArray(children);
  const tabList = childs.find((child) => getComponentId(child) === 'TabList');
  if (!tabList || !React.isValidElement(tabList)) throw new Error('TabList is required');

  return tabList.props.children;
};

const getTabPanels = (children: React.ReactNode): Record<string, () => React.ReactElement> => {
  const childs = React.Children.toArray(children) as React.ReactElement[];
  return childs
    .filter((child) => getComponentId(child) === 'TabPanel')
    .reduce((prev, curr) => {
      return { ...prev, [curr.props.value]: () => curr.props.children };
    }, {});
};

const getRoutes = (tabs: React.ReactElement[]) => {
  return tabs.map((TabComponent, index) => ({
    index,
    testID: TabComponent.props.testID,
    title: TabComponent.props.children,
    key: TabComponent.props.value,
    value: TabComponent.props.value,
    leading: TabComponent.props.leading,
    trailing: TabComponent.props.trailing,
    onClick: TabComponent.props.onClick,
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

const Tabs = ({
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

  const index = getRouteIndexFromValue({
    value: selectedValue,
    routes,
  });

  const setIndex = React.useCallback(
    (index: number, skipUpdate = false) => {
      const value = getRouteValueFromIndex({ index, routes });
      setSelectedValue(() => value, skipUpdate);
    },
    [routes, setSelectedValue],
  );

  const isVertical = false;
  const contextValue = {
    baseId: '',
    selectedValue,
    isVertical,
    size,
    variant,
    isFullWidthTabItem,
    setSelectedValue: setIndex,
  };

  // Set initial value
  React.useLayoutEffect(() => {
    if (selectedValue) return;
    setIndex(0, true);
  }, [selectedValue, setIndex]);

  const renderTabLabel = React.useCallback(
    ({ route, focused }) => {
      const { title, leading: Leading, trailing } = route;
      const selectedState = focused ? 'selected' : 'unselected';
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const validatedTrailingComponent = useTabsItemPropRestriction(trailing, size);

      return (
        <StyledTabButton
          size={size}
          variant={variant}
          isFullWidthTabItem={!isFullWidthTabItem && !isFilled}
        >
          <Box display="flex" alignItems="center" flexDirection="row" gap="spacing.3">
            {Leading ? (
              <Leading
                size={iconSizeMap[size]}
                color={
                  selectedState === 'selected'
                    ? 'brand.primary.500'
                    : 'surface.action.icon.default.lowContrast'
                }
              />
            ) : null}
            <Text
              color={textColor[selectedState].default}
              size={size === 'medium' ? 'medium' : 'large'}
              weight={size === 'medium' ? 'bold' : 'regular'}
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
    (props) => (
      <TabBar
        {...props}
        gap={0}
        android_ripple={{ borderless: true, color: 'transparent' }}
        scrollEnabled={!isFullWidthTabItem && !isFilled}
        tabStyle={{
          padding: 0,
          margin: 0,
          minHeight: 0,
        }}
        contentContainerStyle={
          isFilled
            ? {}
            : {
                borderBottomColor: theme.colors.surface.border.normal.lowContrast,
                borderBottomWidth: 1.5,
              }
        }
        style={{
          ...(isFilled
            ? {
                shadowOpacity: 0,
                shadowColor: 'transparent',
                borderRadius: theme.border.radius.small,
                borderWidth: theme.border.width.thick,
                borderColor: theme.colors.surface.border.normal.lowContrast,
                backgroundColor: theme.colors.surface.background.level2.lowContrast,
                padding: theme.spacing[2],
              }
            : {
                shadowOpacity: 0,
                shadowColor: 'transparent',
                backgroundColor: 'transparent',
              }),
        }}
        renderIndicator={TabIndicator}
        renderLabel={renderTabLabel}
        // This is a bit hacky, but this is the only way to put a divider between tabs
        // Since there is no way to use tablist.map() to render the tabs
        renderBadge={() => {
          if (!isFilled) return null;
          if (index === 0) {
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
          index,
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

export { Tabs };
