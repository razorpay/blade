import React from 'react';
import { BladeProvider, Button } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import '@razorpay/blade/fonts.css';

function App(): React.ReactElement {
  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <Button onClick={() => console.log('hi')}>Hello</Button>
    </BladeProvider>
  );
}

export default App;
