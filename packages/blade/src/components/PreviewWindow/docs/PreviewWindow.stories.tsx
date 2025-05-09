import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { PreviewBody, PreviewHeader, PreviewWindow, PreviewFooter } from '../PreviewWindow';
import type { PreviewWindowProps } from '../types';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="PreviewWindow"
      componentDescription="A Preview Window is a component that is used to preivew a file"
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import {  } from '@razorpay/blade/components';
        
        function App() {
          return (
            <ChatMessage > Hi, from ray! </ChatMessage>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/PreviewWindow',
  component: PreviewWindow,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<PreviewWindowProps>;

const PreviewWindowTemplate: StoryFn<typeof PreviewWindow> = (args) => {
  return (
    <PreviewWindow>
      <Box>
        <PreviewHeader title="Preview " />
        <PreviewBody>
          {/* <img scr="https://picsum.photos/200/300" /> */}
          <Box> This is demo component</Box>
        </PreviewBody>
      </Box>
    </PreviewWindow>
  );
};

export const Default = PreviewWindowTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  senderType: 'self',
  messageType: 'default',
};
