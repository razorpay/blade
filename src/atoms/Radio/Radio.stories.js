import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import Flex from '../Flex';
import View from '../View';
import Radio from './Radio';

const sizeOptions = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

storiesOf('RadioButton', module)
  .addParameters({
    component: Radio,
  })
  .add('default', () => (
    <Radio
      value="1"
      //@ts-expect-error
      size={select('Size', sizeOptions, 'large')}
      onChange={(value) => {
        action('Value', value);
      }}
    >
      <Radio.Option
        value="1"
        title={text('Title', 'Enable Beast Mode')}
        helpText={text('Help Text', 'Play with addons to see changes')}
        disabled={boolean('Disabled', false)}
        errorText={text('Error Text', '')}
      />
    </Radio>
  ))
  .add('onChange', () => (
    <Radio
      defaultValue="1"
      onChange={(value) => {
        action('Value', value);
      }}
      //@ts-expect-error
      variantColor="shade"
      size="large"
    >
      <Radio.Option
        //@ts-expect-error
        name="group1"
        value="1"
        title="Unchecked"
        helpText="I'm unchecked"
      />
      <Radio.Option
        //@ts-expect-error
        name="group1"
        value="2"
        title="Checked"
        helpText="I'm active"
      />
      <Radio.Option
        //@ts-expect-error
        name="group1"
        value="3"
        disabled
        title="Disabled"
        helpText="I'm disabled"
      />
      <Radio.Option
        //@ts-expect-error
        name="group1"
        value="4"
        title="Error"
        errorText="Something's not right!"
      />
    </Radio>
  ))
  .add('controlled', () => (
    <Flex flexDirection="row" flexWrap="wrap">
      <View>
        <Radio
          value="1"
          //@ts-expect-error
          size="large"
          onChange={(value) => {
            action('Value', value);
          }}
        >
          <Radio.Option value="1" title="Unchecked" helpText="I'm unchecked" />
          <Radio.Option value="2" title="Checked" helpText="I'm active" />
          <Radio.Option value="3" disabled title="Disabled" helpText="I'm disabled" />
          <Radio.Option value="4" title="Error" errorText="Something's not right!" />
        </Radio>
      </View>
    </Flex>
  ));
