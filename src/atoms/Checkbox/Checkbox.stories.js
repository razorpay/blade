import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, boolean, select } from '@storybook/addon-knobs';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
import Checkbox from './Checkbox';

const sizeOptions = {
  large: 'large',
  medium: 'medium',
  small: 'small',
};

storiesOf('Checkbox', module)
  .addDecorator(withKnobs)
  .addParameters({
    component: Checkbox,
  })
  .add('unchecked', () => (
    <Checkbox
      checked={boolean('Checked', false)}
      size={select('Size', sizeOptions, 'large')}
      title={text('Title', 'Title')}
      helpText={text('Help Text', 'some help text')}
      disabled={boolean('Disabled', false)}
      onChange={action('Changed')}
    />
  ))
  .add('checked', () => (
    <Checkbox
      checked={boolean('Checked', true)}
      size={select('Size', sizeOptions, 'large')}
      title={text('Title', 'Title')}
      helpText={text('Help Text', 'some help text')}
      disabled={boolean('Disabled', false)}
      onChange={action('Changed')}
    />
  ));
