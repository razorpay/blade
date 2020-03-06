import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean, select } from '@storybook/addon-knobs';
import Radio from './RadioButton';
import Flex from '../Flex';
import View from '../View';

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
    <Radio value="1" onChange={() => {}}>
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
  .add('uncontrolled', () => (
    <Radio>
      <Radio.Option value="1" size="large" title="Unchecked" helpText="I'm unchecked" />
      <Radio.Option value="2" size="large" title="Checked" helpText="I'm active" />
      <Radio.Option value="3" size="large" disabled title="Disabled" helpText="I'm disabled" />
      <Radio.Option value="4" size="large" title="Error" errorText="Something's not right!" />
    </Radio>
  ))
  .add('controlled', () => (
    <Flex flexDirection="row" flexWrap="wrap">
      <View>
        <Radio value="1" onChange={() => {}}>
          <Radio.Option value="1" size="large" title="Unchecked" helpText="I'm unchecked" />
          <Radio.Option value="2" size="large" title="Checked" helpText="I'm active" />
          <Radio.Option value="3" size="large" disabled title="Disabled" helpText="I'm disabled" />
          <Radio.Option value="4" size="large" title="Error" errorText="Something's not right!" />
        </Radio>
      </View>
    </Flex>
  ));
