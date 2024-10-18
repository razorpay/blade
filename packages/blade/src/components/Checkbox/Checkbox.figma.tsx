import React from 'react';
import { Checkbox } from '../Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import figma from '@figma/code-connect';

figma.connect(
  Checkbox,
  'https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=71951-34708&m=dev',
  {
    props: {
      helpText: figma.boolean('showHelpText'),
      children: figma.string('label'),
      size: figma.enum('size', {
        Small: 'small',
        Medium: 'medium',
        Large: 'large',
      }),
      isDisabled: figma.boolean('isDisabled'),
      isChecked: figma.boolean('isChecked'),
      isIntermediate: figma.boolean('isIntermediate'),
      validationState: figma.enum('validationState', {
        Error: 'error',
      }),
      errorText: figma.boolean('errorText'),
    },

    example: ({ children, errorText, helpText, ...props }) => (
      <Checkbox
        {...props}
        errorText={errorText} // Add error text here
        helpText={helpText} // Add help text here
      >
        {children}
      </Checkbox>
    ),
  },
);

figma.connect(
  CheckboxGroup,
  'https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=72092-40150&m=dev',
  {
    props: {
      label: figma.boolean('showLabel'),
      helpText: figma.boolean('helpText'),
      size: figma.enum('size', {
        Small: 'small',
        Medium: 'medium',
        Large: 'large',
      }),
      validationState: figma.enum('validationState', {
        Error: 'error',
      }),
      labelPosition: figma.enum('labelPosition', {
        Top: 'top',
        Left: 'left',
      }),
    },

    example: ({ helpText, label, ...props }) => (
      <CheckboxGroup
        {...props}
        helpText={helpText} // Add help text here
        label={label} // Add label here
      >
        {/* Add Checkbox components here */}
      </CheckboxGroup>
    ),
  },
);
