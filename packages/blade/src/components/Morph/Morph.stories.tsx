import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Morph } from './';
import type { MorphProps } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { AnimatePresence } from 'motion/react';
import { TextInput } from '~components/Input/TextInput';
import { Link } from '~components/Link';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Morph"
      componentDescription="Morph Motion Component (TODO)"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        const todo = 'todo';
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Motion/Morph',
  component: Morph,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<MorphProps>;

const MorphTemplate: StoryFn<typeof Morph> = (args) => {
  const [showNameButton, setShowNameButton] = React.useState(true);
  return (
    <Box minHeight="350px">
      <AnimatePresence>
        {showNameButton ? (
          <Morph layoutId="button-box-morph">
            <Button onClick={() => setShowNameButton(false)}>Click to Enter Name</Button>
          </Morph>
        ) : (
          <Morph layoutId="button-box-morph">
            <Box display="block" width="240px">
              <TextInput
                accessibilityLabel="Name"
                placeholder="Enter your Name"
                trailingButton={
                  <Link onClick={() => setShowNameButton(true)} variant="button">
                    Submit
                  </Link>
                }
              />
            </Box>
          </Morph>
        )}
      </AnimatePresence>
    </Box>
  );
};

export const Default = MorphTemplate.bind({});
