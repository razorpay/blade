import { useAccordion, useAccordionItemIndex } from './AccordionContext';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { Text } from '~components/Typography';

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
  const { size, showNumberPrefix } = useAccordion();
  const { index } = useAccordionItemIndex();

  return (
    <BaseHeader
      leading={
        showNumberPrefix && typeof index === 'number' ? (
          <Text size={size} weight="semibold" marginTop="-2px" as="span">
            {index + 1}.
          </Text>
        ) : (
          leading
        )
      }
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
