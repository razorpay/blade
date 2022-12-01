import './rn-addons';
import React, { useCallback } from 'react';
import { AppRegistry, StatusBar, KeyboardAvoidingView } from 'react-native';
import { getStorybookUI, configure, addDecorator } from '@storybook/react-native';
import styled, { ThemeProvider } from 'styled-components';
import AsyncStorage from '@react-native-community/async-storage';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
import { darkTheme, lightTheme } from '../../src/tokens/theme';
import storybookTheme from './storybookTheme';
import 'react-native-gesture-handler';

const theme = {
  light: lightTheme,
  dark: darkTheme,
};

// import stories
configure(() => {
  require('../../src/atoms/Badge/Badge.stories');
  require('../../src/atoms/Button/Button.stories');
  require('../../src/atoms/Card/Card.stories');
  require('../../src/atoms/Checkbox/Checkbox.stories');
  require('../../src/atoms/Divider/Divider.stories');
  require('../../src/atoms/Heading/Heading.stories');
  require('../../src/atoms/Icon/Icon.stories');
  require('../../src/atoms/Indicator/Indicator.stories');
  require('../../src/atoms/Link/Link.stories');
  require('../../src/atoms/Radio/Radio.stories');
  require('../../src/atoms/ScrollView/ScrollView.stories');
  require('../../src/atoms/Switch/Switch.stories');
  require('../../src/atoms/Text/Text.stories');
  require('../../src/atoms/TextArea/TextArea.stories');
  require('../../src/atoms/TextInput/TextInput.stories');
  require('../../src/molecules/Amount/Amount.stories');
  require('../../src/molecules/BottomSheet/BottomSheet.stories');
  require('../../src/molecules/FileUpload/FileUpload.stories');
  require('../../src/molecules/Modal/Modal.stories');
  require('../../src/molecules/SegmentControl/SegmentControl.stories');
  require('../../src/molecules/Snackbar/Snackbar.stories');
  require('../../src/molecules/Tabs/Tabs.stories');
}, module);

// add decorators
const SpaceAround = styled.View`
  padding: 20px;
  height: 100%;
  width: 100%;
`;

addDecorator((Story) => (
  <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
    <SpaceAround>
      <Story />
    </SpaceAround>
  </KeyboardAvoidingView>
));

addDecorator(withKnobs);

const SafeAreaWrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) =>
    props.isDarkTheme
      ? theme.dark.bladeOld.colors.background[400]
      : theme.light.bladeOld.colors.background[400]};
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
    !props.isDarkTheme
      ? theme.dark.bladeOld.colors.background[400]
      : theme.light.bladeOld.colors.background[400]};
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
    shouldDisableKeyboardAvoidingView: true,
  });

  return (
    <ThemeProvider theme={isDarkTheme ? theme.dark : theme.light}>
      <StatusBar
        backgroundColor={
          isDarkTheme
            ? theme.dark.bladeOld.colors.background[400]
            : theme.light.bladeOld.colors.background[400]
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
