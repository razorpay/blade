import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, boolean, select } from '@storybook/addon-knobs';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
import Checkbox from './Checkbox';

storiesOf('Checkbox', module)
  .addDecorator(withKnobs)
  .addParameters({
    component: Checkbox,
  })
  .add('unchecked', () => (
    <Checkbox
      checkedrr={boolean('Checked', false)}
      size={select(
        'Size',
        {
          large: 'large',
          medium: 'medium',
          small: 'small',
        },
        'large',
      )}
      title={text('Title', 'Title')}
      helpText={text('Help Text', 'some help text')}
      disabled={boolean('Disabled', false)}
      onChange={action('Changed')}
    />
  ))
  .add('checked', () => (
    <Checkbox
      checked={boolean('Checked', true)}
      size={select(
        'Size',
        {
          large: 'large',
          medium: 'medium',
          small: 'small',
        },
        'large',
      )}
      title={text('Title', 'Title')}
      helpText={text('Help Text', 'some help text')}
      disabled={boolean('Disabled', false)}
      onChange={action('Changed')}
    />
  ));
