import React from 'react';
import PropTypes from 'prop-types';
import View from '../../atoms/View';
import Flex from '../../atoms/Flex';
import { getIconNames } from '../../_helpers/icon';
import TabButton from './TabButton';

const TabBar = ({ navigationState, jumpTo }) => {
  return (
    <Flex flexDirection="row">
      <View>
        {navigationState.routes.map(
          ({ key, label, index, value, testID, onPress, icon, disabled }) => (
            <TabButton
              key={key}
              active={navigationState.index === index}
              label={label}
              onPress={() => {
                if (onPress) {
                  onPress();
                }
                jumpTo(value);
              }}
              icon={icon}
              disabled={disabled}
              testID={testID}
            />
          ),
        )}
      </View>
    </Flex>
  );
};

TabBar.propTypes = {
  navigationState: PropTypes.shape({
    index: PropTypes.number,
    routes: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.string,
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
};

TabBar.defaultProps = {
  navigationState: { routes: [] },
  jumpTo: () => {},
};

export default TabBar;
