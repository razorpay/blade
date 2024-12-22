import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { InternalCardExample } from '../Card/Card.stories';
import qrCodesImage from './docs-qrcodes.svg';
import { Scale } from './';
import type { ScaleProps } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { ScaleSandbox } from '~components/BaseMotion/docs/codeExamples';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Scale"
      componentDescription="Scale component animates over CSS `scale` property and allows you to enlarge or shrink element on certain interactions"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/rfcs/2024-08-21-motion-presets.md"
    >
      <Title>Usage</Title>
      <ScaleSandbox />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Motion/Scale',
  component: Scale,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ScaleProps>;

const ControlledScaleTemplate: StoryFn<typeof Scale> = (args) => {
  const [isHighlighted, setIsHighlighted] = React.useState(false);
  return (
    <Box>
      <Button marginBottom="spacing.4" onClick={() => setIsHighlighted(!isHighlighted)}>
        Toggle Scale
      </Button>
      <Box>
        <Scale {...args} isHighlighted={isHighlighted} />
      </Box>
    </Box>
  );
};

const ScaleTemplate: StoryFn<typeof Scale> = (args) => {
  return <Scale {...args} />;
};

export const Default = ScaleTemplate.bind({});
Default.args = {
  children: <img src={qrCodesImage} alt="QR Codes" width="300px" />,
};

export const Controlled = ControlledScaleTemplate.bind({});
Controlled.args = {
  children: (
    <Box display="inline-block">
      <InternalCardExample />
    </Box>
  ),
};
