import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, boolean, select } from '@storybook/addon-knobs';
import Checkbox from './Checkbox';

const sizeOptions = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

storiesOf('Checkbox', module)
  .addParameters({
    component: Checkbox,
  })
  .add('defaultChecked', () => (
    <Checkbox
      defaultChecked={boolean('Default Checked', false)}
      size={select('Size', sizeOptions, 'large')}
      title={text('Title', 'Enable Beast Mode')}
      helpText={text('Help Text', 'Play with addons to see changes')}
      disabled={boolean('Disabled', false)}
      onChange={action('Changed')}
      errorText={text('Error Text', 'You dont have permission')}
    />
  ))
  .add('checked', () => (
    <Checkbox
      checked={boolean('Checked', true)}
      size={select('Size', sizeOptions, 'large')}
      title={text('Title', 'Enable beast Mode')}
      helpText={text('Help Text', 'Play with addons')}
      disabled={boolean('Disabled', false)}
      onChange={action('Changed')}
      errorText={text('Error Text', '')}
    />
  ));
