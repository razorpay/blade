import { BladeProvider, Button } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import { ThemeProvider } from 'styled-components';
import '@fontsource/lato/400.css';
import '@fontsource/lato/400-italic.css';
import '@fontsource/lato/700.css';
import '@fontsource/lato/700-italic.css';

import './app.css';

const customTheme = {
  colors: {
    primary: 'hotpink',
  },
};

function App() {
  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      <ThemeProvider theme={customTheme}>
        <Button onClick={() => console.log('hi')}>Hello</Button>
      </ThemeProvider>
    </BladeProvider>
  );
}

export default App;
