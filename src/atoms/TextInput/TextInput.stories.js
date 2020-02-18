import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from './TextInput';

storiesOf('TextInput', module)
  .addParameters({
    component: TextInput,
  })
  .add('with text', () => (
    <TextInput
      label="Label"
      disabled={false}
      value=""
      error=""
      iconLeft=""
      iconRight=""
      prefix=""
      suffix=""
    />
  ));
