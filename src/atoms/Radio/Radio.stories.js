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
      onChange={(value) => {
        action('Value', value);
      }}
    >
      <Radio.Option
        value="1"
        size={select('Size', sizeOptions, 'large')}
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
    >
      <Radio.Option
        name="group1"
        value="1"
        size="large"
        title="Unchecked"
        helpText="I'm unchecked"
      />
      <Radio.Option name="group1" value="2" size="large" title="Checked" helpText="I'm active" />
      <Radio.Option
        name="group1"
        value="3"
        size="large"
        disabled
        title="Disabled"
        helpText="I'm disabled"
      />
      <Radio.Option
        name="group1"
        value="4"
        size="large"
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
          onChange={(value) => {
            action('Value', value);
          }}
        >
          <Radio.Option value="1" size="large" title="Unchecked" helpText="I'm unchecked" />
          <Radio.Option value="2" size="large" title="Checked" helpText="I'm active" />
          <Radio.Option value="3" size="large" disabled title="Disabled" helpText="I'm disabled" />
          <Radio.Option value="4" size="large" title="Error" errorText="Something's not right!" />
        </Radio>
      </View>
    </Flex>
  ));
