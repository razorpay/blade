import type { IconComponent } from '~components/Icons';

type AccordionVariantType = 'bordered' | 'borderless';

type StyledAccordionButtonProps = {
  isExpanded: boolean;
};

type AccordionButtonProps = {
  index?: number;
  icon?: IconComponent;
  title: string;
};

export type { StyledAccordionButtonProps, AccordionButtonProps, AccordionVariantType };
