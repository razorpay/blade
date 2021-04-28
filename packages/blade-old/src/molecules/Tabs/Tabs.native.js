import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { TabView } from 'react-native-tab-view';
import { getIconNames } from '../../_helpers/icon';
import isDefined from '../../_helpers/isDefined';
import TabBar from './TabBar';

const initialLayout = {
  width: Dimensions.get('window').width,
};

const Tab = () => {
  return null;
};

Tab.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.oneOf(getIconNames()),
  testID: PropTypes.string,
};

Tab.defaultProps = {
  onPress: () => {},
  disabled: false,
  testID: 'ds-tab-button',
};

const getTabs = ({ children }) => {
  // Return only Tab Elements
  return React.Children.toArray(children);
};

const shouldDisableSwipe = ({ tabs }) => Boolean(tabs.find((tab) => tab.props.disabled === true));

const getRoutes = ({ tabs }) => {
  return tabs.map((TabComponent, index) => ({
    index,
    title: TabComponent.props.title,
    key: TabComponent.props.value,
    value: TabComponent.props.value,
    onPress: TabComponent.props.onPress,
    disabled: TabComponent.props.disabled,
    icon: TabComponent.props.icon,
    testID: TabComponent.props.testID,
  }));
};

const getRouteIndexFromValue = ({ value, routes }) =>
  routes.findIndex((route) => route.value === value);

const getRouteValueFromIndex = ({ index, routes }) =>
  routes.find((route) => route.index === index)?.value;

const Tabs = ({ children, defaultValue, value, onChange, scrollEnabled, gestureHandlerProps }) => {
  const tabs = getTabs({
    children,
  });
  const routes = getRoutes({
    tabs,
  });
  const disableSwipe = shouldDisableSwipe({
    tabs,
  });
  const initialIndex =
    value ?? defaultValue
      ? getRouteIndexFromValue({
          routes,
          value: value ?? defaultValue,
        })
      : 0;

  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (isDefined(value))
      setIndex(
        getRouteIndexFromValue({
          routes,
          value,
        }),
      );
  }, [value, routes]);

  const renderScene = useCallback(
    ({ route }) => {
      return tabs[route.index].props.children;
    },
    [tabs],
  );

  const onIndexChange = useCallback(
    (newIndex) => {
      if (typeof newIndex === 'number') {
        if (!isDefined(value)) {
          setIndex(newIndex);
        }
        if (onChange)
          onChange(
            getRouteValueFromIndex({
              routes,
              index: newIndex,
            }),
          );
      }
    },
    [onChange, value, routes],
  );

  const renderTabBar = useCallback((props) => <TabBar {...props} scrollEnabled={scrollEnabled} />, [
    scrollEnabled,
  ]);

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={onIndexChange}
      initialLayout={initialLayout}
      swipeEnabled={!disableSwipe}
      tabBarPosition="top"
      lazy={true} // Renders screen only when we navigate to it
      gestureHandlerProps={gestureHandlerProps}
    />
  );
};

Tabs.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  scrollEnabled: PropTypes.bool,
  gestureHandlerProps: PropTypes.shape({
    minOffsetY: PropTypes.number,
    activeOffsetY: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    activeOffsetX: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    failOffsetY: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    failOffsetX: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    minDist: PropTypes.number,
    minVelocity: PropTypes.number,
    minVelocityX: PropTypes.number,
    minVelocityY: PropTypes.number,
    minPointers: PropTypes.number,
    maxPointers: PropTypes.number,
    avgTouches: PropTypes.bool,
    onGestureEvent: PropTypes.func,
    onHandlerStateChange: PropTypes.func,
  }),
};

Tabs.defaultProps = {};

Tabs.Tab = Tab;
export default Tabs;
