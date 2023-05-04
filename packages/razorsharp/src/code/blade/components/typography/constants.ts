import type { BladeProps } from '~/code/types/Blade';

export const textDefaultValues: BladeProps = {
  variant: { value: 'body', type: 'string' },
  weight: { value: 'regular', type: 'string' },
  size: { value: 'medium', type: 'string' },
  type: { value: 'normal', type: 'string' },
  contrast: { value: 'low', type: 'string' },
};

export const titleDefaultValues: BladeProps = {
  size: { value: 'small', type: 'string' },
  type: { value: 'normal', type: 'string' },
  variant: { value: 'title', type: 'string' },
  contrast: { value: 'low', type: 'string' },
};

export const headingDefaultValues: BladeProps = {
  variant: { value: 'heading', type: 'string' },
  weight: { value: 'bold', type: 'string' },
  size: { value: 'small', type: 'string' },
  type: { value: 'normal', type: 'string' },
  contrast: { value: 'low', type: 'string' },
};

export const codeDefaultValues: BladeProps = {
  size: { value: 'small', type: 'string' },
};

export const VARIANTS = ['Heading', 'Body', 'Caption', 'Subheading', 'Title', 'Code'] as const;

export const VARIANT_TO_COMPONENT_MAP = {
  heading: 'Heading',
  subheading: 'Heading',
  body: 'Text',
  caption: 'Text',
  title: 'Title',
  code: 'Code',
} as const;

export const COMPONENT_TO_DEFAULT_VALUES_MAP = {
  Heading: headingDefaultValues,
  Text: textDefaultValues,
  Title: titleDefaultValues,
  Code: codeDefaultValues,
};

export const FONT_WEIGHTS = ['Regular', 'Bold'] as const;

export const FONT_SIZES = ['Small', 'Medium', 'Large'] as const;
