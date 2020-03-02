import React, { useCallback } from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import { getStorybookUI, configure, addDecorator } from '@storybook/react-native';
import styled, { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../../src/tokens/theme';
import './rn-addons';
import AsyncStorage from '@react-native-community/async-storage';
import storybookTheme from './storybookTheme';
import { withKnobs } from '@storybook/addon-ondevice-knobs';

const theme = {
  light: lightTheme,
  dark: darkTheme,
};

// import stories
configure(() => {
  require('../../src/atoms/Text/Text.stories');
  require('../../src/atoms/Link/Link.stories');
  require('../../src/atoms/Icon/Icon.stories');
  require('../../src/atoms/Button/Button.stories');
  require('../../src/atoms/Checkbox/Checkbox.stories');
}, module);

// add decorators
const SpaceAround = styled.View`
  margin: 20px;
`;

addDecorator((Story) => (
  <SpaceAround>
    <Story />
  </SpaceAround>
));

addDecorator(withKnobs);

const SafeAreaWrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) =>
    props.isDarkTheme ? theme.dark.colors.background[400] : theme.light.colors.background[400]};
`;

const ThemeSwitch = styled.Switch`
  margin-left: 10px;
  margin-right: 10px;
`;

const SwitchContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 20px 20px 0px 0px;
`;

const ThemeName = styled.Text`
  color: ${(props) =>
    !props.isDarkTheme ? theme.dark.colors.background[400] : theme.light.colors.background[400]};
  font-size: 14px;
`;

const App = () => {
  const [isDarkTheme, setDarkTheme] = React.useState(false);

  const setTheme = useCallback((themeName) => {
    AsyncStorage.setItem('theme', themeName);
  }, []);

  const onThemeSwitched = useCallback(
    (isDarkSelected) => {
      if (isDarkSelected) {
        setTheme('dark');
        setDarkTheme(true);
      } else {
        setTheme('light');
        setDarkTheme(false);
      }
    },
    [setTheme],
  );

  AsyncStorage.getItem('theme').then((storedTheme) => {
    if (storedTheme && storedTheme === 'dark') {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
  });

  // configure storybook
  const StorybookUIRoot = getStorybookUI({
    theme: isDarkTheme ? storybookTheme.dark : storybookTheme.light,
    asyncStorage: AsyncStorage,
  });

  return (
    <ThemeProvider theme={isDarkTheme ? theme.dark : theme.light}>
      <StatusBar
        backgroundColor={
          isDarkTheme ? theme.dark.colors.background[400] : theme.light.colors.background[400]
        }
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
      />
      <SafeAreaWrapper isDarkTheme={isDarkTheme}>
        <SwitchContainer>
          <ThemeName isDarkTheme={isDarkTheme}>{'Light'}</ThemeName>
          <ThemeSwitch value={isDarkTheme} onValueChange={onThemeSwitched} />
          <ThemeName isDarkTheme={isDarkTheme}>{'Dark'}</ThemeName>
        </SwitchContainer>
        <StorybookUIRoot />
      </SafeAreaWrapper>
    </ThemeProvider>
  );
};

// register app
AppRegistry.registerComponent('blade', () => App);

export default App;
