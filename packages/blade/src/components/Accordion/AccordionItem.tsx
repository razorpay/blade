import type { ReactElement, ReactNode } from 'react';
import { AccordionButton } from './AccordionButton';
import { BaseBox } from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import type { TestID } from '~src/_helpers/types';

type AccordionItemProps = {
  /**
   * Title text content
   */
  title: string;

  /**
   * Body text content
   */
  description?: string;

  /**
   * Renders a Blade icon as title prefix (requires `showNumberPrefix={false}`)
   */
  icon?: IconComponent;

  /**
   * Slot, renders any custom content
   */
  children?: ReactNode;
} & TestID;

const AccordionItem = ({
  title,
  description,
  icon,
  children,
}: AccordionItemProps): ReactElement => {
  return (
    <BaseBox>
      <AccordionButton>{title}</AccordionButton>
      {description}
    </BaseBox>
  );
};

export { AccordionItemProps, AccordionItem };
