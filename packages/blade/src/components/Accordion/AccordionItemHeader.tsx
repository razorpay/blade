import { useAccordion } from './AccordionContext';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';

const AccordionItemHeader = ({
  title,
  subtitle,
  leading,
  children,
  trailing,
  titleSuffix,
}: Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'children' | 'trailing' | 'titleSuffix'
>): React.ReactElement => {
  const { size } = useAccordion();

  return (
    <BaseHeader
      leading={leading}
      title={title}
      subtitle={subtitle}
      trailing={trailing}
      titleSuffix={titleSuffix}
      showBackButton={false}
      showCloseButton={false}
      showDivider={false}
      paddingX="spacing.5"
      marginY="spacing.5"
      size={size}
    >
      {children}
    </BaseHeader>
  );
};

export { AccordionItemHeader };
