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
      error=""
      iconLeft=""
      iconRight=""
      prefix="kg"
      suffix=""
      placeholder="Type here"
      helpText="This is a help text"
      errorText=""
      onChangeText={() => {}}
      variant="outline"
    />
  ));
