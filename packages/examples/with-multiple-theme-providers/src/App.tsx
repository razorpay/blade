import styled, { ThemeProvider } from 'styled-components';
import { BladeProvider, Button } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import '@fontsource/lato/400.css';
import '@fontsource/lato/400-italic.css';
import '@fontsource/lato/700.css';
import '@fontsource/lato/700-italic.css';

import './app.css';

const customTheme = {
  // it is crucial to namespace your theme inside a key such as below to ensure it doesn't override anything unexpected in blade's theme object
  // styled-components theme provider, when nested, shallow merges any theme objects passed
  myTheme: {
    colors: {
      primary: 'hotpink',
    },
  },
};

const MyButton = styled.button(({ theme }) => ({
  // this uses customTheme, note how we namespaced this behind `myTheme` so it doesn't override blade's `color` key
  background: theme.myTheme.colors.primary,
  // this uses blade's theme
  color: theme.colors.brand.primary[800],
  margin: '0 8px',
  padding: '8px 16px',
}));

function App(): React.ReactElement {
  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      <ThemeProvider theme={customTheme}>
        <Button onClick={() => console.log('hi')}>Hello</Button>
        <MyButton onClick={() => console.log('hi')}>World</MyButton>
      </ThemeProvider>
    </BladeProvider>
  );
}

export default App;
