import { Button, Text, Box, Heading } from '@razorpay/blade/components';
import { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Box padding="spacing.11" textAlign="center">
      <Heading size="large" marginBottom="spacing.4">
        Welcome to Blade App
      </Heading>
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
      <Text marginTop="spacing.4">Count is {count}</Text>
    </Box>
  );
};

export default App;
