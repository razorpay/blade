import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text, number } from '@storybook/addon-knobs';
import Snackbar from './Snackbar';

const variantOptions = {
  positive: 'positive',
  negative: 'negative',
  warning: 'warning',
  neutral: 'neutral',
};

storiesOf('Snackbar', module)
  .addParameters({
    component: Snackbar,
  })
  .add('default', () => (
    <Snackbar
      variant={select('Variant', variantOptions, undefined)}
      text={text('Text', 'Snackbar text here')}
      maxLines={number('maxLines', undefined)}
      actionText={text('Action Text', 'Retry')}
      onAction={() => {}}
      onDismiss={() => {}}
      showDismissButton={true}
    />
  ));
