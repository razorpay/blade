import React, { useCallback } from 'react';
import { TabBar as RNTabBar } from 'react-native-tab-view';
import PropTypes from 'prop-types';
import { getIconNames } from '../../_helpers/icon';
import TabButton from './TabButton';

const TabBar = (props) => {
  const { navigationState, jumpTo, scrollEnabled } = props;

  const renderTabBarItem = useCallback(
    ({ route }) => (
      <TabButton
        key={route.key}
        title={route.title}
        icon={route.icon}
        disabled={route.disabled}
        testID={route.testID}
        onPress={() => {
          if (route.onPress) {
            route.onPress();
          }
          jumpTo(route.value);
        }}
        active={navigationState.index === route.index}
        scrollEnabled={scrollEnabled}
      />
    ),
    [jumpTo, navigationState.index, scrollEnabled],
  );

  return (
    <RNTabBar
      {...props}
      scrollEnabled={scrollEnabled}
      bounces={false}
      renderTabBarItem={renderTabBarItem}
      style={{
        backgroundColor: 'transparent',
      }}
      renderIndicator={() => null}
    />
  );
};

TabBar.propTypes = {
  navigationState: PropTypes.shape({
    index: PropTypes.number,
    routes: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        title: PropTypes.string,
        index: PropTypes.number,
        value: PropTypes.string,
        testID: PropTypes.string,
        active: PropTypes.bool,
        onPress: PropTypes.func,
        disabled: PropTypes.bool,
        icon: PropTypes.oneOf(getIconNames()),
      }),
    ),
  }),
  jumpTo: PropTypes.func,
  scrollEnabled: PropTypes.bool,
};

TabBar.defaultProps = {
  navigationState: {
    routes: [],
  },
  jumpTo: () => {},
  scrollEnabled: false,
};

export default TabBar;
