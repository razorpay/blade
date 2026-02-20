import type { Component } from 'svelte';
import type { IconProps } from './types';
import { CheckIcon } from './CheckIcon';
import { CloseIcon } from './CloseIcon';
import { CreditCardIcon } from './CreditCardIcon';
import { InfoIcon } from './InfoIcon';
import { MoreFilledIcon } from './MoreFilledIcon';
import { PlusIcon } from './PlusIcon';
import { SearchIcon } from './SearchIcon';

export type IconComponent = Component<IconProps>;

/**
 * Map of icon names to icon components for Storybook controls.
 * Use with argTypes: { icon: { control: 'select', options: Object.keys(iconMap), mapping: iconMap } }
 */
export const iconMap: Record<string, IconComponent | undefined> = {
  None: undefined,
  CheckIcon,
  CloseIcon,
  CreditCardIcon,
  InfoIcon,
  MoreFilledIcon,
  PlusIcon,
  SearchIcon,
};
