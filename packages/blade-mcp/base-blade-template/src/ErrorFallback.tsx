import { Alert, Box, Heading, Text } from '@razorpay/blade/components';
import { useEffect, useState } from 'react';
const ErrorFallback = ({ error }: { error: Error; resetErrorBoundary?: () => void }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  return (
    <Box
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
    >
      <Box
        display="inline-flex"
        gap="spacing.4"
        flexDirection="column"
        maxWidth="80%"
        width="500px"
      >
        <Heading as="h1" size="xlarge">
          There is a runtime error 🫣
        </Heading>
        <Text size="large">But don't worry, AI can fix it 💪🏼</Text>
        <Alert
          color="negative"
          isFullWidth
          description={`Runtime Error: ${error.message}`}
          isDismissible={false}
          actions={{
            primary: {
              text: isCopied ? 'Copied' : 'Copy Error',
              onClick: () => {
                const prompt = `Fix the following runtime error: ${error.message}\n\nstack: ${error.stack}`;
                navigator.clipboard.writeText(prompt);
                setIsCopied(true);
              },
            },
          }}
        />
        <Text>You can ask AI to "Fix runtime errors" or copy paste this error in chat</Text>
      </Box>
    </Box>
  );
};

export { ErrorFallback };
