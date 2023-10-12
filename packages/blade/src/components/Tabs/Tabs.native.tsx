/* eslint-disable babel/new-cap */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { SceneMap, TabBar, TabBarIndicator, TabBarItem, TabView } from 'react-native-tab-view';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import type { TabsProps } from './types';
import { TabsContext } from './TabsContext';
import { StyledTabButton } from './TabItem.native';
import { textColor } from './tabTokens';
import { iconSizeMap, useTabsItemPropRestriction } from './utils';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { useTheme } from '~utils';

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
  routes.find((route) => route.index === index)?.value;

const Tabs = ({
  children,
  defaultValue,
  value,
  onChange,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'bordered',
  autoWidth = false,
}: TabsProps): React.ReactElement => {
  const { theme } = useTheme();
  const tabs = getTabs(children);
  const panels = getTabPanels(children);
  const routes = getRoutes(tabs);
  const isFilled = variant === 'filled';

  const initialIndex =
    value ?? defaultValue
      ? getRouteIndexFromValue({
          routes,
          value: value ?? defaultValue,
        })
      : 0;
  const [index, setIndex] = React.useState(initialIndex);

  // React.useEffect(() => {
  //   if (!isUndefined(value))
  //     setIndex(
  //       getRouteIndexFromValue({
  //         routes,
  //         value,
  //       }),
  //     );
  // }, [value, routes]);

  const isVertical = orientation === 'vertical';
  const contextValue = {
    baseId: '',
    selectedValue: '',
    isVertical,
    size,
    variant,
    autoWidth,
    setSelectedValue: () => {},
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <TabView
        navigationState={{
          index,
          routes,
        }}
        renderScene={SceneMap(panels)}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            gap={0}
            android_ripple={{ borderless: true, color: 'transparent' }}
            scrollEnabled={!autoWidth}
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
                    borderRadius: theme.border.radius.small,
                    borderWidth: theme.border.width.thick,
                    borderColor: theme.colors.surface.border.normal.lowContrast,
                    backgroundColor: theme.colors.surface.background.level2.lowContrast,
                    padding: theme.spacing[2],
                  }
                : { backgroundColor: 'transparent' }),
            }}
            renderIndicator={(props) => {
              return (
                <TabBarIndicator
                  {...props}
                  style={{
                    ...(isFilled
                      ? {
                          // width:
                          //   props?.getTabWidth(props.navigationState.index) - theme.spacing[2] * 2,
                          height:
                            props.layout.height - theme.border.width.thick - theme.spacing[2] * 2,
                          marginBottom: theme.spacing[2],
                          marginLeft: theme.spacing[2],
                          backgroundColor: theme.colors.brand.primary[300],
                          borderRadius: theme.border.radius.small,
                        }
                      : {
                          height: theme.border.width.thick,
                          backgroundColor: theme.colors.brand.primary[500],
                        }),
                  }}
                />
              );
            }}
            renderLabel={({ route, focused }) => {
              const { title, leading, trailing } = route;
              const selectedState = focused ? 'selected' : 'unselected';
              // const validatedTrailingComponent = useTabsItemPropRestriction(trailing, size);
              return (
                <StyledTabButton
                  autoWidth={!autoWidth}
                  variant={variant}
                  size={size}
                  isSelected={focused}
                  isVertical={false}
                >
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
                    {/* {validatedTrailingComponent} */}
                  </Box>
                </StyledTabButton>
              );
            }}
          />
        )}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        lazy={false}
      />
    </TabsContext.Provider>
  );
};

export { Tabs };
