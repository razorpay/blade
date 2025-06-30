const EmptyStateStoryCode = `import React, { useState } from 'react';
import {
  EmptyState,
  Box,
  Button,
  Link,
  Heading,
  Text,
  Icon,
} from '@razorpay/blade/components';

const EmptyStateExample = () => {
  return (
    <EmptyState
      asset={<img src="https://shorturl.at/qvgcJ" alt="Error" width="90px" height="90px" />}
      title="Something went wrong"
      description="Please try again later"
    >
      <Button>Reload</Button>
      <Link href="/help">Need help?</Link>
    </EmptyState>
  );
};

export default EmptyStateExample;
`;

export { EmptyStateStoryCode };
