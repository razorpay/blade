import { Link } from '~components/Link';
import { Box, Heading, Text } from '~src/components';

export const Message = ({ storyLink }: { storyLink: string }): React.ReactElement => {
  const storyName = storyLink.split('/').at(-1);
  const docsUrl = storyLink?.toLowerCase().replace(/[/ ]/g, '-');

  return (
    <Box padding="spacing.4" borderColor="surface.border.gray.muted" borderRadius="medium">
      <Heading>{storyName} is not rebranded yet</Heading>
      <Text marginTop="spacing.3">
        Refer to{' '}
        <Link href={`https://blade.razorpay.com/?path=/docs/components-${docsUrl}`}>
          {storyName ?? ''} - v10 Old Documentation
        </Link>{' '}
        {"if you're using earlier version"}
      </Text>
    </Box>
  );
};
