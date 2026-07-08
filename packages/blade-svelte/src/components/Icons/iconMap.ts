import type { Component } from 'svelte';
import type { IconProps } from './types';
import { ArrowLeftIcon } from './ArrowLeftIcon';
import { CheckIcon } from './CheckIcon';
import { ChevronDownIcon } from './ChevronDownIcon';
import { ChevronLeftIcon } from './ChevronLeftIcon';
import { ChevronRightIcon } from './ChevronRightIcon';
import { CloseIcon } from './CloseIcon';
import { CreditCardIcon } from './CreditCardIcon';
import { EyeIcon } from './EyeIcon';
import { EyeOffIcon } from './EyeOffIcon';
import { InfoIcon } from './InfoIcon';
import { MoreFilledIcon } from './MoreFilledIcon';
import { PhoneIcon } from './PhoneIcon';
import { PlusIcon } from './PlusIcon';
import { SearchIcon } from './SearchIcon';
import { UserIcon } from './UserIcon';
import { BuildingIcon } from './BuildingIcon';
import { HomeIcon } from './HomeIcon';
import { LockIcon } from './LockIcon';
import { RazorpayTrustIcon } from './RazorpayTrustIcon';

export type IconComponent = Component<IconProps>;

/**
 * Map of icon names to icon components for Storybook controls.
 * Use with argTypes: { icon: { control: 'select', options: Object.keys(iconMap), mapping: iconMap } }
 */
export const iconMap: Record<string, IconComponent | undefined> = {
  None: undefined,
  ArrowLeftIcon,
  BuildingIcon,
  HomeIcon,
  LockIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CreditCardIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  MoreFilledIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  RazorpayTrustIcon,
};
