import React from 'react';
import { Slider } from './Slider';
import { SliderLabControlSwitch } from './SliderLabControlSwitch';
import type { SliderRangeValue } from './types';
import { Badge } from '~components/Badge';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';
import { Radio, RadioGroup } from '~components/Radio';
import { Heading, Text } from '~components/Typography';

type LabState = {
  color: 'information' | 'positive' | 'negative' | 'notice' | 'neutral';
  isDisabled: boolean;
  isRequired: boolean;
  labelPosition: 'top' | 'left';
  showMarks: boolean;
  showMinMax: boolean;
  showThumbValue: boolean;
  showValue: boolean;
  size: 'small' | 'medium' | 'large';
  validationState: 'none' | 'error' | 'success';
  variant: 'single' | 'range';
};
const INITIAL_STATE: LabState = {
  color: 'information',
  isDisabled: false,
  isRequired: false,
  labelPosition: 'top',
  showMarks: false,
  showMinMax: true,
  showThumbValue: false,
  showValue: true,
  size: 'medium',
  validationState: 'none',
  variant: 'single',
};

const LAB_MARKS = [
  { value: 0, label: 'Low' },
  { value: 50, label: 'Balanced' },
  { value: 100, label: 'High' },
];
const SliderInteractiveLab = (): React.ReactElement => {
  const [state, setState] = React.useState<LabState>(INITIAL_STATE);
  const [singleValue, setSingleValue] = React.useState(50);
  const [rangeValue, setRangeValue] = React.useState<SliderRangeValue>([20, 80]);
  const [lastEvent, setLastEvent] = React.useState('Waiting for interaction');
  const setOption = <Key extends keyof LabState>(key: Key, value: LabState[Key]): void => {
    setState((current) => ({ ...current, [key]: value }));
  };
  const reset = (): void => {
    setState(INITIAL_STATE);
    setSingleValue(50);
    setRangeValue([20, 80]);
    setLastEvent('Configuration reset');
  };
  const presentationProps = {
    color: state.color,
    errorText:
      state.validationState === 'error' ? 'Choose a value within the allowed range' : undefined,
    helpText:
      state.validationState === 'none' ? 'Drag, tap the track, or use arrow keys' : undefined,
    isDisabled: state.isDisabled,
    isRequired: state.isRequired,
    label: 'Transaction limit',
    labelPosition: state.labelPosition,
    marks: state.showMarks ? LAB_MARKS : undefined,
    max: 100,
    min: 0,
    necessityIndicator: 'required' as const,
    showMarks: state.showMarks,
    showMinMax: state.showMinMax,
    showThumbValue: state.showThumbValue,
    showValue: state.showValue,
    size: state.size,
    step: 10,
    successText:
      state.validationState === 'success' ? 'Value is within the target range' : undefined,
    validationState: state.validationState,
    valueFormatter: (value: number): string => `${value}%`,
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="1040px" width="100%">
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Heading size="large">Slider component lab</Heading>
        <Text color="surface.text.gray.muted">
          The configurator, feedback, and layout below are composed entirely with Blade primitives.
        </Text>
        <Box display="flex" flexWrap="wrap" gap="spacing.2">
          <Badge color="positive">Controlled interaction</Badge>
          <Badge color="neutral">Single + range</Badge>
          <Badge color="information">Blade atoms</Badge>
        </Box>
      </Box>
      <Divider />
      <Box display="flex" flexDirection={{ base: 'column', m: 'row' }} gap="spacing.7">
        <Box
          display="flex"
          flexDirection="column"
          gap="spacing.6"
          width={{ base: '100%', m: '320px' }}
          flexShrink={0}
        >
          <RadioGroup
            label="Variant"
            orientation="horizontal"
            value={state.variant}
            onChange={({ value }) => setOption('variant', value as LabState['variant'])}
          >
            <Radio value="single">Single</Radio>
            <Radio value="range">Range</Radio>
          </RadioGroup>
          <RadioGroup
            label="Size"
            orientation="horizontal"
            value={state.size}
            onChange={({ value }) => setOption('size', value as LabState['size'])}
          >
            <Radio value="small">Small</Radio>
            <Radio value="medium">Medium</Radio>
            <Radio value="large">Large</Radio>
          </RadioGroup>
          <RadioGroup
            label="Label position"
            orientation="horizontal"
            value={state.labelPosition}
            onChange={({ value }) => setOption('labelPosition', value as LabState['labelPosition'])}
          >
            <Radio value="top">Top</Radio>
            <Radio value="left">Left</Radio>
          </RadioGroup>
          <RadioGroup
            label="Validation"
            orientation="horizontal"
            value={state.validationState}
            onChange={({ value }) =>
              setOption('validationState', value as LabState['validationState'])
            }
            flexWrap="wrap"
          >
            <Radio value="none">None</Radio>
            <Radio value="error">Error</Radio>
            <Radio value="success">Success</Radio>
          </RadioGroup>
          <RadioGroup
            label="Color"
            value={state.color}
            onChange={({ value }) => setOption('color', value as LabState['color'])}
          >
            <Radio value="information">Information</Radio>
            <Radio value="positive">Positive</Radio>
            <Radio value="negative">Negative</Radio>
            <Radio value="notice">Notice</Radio>
            <Radio value="neutral">Neutral</Radio>
          </RadioGroup>
          <Divider />
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <SliderLabControlSwitch
              label="Header value"
              isChecked={state.showValue}
              onChange={(value) => setOption('showValue', value)}
            />
            <SliderLabControlSwitch
              label="Thumb values"
              isChecked={state.showThumbValue}
              onChange={(value) => setOption('showThumbValue', value)}
            />
            <SliderLabControlSwitch
              label="Labelled marks"
              isChecked={state.showMarks}
              onChange={(value) => setOption('showMarks', value)}
            />
            <SliderLabControlSwitch
              label="Minimum and maximum"
              isChecked={state.showMinMax}
              onChange={(value) => setOption('showMinMax', value)}
            />
            <SliderLabControlSwitch
              label="Required"
              isChecked={state.isRequired}
              onChange={(value) => setOption('isRequired', value)}
            />
            <SliderLabControlSwitch
              label="Disabled"
              isChecked={state.isDisabled}
              onChange={(value) => setOption('isDisabled', value)}
            />
          </Box>
          <Button variant="secondary" isFullWidth onClick={reset}>
            Reset configuration
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="spacing.5"
          padding="spacing.7"
          borderRadius="medium"
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          backgroundColor="surface.background.gray.intense"
          minWidth="0px"
          flexGrow={1}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" gap="spacing.4">
            <Heading size="small">Live Blade component</Heading>
            <Badge color={state.isDisabled ? 'neutral' : 'positive'}>
              {state.isDisabled ? 'Disabled' : 'Interactive'}
            </Badge>
          </Box>
          <Divider />
          {state.variant === 'range' ? (
            <Slider
              {...presentationProps}
              variant="range"
              value={rangeValue}
              onChange={({ value }) => {
                setRangeValue(value);
                setLastEvent(`onChange: ${value[0]}% - ${value[1]}%`);
              }}
              onChangeEnd={({ value }) => setLastEvent(`onChangeEnd: ${value[0]}% - ${value[1]}%`)}
            />
          ) : (
            <Slider
              {...presentationProps}
              value={singleValue}
              onChange={({ value }) => {
                setSingleValue(value);
                setLastEvent(`onChange: ${value}%`);
              }}
              onChangeEnd={({ value }) => setLastEvent(`onChangeEnd: ${value}%`)}
            />
          )}
          <Divider />
          <Box display="flex" justifyContent="space-between" gap="spacing.4" flexWrap="wrap">
            <Text size="small" color="surface.text.gray.muted">
              Last emitted event
            </Text>
            <Text size="small" weight="semibold">
              {lastEvent}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export { SliderInteractiveLab };
