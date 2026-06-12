import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ScrollView as GestureHandlerScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import type { TabsProps } from './types';
import { TabsContext } from './TabsContext';
import { StyledTabButton } from './TabItem.native';
import { iconColor, textColor, trackColor } from './tabTokens';
import { iconSizeMap, useTabsItemPropRestriction } from './utils';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { useTheme } from '~components/BladeProvider';
import { useControllableState } from '~utils/useControllable';
import { Divider } from '~components/Divider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';
import { throwBladeError } from '~utils/logger';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
type TabListChildProps = { children: React.ReactElement[] };
type TabPanelChildProps = { value: string; children: React.ReactNode; isScrollable?: boolean };
type TabChildProps = {
  value: string;
  children: React.ReactNode;
  // `React.ComponentType<any>` is the canonical type for polymorphic icon
  // components in Blade — they accept the props the host component decides to
  // pass.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leading?: React.ComponentType<any>;
  trailing?: React.ReactNode;
};

const getTabs = (node: React.ReactNode): React.ReactElement<TabChildProps>[] => {
  const children = React.Children.toArray(node);
  const tabList = children.find((child) => getComponentId(child) === 'TabList');
  if (!tabList || !React.isValidElement(tabList)) {
    throwBladeError({
      message:
        '<TabList> is required as a direct child of <Tabs>. Wrap <Tab> elements inside <TabList>.',
      moduleName: 'Tabs',
    });
    // throwBladeError throws in __DEV__ and no-ops in prod; rely on the
    // empty fallback for prod resilience.
    return [];
  }
  return (tabList as React.ReactElement<TabListChildProps>).props.children;
};

const getTabPanels = (
  node: React.ReactNode,
): { value: string; children: React.ReactNode; isScrollable: boolean }[] => {
  const children = React.Children.toArray(node) as React.ReactElement<TabPanelChildProps>[];
  return children
    .filter((child) => getComponentId(child) === 'TabPanel')
    .map((child) => ({
      value: child.props.value,
      children: child.props.children,
      isScrollable: child.props.isScrollable ?? true,
    }));
};

type Route = {
  value: string;
  index: number;
  title: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leading?: React.ComponentType<any>;
  trailing?: React.ReactNode;
};

const getRoutes = (tabs: React.ReactElement<TabChildProps>[]): Route[] =>
  tabs.map((TabComponent, index) => ({
    index,
    title: TabComponent.props.children,
    value: TabComponent.props.value,
    leading: TabComponent.props.leading,
    trailing: TabComponent.props.trailing,
  }));

const getRouteIndexFromValue = ({ value, routes }: { value?: string; routes: Route[] }): number =>
  routes.findIndex((route) => route.value === value);

const getRouteValueFromIndex = ({ index, routes }: { index: number; routes: Route[] }): string =>
  routes[index]?.value ?? '';

// ---------------------------------------------------------------------------
// StyleSheet (defined before components so there are no use-before-define issues)
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  tabBarFullWidth: {
    flex: 1,
  },
  tabFlex: {
    flex: 1,
  },
  indicatorBase: {
    position: 'absolute',
  },
  pagerView: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
  },
});

// ---------------------------------------------------------------------------
// Trailing slot — must be its own component so hooks are called at top level
// ---------------------------------------------------------------------------
const TrailingSlot = ({
  trailing,
  size,
}: {
  trailing: React.ReactNode;
  size: NonNullable<TabsProps['size']>;
}): React.ReactElement | null => {
  const validated = useTabsItemPropRestriction(trailing, size);
  return validated ? (validated as React.ReactElement) : null;
};

// ---------------------------------------------------------------------------
// Animated tab indicator
// ---------------------------------------------------------------------------
type TabBarIndicatorProps = {
  tabWidths: number[];
  selectedIndex: number;
  variant: NonNullable<TabsProps['variant']>;
};

const TabBarIndicator = ({
  tabWidths,
  selectedIndex,
  variant,
}: TabBarIndicatorProps): React.ReactElement | null => {
  const { theme } = useTheme();
  const isFilled = variant === 'filled';

  const targetLeft = tabWidths.slice(0, selectedIndex).reduce((sum, w) => sum + w, 0);
  const targetWidth = tabWidths[selectedIndex] ?? 0;

  const animLeft = useSharedValue(targetLeft);
  const animWidth = useSharedValue(targetWidth);

  React.useEffect(() => {
    animLeft.value = withTiming(targetLeft, { duration: 200 });
    animWidth.value = withTiming(targetWidth, { duration: 200 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLeft, targetWidth]);

  const animStyle = useAnimatedStyle(() => ({
    left: animLeft.value,
    width: animWidth.value,
  }));

  if (tabWidths.length === 0 || targetWidth === 0) return null;

  return (
    <Animated.View
      {...metaAttribute({ name: MetaConstants.TabIndicator })}
      style={[
        styles.indicatorBase,
        isFilled
          ? {
              top: theme.spacing[2],
              bottom: theme.spacing[2],
              backgroundColor: theme.colors.interactive.background.primary.faded,
              borderRadius: theme.border.radius.small,
            }
          : {
              height: theme.border.width.thicker,
              bottom: 0,
              backgroundColor: theme.colors.interactive.border.neutral.highlighted,
            },
        animStyle,
      ]}
    />
  );
};

// ---------------------------------------------------------------------------
// Custom tab bar (replaces TabBar from react-native-tab-view)
// ---------------------------------------------------------------------------
type CustomTabBarProps = {
  routes: Route[];
  selectedIndex: number;
  onTabPress: (index: number) => void;
  size: NonNullable<TabsProps['size']>;
  variant: NonNullable<TabsProps['variant']>;
  isFullWidthTabItem: boolean;
  isFilled: boolean;
};

const CustomTabBar = ({
  routes,
  selectedIndex,
  onTabPress,
  size,
  variant,
  isFullWidthTabItem,
  isFilled,
}: CustomTabBarProps): React.ReactElement => {
  const { theme } = useTheme();
  const [tabWidths, setTabWidths] = React.useState<number[]>([]);
  const scrollable = !isFullWidthTabItem && !isFilled;

  const handleTabLayout = React.useCallback((index: number, width: number) => {
    setTabWidths((prev) => {
      const next = [...prev];
      next[index] = width;
      return next;
    });
  }, []);

  const tabBarStyle = isFilled
    ? {
        shadowOpacity: 0,
        shadowColor: 'transparent' as const,
        borderRadius: theme.border.radius.small,
        borderWidth: theme.border.width.thick,
        borderColor: theme.colors.interactive.border.gray.faded,
        backgroundColor: theme.colors.surface.background.gray.intense,
        padding: theme.spacing[2],
      }
    : {
        shadowOpacity: 0,
        shadowColor: 'transparent' as const,
        backgroundColor: 'transparent' as const,
        ...(variant !== 'borderless' && {
          borderBottomColor: getIn(theme.colors, trackColor),
          borderBottomWidth: theme.border.width.thin,
        }),
      };

  return (
    <View
      {...metaAttribute({ name: MetaConstants.TabList })}
      style={[styles.tabBarContainer, tabBarStyle]}
    >
      <ScrollView
        horizontal
        scrollEnabled={scrollable}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={isFullWidthTabItem || isFilled ? styles.tabBarFullWidth : undefined}
      >
        {routes.map((route, index) => {
          const focused = index === selectedIndex;
          const selectedState = focused ? 'selected' : 'unselected';

          return (
            <Pressable
              key={route.value}
              onPress={() => onTabPress(index)}
              onLayout={(e) => handleTabLayout(index, e.nativeEvent.layout.width)}
              style={isFullWidthTabItem || isFilled ? styles.tabFlex : undefined}
            >
              {/* Divider between filled tabs (before each tab except the first) */}
              {isFilled && index > 0 && index !== selectedIndex ? (
                <Divider
                  left="1px"
                  height="20px"
                  variant="normal"
                  orientation="vertical"
                  top={size === 'large' ? '6px' : '4px'}
                />
              ) : null}
              <StyledTabButton
                size={size}
                variant={variant}
                isFullWidthTabItem={!isFullWidthTabItem && !isFilled}
                {...metaAttribute({ name: MetaConstants.TabItem })}
              >
                <Box display="flex" alignItems="center" flexDirection="row" gap="spacing.3">
                  {route.leading ? (
                    <route.leading
                      size={iconSizeMap[size]}
                      color={iconColor[selectedState].default}
                    />
                  ) : null}
                  <Text
                    color={textColor[selectedState].default}
                    size={size === 'medium' ? 'medium' : 'large'}
                    weight="semibold"
                  >
                    {route.title}
                  </Text>
                  <TrailingSlot trailing={route.trailing} size={size} />
                </Box>
              </StyledTabButton>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Animated indicator rendered absolutely on top of the tab bar */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <TabBarIndicator tabWidths={tabWidths} selectedIndex={selectedIndex} variant={variant} />
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Root Tabs component
// ---------------------------------------------------------------------------
const _Tabs = (
  {
    children,
    defaultValue,
    value,
    onChange,
    size = 'medium',
    variant = 'bordered',
    isFullWidthTabItem = false,
    isLazy = false,
  }: TabsProps,
  // ref is accepted to silence forwardRef warning but not forwarded to a DOM node
  // since the PagerView is managed via an internal ref
  _ref: React.Ref<unknown>,
): React.ReactElement => {
  const tabs = getTabs(children);
  const panels = getTabPanels(children);
  const routes = getRoutes(tabs);
  const isFilled = variant === 'filled';

  const pagerRef = React.useRef<PagerView>(null);

  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: (val) => {
      onChange?.(val);
    },
  });

  const routeIndex = getRouteIndexFromValue({ value: selectedValue, routes });
  // Default to 0 while selectedValue is not yet initialised
  const safeIndex = routeIndex < 0 ? 0 : routeIndex;

  const setIndex = React.useCallback(
    (index: number, skipUpdate = false) => {
      const val = getRouteValueFromIndex({ index, routes });
      setSelectedValue(() => val, skipUpdate);
    },
    [routes, setSelectedValue],
  );

  // Set initial value when uncontrolled
  React.useLayoutEffect(() => {
    if (selectedValue) return;
    setIndex(0, true);
  }, [selectedValue, setIndex]);

  // Sync PagerView imperatively when the controlled value changes
  React.useEffect(() => {
    if (routeIndex >= 0 && pagerRef.current) {
      pagerRef.current.setPage(routeIndex);
    }
  }, [routeIndex]);

  const contextValue = {
    baseId: '',
    selectedValue: selectedValue ?? '',
    isVertical: false,
    size,
    variant,
    isFullWidthTabItem,
  };

  // Tab press: ask the PagerView to animate to the target page. The pager
  // fires `onPageSelected` once the transition is committed, which is the
  // single source of truth that updates our state — driving it from both
  // sides would double-update on every tap.
  const handleTabPress = React.useCallback((index: number) => {
    pagerRef.current?.setPage(index);
  }, []);

  const handlePageSelected = React.useCallback(
    (e: { nativeEvent: { position: number } }) => {
      setIndex(e.nativeEvent.position);
    },
    [setIndex],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <View style={styles.rootContainer}>
        <CustomTabBar
          routes={routes}
          selectedIndex={safeIndex}
          onTabPress={handleTabPress}
          size={size}
          variant={variant}
          isFullWidthTabItem={isFullWidthTabItem}
          isFilled={isFilled}
        />
        {/*
          PagerView APIs we depend on: `setPage`, `initialPage`,
          `onPageSelected`, `scrollEnabled`. All four are stable across the
          v6 → v8 release line (confirmed against react-native-pager-view
          CHANGELOG); broadening the peer-range did not change the surface
          we consume.

          Panel state preservation: when `isLazy=false` (default), all panels
          render as siblings inside PagerView — React preserves the mounted
          tree across tab switches, so form inputs, scroll positions, etc.
          survive. When `isLazy=true`, off-screen panels render `null` and
          unmount; state is lost on each switch. This matches the documented
          lazy semantics on web.
        */}
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={safeIndex}
          onPageSelected={handlePageSelected}
          scrollEnabled={true}
        >
          {panels.map((panel, index) => {
            const shouldRender = !isLazy || index === safeIndex;
            return (
              <View key={panel.value} style={styles.pagerView}>
                {shouldRender ? (
                  // Skip auto-wrap when: consumer opted out via isScrollable=false,
                  // or the single top-level child is already a RN / RNGH ScrollView.
                  // For other scroll containers (Animated.ScrollView,
                  // KeyboardAwareScrollView, etc.) set isScrollable={false} on TabPanel.
                  !panel.isScrollable ||
                  (React.isValidElement(panel.children) &&
                    (panel.children.type === ScrollView ||
                      panel.children.type === GestureHandlerScrollView)) ? (
                    panel.children
                  ) : (
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ flexGrow: 1 }}
                    >
                      {panel.children}
                    </ScrollView>
                  )
                ) : null}
              </View>
            );
          })}
        </PagerView>
      </View>
    </TabsContext.Provider>
  );
};

const Tabs = React.forwardRef(_Tabs);

export { Tabs };
