import React from 'react';
import figma from '@figma/code-connect';
import { Link } from '../Link';

figma.connect(
  Link,
  'https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=59519-143300&m=dev',
  {
    props: {
      icon: figma.instance('iconLeading'),
      children: figma.string('label'),
      variant: figma.enum('type', {
        Anchor: 'anchor',
        Action: 'button',
      }),
      color: figma.enum('color', {
        Primary: 'primary',
        White: 'white',
        Neutral: 'neutral',
        Negative: 'negative',
        Positive: 'positive',
      }),
      isDisabled: figma.boolean('isDisabled'),
      size: figma.enum('size', {
        Large: 'large',
        Medium: 'medium',
        Small: 'small',
        XSmall: 'xsmall',
      }),
    },
    // @ts-expect-error ignore this line
    example: ({ children, ...props }) => <Link {...props}>{children}</Link>,
  },
);

// with variant '↩ trailingIcon' as true
figma.connect(
  Link,
  'https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=59519-143300&m=dev',
  {
    variant: { '↩ trailingIcon': true },
    props: {
      icon: figma.instance('iconTrailing'),
      // TODO: Figure out how to handle iconPosition
      children: figma.string('label'),
      variant: figma.enum('type', {
        Anchor: 'anchor',
        Action: 'button',
      }),
      color: figma.enum('color', {
        Primary: 'primary',
        White: 'white',
        Neutral: 'neutral',
        Negative: 'negative',
        Positive: 'positive',
      }),
      isDisabled: figma.boolean('isDisabled'),
      size: figma.enum('size', {
        Large: 'large',
        Medium: 'medium',
        Small: 'small',
        XSmall: 'xsmall',
      }),
    },
    // @ts-expect-error ignore this line
    example: ({ children, ...props }) => (
      <Link {...props} iconPosition="right">
        {children}
      </Link>
    ),
  },
);

// with variant '↪ leadingIcon' as true
figma.connect(
  Link,
  'https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=59519-143300&m=dev',
  {
    variant: { '↪ leadingIcon': true },
    props: {
      icon: figma.instance('iconLeading'),
      // TODO: Figure out how to handle iconPosition
      children: figma.string('label'),
      variant: figma.enum('type', {
        Anchor: 'anchor',
        Action: 'button',
      }),
      color: figma.enum('color', {
        Primary: 'primary',
        White: 'white',
        Neutral: 'neutral',
        Negative: 'negative',
        Positive: 'positive',
      }),
      isDisabled: figma.boolean('isDisabled'),
      size: figma.enum('size', {
        Large: 'large',
        Medium: 'medium',
        Small: 'small',
        XSmall: 'xsmall',
      }),
    },
    // @ts-expect-error ignore this line
    example: ({ children, ...props }) => (
      <Link {...props} iconPosition="left">
        {children}
      </Link>
    ),
  },
);
