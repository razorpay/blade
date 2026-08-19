import React from 'react';
import { Title } from '@storybook/addon-docs/blocks';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

const FIGMA_URL =
  'https://www.figma.com/design/k1V23Ml1EWUokVyqN4TTod/Slider-Research---Snowflake-Component-Exploration?node-id=120-797';

const SliderDocs = (): React.ReactElement => (
  <StoryPageWrapper
    componentDescription="Slider lets people select one value or a bounded range by dragging, tapping the track, or using the keyboard."
    componentName="Slider"
    figmaURL={FIGMA_URL}
  >
    <Title>Usage</Title>
    <Sandbox>
      {`
        import { Slider } from '@razorpay/blade/components';

        function App() {
          const [value, setValue] = React.useState(50);

          return (
            <Slider
              label="Transaction limit"
              value={value}
              onChange={({ value }) => setValue(value)}
              min={0}
              max={100}
              showMinMax
            />
          );
        }
      `}
    </Sandbox>
    <Title>Compose With TextInput</Title>
    <Sandbox>
      {`
        import { Box, Slider, TextInput } from '@razorpay/blade/components';

        <Box display="flex" alignItems="flex-end" gap="spacing.4">
          <Slider
            accessibilityLabel="Opacity"
            value={opacity}
            onChange={({ value }) => setOpacity(value)}
          />
          <TextInput
            label="Opacity"
            type="number"
            value={String(opacity)}
            onChange={({ value }) => setOpacity(Number(value))}
            suffix="%"
          />
        </Box>
      `}
    </Sandbox>
  </StoryPageWrapper>
);

export { SliderDocs };
