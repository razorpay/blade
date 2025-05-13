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
          <Box> This is demo component</Box>
        </PreviewBody>
        <PreviewFooter showZoomPercentage={true} />
      </Box>
    </PreviewWindow>
  );
};

export const Default = PreviewWindowTemplate.bind({});
Default.storyName = 'Default';
Default.args = {};

const ImagePreviewTemplate: StoryFn<typeof PreviewWindow> = (args) => {
  return (
    <PreviewWindow>
      <Box>
        <PreviewHeader title="Preview " />
        <PreviewBody>
          <img width="100%" height="100%" src="https://picsum.photos/1920/1080" alt="randomImage" />
        </PreviewBody>
        <PreviewFooter showZoomPercentage={true} />
      </Box>
    </PreviewWindow>
  );
};

export const ImagePreview = ImagePreviewTemplate.bind({});
ImagePreview.storyName = 'Image Preview';
ImagePreview.args = {};

const FixedHeightWidthExampleTemplate: StoryFn<typeof PreviewWindow> = (args) => {
  return (
    <Box height="300px" width="300px">
      <Heading size="large">Fixed Height Width Example</Heading>
      <PreviewWindow>
        <Box>
          <PreviewHeader title="Preview " />
          <PreviewBody>
            <img
              width="100%"
              height="100%"
              src="https://picsum.photos/1920/1080"
              alt="randomImage"
            />
          </PreviewBody>
          <PreviewFooter showZoomPercentage={true} />
        </Box>
      </PreviewWindow>
    </Box>
  );
};

export const FixedHeightWidthExample = FixedHeightWidthExampleTemplate.bind({});
FixedHeightWidthExample.storyName = 'Fixed Height Width Example';
FixedHeightWidthExample.args = {};
