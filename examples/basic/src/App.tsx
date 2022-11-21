import { BladeProvider, Button } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import '@fontsource/lato/400.css';
import '@fontsource/lato/400-italic.css';
import '@fontsource/lato/700.css';
import '@fontsource/lato/700-italic.css';

function App(): JSX.Element {
  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      <Button onClick={() => console.log('hi')}>Hello</Button>
    </BladeProvider>
  );
}

export default App;
