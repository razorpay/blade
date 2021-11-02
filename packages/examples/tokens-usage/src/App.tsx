import { BladeProvider } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import Card from './Card';
import '@fontsource/lato';

function App(): JSX.Element {
  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme="system">
      <Card />
    </BladeProvider>
  );
}

export default App;
