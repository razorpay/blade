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
import { useFirstRender } from '~utils/useFirstRender';

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

const Tabs = ({
  children,
  defaultValue,
  value,
  onChange,
  size = 'medium',
  variant = 'bordered',
  autoWidth = false,
}: TabsProps): React.ReactElement => {
  const { theme } = useTheme();
  const isFirstRender = useFirstRender();
  const tabs = getTabs(children);
  const panels = getTabPanels(children);
  const routes = getRoutes(tabs);
  const isFilled = variant === 'filled';

  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: (value) => {
      if (isFirstRender) return;
      onChange?.(value);
    },
  });

  const index = getRouteIndexFromValue({
    value: selectedValue,
    routes,
  });

  const setIndex = React.useCallback(
    (index: number) => {
      const value = getRouteValueFromIndex({ index, routes });
      setSelectedValue(() => value);
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
    autoWidth,
    setSelectedValue: setIndex,
  };

  // Set initial value
  React.useLayoutEffect(() => {
    if (selectedValue) return;
    setIndex(0);
  }, [selectedValue, setIndex]);

  const renderTabLabel = React.useCallback(
    ({ route, focused }) => {
      const { title, leading, trailing } = route;
      const selectedState = focused ? 'selected' : 'unselected';
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const validatedTrailingComponent = useTabsItemPropRestriction(trailing, size);

      return (
        <StyledTabButton autoWidth={!autoWidth && !isFilled} variant={variant} size={size}>
          <Box display="flex" alignItems="center" flexDirection="row" gap="spacing.3">
            {leading
              ? React.cloneElement(leading as React.ReactElement, {
                  size: iconSizeMap[size],
                  color: `surface.action.icon.default.lowContrast`,
                })
              : null}
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
    [autoWidth, isFilled, size, variant],
  );

  const renderTabBar = React.useCallback(
    (props) => (
      <TabBar
        {...props}
        gap={0}
        android_ripple={{ borderless: true, color: 'transparent' }}
        scrollEnabled={!autoWidth && !isFilled}
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
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoWidth, isFilled, renderTabLabel],
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
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        lazy={false}
      />
    </TabsContext.Provider>
  );
};

export { Tabs };
