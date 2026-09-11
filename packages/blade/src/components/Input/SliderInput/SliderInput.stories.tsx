import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { SliderInput } from './index';
import type { SliderInputProps } from './types';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { TextInput } from '~components/Input/TextInput';

export default {
  title: 'Components/Input/SliderInput',
  component: SliderInput,
  args: {
    label: 'Volume',
    labelPosition: 'top',
    min: 0,
    max: 100,
    step: 1,
    showMarkers: false,
    showScale: false,
    showScaleValues: true,
    showValueIndicator: true,
    isDisabled: false,
  },
  argTypes: {
    labelPosition: {
      control: { type: 'select' },
      options: ['top', 'left'],
    },
    validationState: {
      control: { type: 'select' },
      options: ['none', 'error', 'success'],
    },
    necessityIndicator: {
      control: { type: 'select' },
      options: ['none', 'required', 'optional'],
    },
  },
} as Meta<SliderInputProps>;

const SliderInputTemplate: StoryFn<typeof SliderInput> = (args) => {
  return (
    <Box maxWidth="400px">
      <SliderInput {...args} />
    </Box>
  );
};

export const Default = SliderInputTemplate.bind({});

export const WithMarkers = SliderInputTemplate.bind({});
WithMarkers.args = { step: 25, showMarkers: true, defaultValue: 50 };

export const WithScale = SliderInputTemplate.bind({});
WithScale.args = { step: 25, showMarkers: true, showScale: true, defaultValue: 50 };

export const LabelPositionLeft = SliderInputTemplate.bind({});
LabelPositionLeft.args = { labelPosition: 'left', step: 20, showMarkers: true, showScale: true };

export const Disabled = SliderInputTemplate.bind({});
Disabled.args = {
  isDisabled: true,
  defaultValue: 40,
  step: 20,
  showMarkers: true,
  showScale: true,
};

/**
 * `max` is always reachable even when the range is not a whole number of steps, so this
 * slider stops at 0, 30, 60, 90 and 100.
 */
export const UnevenSteps = SliderInputTemplate.bind({});
UnevenSteps.args = { step: 30, showMarkers: true, showScale: true, defaultValue: 60 };

export const Steps: StoryFn<typeof SliderInput> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.7" maxWidth="400px">
      {[undefined, 33.33, 25, 10].map((step, index) => (
        <SliderInput
          key={index}
          label={step ? `${Math.round(100 / step) + 1} steps` : 'Continuous'}
          step={step}
          showMarkers={Boolean(step)}
          showScale={Boolean(step)}
          defaultValue={50}
        />
      ))}
    </Box>
  );
};

export const ValidationStates: StoryFn<typeof SliderInput> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.7" maxWidth="400px">
      <SliderInput label="With help text" helpText="Drag to adjust the output level" />
      <SliderInput label="With error" validationState="error" errorText="Value is too high" />
      <SliderInput label="With success" validationState="success" successText="Looks good" />
    </Box>
  );
};

/**
 * `formatValue` is applied everywhere the value is shown: the scale, the indicator above the
 * thumb and the value announced to a screen reader.
 */
export const FormattedValue: StoryFn<typeof SliderInput> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.7" maxWidth="400px">
      <SliderInput
        label="Budget"
        min={0}
        max={5000}
        step={1000}
        defaultValue={2000}
        showMarkers
        showScale
        formatValue={(value) => `₹${value / 1000}k`}
      />
      <SliderInput
        label="Discount"
        min={0}
        max={100}
        step={20}
        defaultValue={40}
        showMarkers
        showScale
        formatValue={(value) => `${value}%`}
      />
    </Box>
  );
};

/**
 * The slider does not bundle a text field. Pair them by holding the value in your own state
 * and passing it to both, which keeps you free to decide how the two reconcile.
 *
 * Note the two callbacks do different jobs: `onChange` fires on every pointer move so the
 * field tracks the drag live, while `onChangeEnd` fires once on release and is where
 * anything expensive belongs.
 */
export const PairedWithTextInput: StoryFn<typeof SliderInput> = () => {
  const [radius, setRadius] = React.useState(8);
  const [draft, setDraft] = React.useState('8');

  const commitDraft = (): void => {
    const parsed = Number(draft);
    // Typing 37 against a step of 8 puts the thumb on 40, so the field is reconciled back to
    // the value the slider actually settled on rather than being left disagreeing with it.
    const next = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 40) : radius;
    setRadius(next);
    setDraft(String(next));
  };

  return (
    <Box display="flex" alignItems="center" gap="spacing.5" maxWidth="600px">
      {/* The slider sizes to its content in a flex row, so it has to be told to take the rest. */}
      <Box flex="1">
        <SliderInput
          label="Corner Radius"
          labelPosition="left"
          min={0}
          max={40}
          step={8}
          showMarkers
          value={radius}
          onChange={({ value }) => {
            setRadius(value);
            setDraft(String(value));
          }}
        />
      </Box>
      <Box width="80px" flexShrink={0}>
        <TextInput
          accessibilityLabel="Corner radius in pixels"
          suffix="px"
          size="small"
          value={draft}
          onChange={({ value }) => setDraft(value ?? '')}
          onBlur={commitDraft}
        />
      </Box>
    </Box>
  );
};

/**
 * Markers and scale labels are dropped independently once they would collide, so a narrow
 * slider degrades to a plain track instead of rendering a smear of overlapping dots.
 */
export const NarrowWidths: StoryFn<typeof SliderInput> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.7">
      {['400px', '240px', '140px'].map((width) => (
        <Box key={width} width={width}>
          <Text size="xsmall" marginBottom="spacing.2">
            {width}
          </Text>
          <SliderInput
            label="Volume"
            step={10}
            showMarkers
            showScale
            defaultValue={50}
            accessibilityLabel={`Volume at ${width}`}
          />
        </Box>
      ))}
    </Box>
  );
};
