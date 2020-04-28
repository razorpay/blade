import React from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { TabView, SceneMap as sceneMap } from 'react-native-tab-view';
import View from '../../atoms/View';

const FirstRoute = () => <View style={[{ backgroundColor: '#ff4081' }]} />;

const SecondRoute = () => <View style={[{ backgroundColor: '#673ab7' }]} />;

const initialLayout = { width: Dimensions.get('window').width };

const Tab = () => {
  return null;
};

Tab.propTypes = {
  title: PropTypes.string.isRequired,
};

Tab.defaultProps = {};

const Tabs = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  const renderScene = sceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
};

Tabs.propTypes = {};

Tabs.defaultProps = {};

Tabs.Tab = Tab;
export default Tabs;
