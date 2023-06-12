import type { IconComponent } from '~components/Icons';

type StyledAccordionButtonProps = {
  isExpanded: boolean;
};

type AccordionButtonProps = {
  index?: number;
  icon?: IconComponent;
  children: string;
};

export { StyledAccordionButtonProps, AccordionButtonProps };
