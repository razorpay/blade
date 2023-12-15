import { BladeProvider, Button } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import '@razorpay/blade/fonts.css';

function App(): JSX.Element {
  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <Button onClick={() => console.log('hi')}>Hello</Button>
    </BladeProvider>
  );
}

export default App;
