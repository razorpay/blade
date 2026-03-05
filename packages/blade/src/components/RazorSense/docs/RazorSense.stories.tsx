import type { StoryFn, Meta } from '@storybook/react';
import type { ReactElement } from 'react';
import type { RazorSenseProps } from '../index';
import { RazorSense as RazorSenseComponent } from '../index';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="RazorSense"
      componentDescription="This is the RazorSense component which can be used for showing a RazorSense effect on the screen"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=80952-9051&t=ozxGdqCDqI9hRYY8-1&scaling=min-zoom&page-id=614%3A1&mode=design"
    />
  );
};

export default {
  title: 'Components/RazorSense',
  component: RazorSenseComponent,
  args: {},
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<RazorSenseProps>;

const RazorSenseTemplate: StoryFn<typeof RazorSenseComponent> = (args) => {
  return (
    <Box width="100%" height="100vh">
      <RazorSenseComponent width="100%" height="100%" preset={args.preset} />
    </Box>
  );
};

export const Default = RazorSenseTemplate.bind({});

export const Zoomed = RazorSenseTemplate.bind({});
Zoomed.args = {
  preset: 'zoomed',
};

const BottomWaveTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  return (
    <Box width="calc(100% + 24px)" height="100vh" marginLeft="-12px" marginRight="-12px">
      <RazorSenseComponent width="100%" height="250px" preset="bottomWave" />
    </Box>
  );
};
export const BottomWave = BottomWaveTemplate.bind({});
