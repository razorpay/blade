import {
  COMPONENT_TO_DEFAULT_VALUES_MAP,
  FONT_SIZES,
  FONT_WEIGHTS,
  VARIANTS,
  VARIANT_TO_COMPONENT_MAP,
} from './constants';
import type { BladeProps } from '~/code/types/Blade';

export const getSize = (styleName: string): string => {
  const size = FONT_SIZES.find((size) => styleName.includes(size));

  return size?.toLowerCase() ?? '';
};

export const getComponentVariant = (styleName: string): string => {
  const variant = VARIANTS.find((variant) => styleName.includes(variant));

  return variant?.toLowerCase() ?? '';
};

export const getComponentName = (variant: string): string => {
  if (!variant || !(variant in VARIANT_TO_COMPONENT_MAP)) {
    return 'Text';
  }

  return VARIANT_TO_COMPONENT_MAP[variant as keyof typeof VARIANT_TO_COMPONENT_MAP];
};

export const getWeight = (styleName: string): string => {
  const weight = FONT_WEIGHTS.find((weight) => styleName.includes(weight));

  return weight?.toLowerCase() ?? '';
};

export const getDefaultValues = (name: string): BladeProps => {
  return COMPONENT_TO_DEFAULT_VALUES_MAP[name as keyof typeof COMPONENT_TO_DEFAULT_VALUES_MAP];
};
