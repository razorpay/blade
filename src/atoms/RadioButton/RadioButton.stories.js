import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean, select } from '@storybook/addon-knobs';
import RadioButton from './RadioButton';
import Flex from '../Flex';
import View from '../View';

const sizeOptions = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

storiesOf('RadioButton', module)
  .addParameters({
    component: RadioButton,
  })
  .add('default', () => (
    <RadioButton.Group value="1" onValueChange={() => {}}>
      <RadioButton
        value="1"
        defaultChecked={boolean('Default Checked', false)}
        size={select('Size', sizeOptions, 'large')}
        title={text('Title', 'Enable Beast Mode')}
        helpText={text('Help Text', 'Play with addons to see changes')}
        disabled={boolean('Disabled', false)}
        errorText={text('Error Text', '')}
      />
    </RadioButton.Group>
  ))
  .add('multiple radio buttons', () => (
    <RadioButton.Group value="2" onValueChange={() => {}}>
      <RadioButton value="1" size="large" title="Unchecked" helpText="I'm unchecked" />
      <RadioButton value="2" size="large" title="Checked" helpText="I'm active" />
      <RadioButton value="3" size="large" disabled title="Disabled" helpText="I'm disabled" />
      <RadioButton value="4" size="large" title="Error" errorText="Something's not right!" />
    </RadioButton.Group>
  ))
  .add('with parent container', () => (
    <Flex flexDirection="row" flexWrap="wrap">
      <View>
        <RadioButton.Group value="2" onValueChange={() => {}}>
          <RadioButton value="1" size="large" title="Unchecked" helpText="I'm unchecked" />
          <RadioButton value="2" size="large" title="Checked" helpText="I'm active" />
          <RadioButton value="3" size="large" disabled title="Disabled" helpText="I'm disabled" />
          <RadioButton value="4" size="large" title="Error" errorText="Something's not right!" />
        </RadioButton.Group>
      </View>
    </Flex>
  ));
