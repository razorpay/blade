import React from 'react';
import { BladeProvider, Button } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';

function App(): React.ReactElement {
  return (
    <BladeProvider colorScheme="light" themeTokens={paymentTheme}>
      <Button onClick={() => console.log('hi')}>Hello</Button>
    </BladeProvider>
  );
}

export default App;
