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
import { MailIcon } from './MailIcon';
import { MailOpenIcon } from './MailOpenIcon';
import { MoreFilledIcon } from './MoreFilledIcon';
import { MoreHorizontalIcon } from './MoreHorizontalIcon';
import { PhoneIcon } from './PhoneIcon';
import { PlusIcon } from './PlusIcon';
import { SearchIcon } from './SearchIcon';
import { UserIcon } from './UserIcon';
import { BuildingIcon } from './BuildingIcon';
import { HomeIcon } from './HomeIcon';
import { LockIcon } from './LockIcon';
import { RazorpayTrustIcon } from './RazorpayTrustIcon';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ClockIcon } from './ClockIcon';
import { UpiIcon } from './UpiIcon';
import { WalletIcon } from './WalletIcon';

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
  MailIcon,
  MailOpenIcon,
  MoreFilledIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  WhatsAppIcon,
  ClockIcon,
  UpiIcon,
  WalletIcon,
  RazorpayTrustIcon,
};
