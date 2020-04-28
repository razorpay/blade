import React from 'react';
import PropTypes from 'prop-types';
import View from '../../atoms/View';
import Flex from '../../atoms/Flex';
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
  navigationState: PropTypes.object,
  jumpTo: PropTypes.func,
  routes: PropTypes.object,
};

TabBar.defaultProps = {};

export default TabBar;
