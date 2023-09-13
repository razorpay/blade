import React from 'react';
import { Box } from '@razorpay/blade/components';

const RemoteButton = React.lazy(() => import('remote/Button'));

const App = () => (
  <Box display="flex" flexDirection="column" maxWidth="500px" gap="20px">
    <React.Suspense fallback="Loading Button">
      <RemoteButton />
    </React.Suspense>
  </Box>
);

export default App;
