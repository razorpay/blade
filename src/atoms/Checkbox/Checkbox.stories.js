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
  .add('with text', () => (
    <Checkbox
      checked={boolean('Checked', false)}
      size={select(
        'Size',
        {
          l: 'l',
          m: 'm',
          s: 's',
        },
        'l',
      )}
      title={text('Title', 'Title')}
      helpText={text('Help Text', 'help Text')}
      disabled={boolean('Disabled', false)}
      onClick={action('Clicked')}
    />
  ));
