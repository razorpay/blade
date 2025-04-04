import React from 'react';
import { composeStories } from '@storybook/react';
import * as codeBlockStories from './CodeBlock.stories';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';

const allStories = Object.values(composeStories(codeBlockStories));

export const KitchenSink = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <Box>
        <Heading as="h2" marginBottom="spacing.3">CodeBlock Component</Heading>
        <Text>
          The CodeBlock component displays code with syntax highlighting powered by Prism.js.
          It supports JSON, Protobuf, and JavaScript languages, with options for showing/hiding
          line numbers and background.
        </Text>
      </Box>

      {allStories.map((Story, index) => {
        return (
          <Box key={index} paddingBottom="spacing.5" borderBottomStyle="solid" borderBottomColor="surface.border.gray.subtle">
            <Heading as="h3" marginBottom="spacing.3">{Story.storyName}</Heading>
            <Story />
          </Box>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/CodeBlock',
  component: KitchenSink,
  parameters: {
    // enable Chromatic's snapshotting for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
