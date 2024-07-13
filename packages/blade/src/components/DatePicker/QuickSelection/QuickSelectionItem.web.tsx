import { BaseMenuItem } from '~components/BaseMenu';
import { isReactNative } from '~utils';

type QuickSelectionItemProps = {
  children: string;
  isSelected: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
const QuickSelectionItem = ({
  children,
  onClick,
  isSelected,
}: QuickSelectionItemProps): React.ReactElement => {
  return (
    <BaseMenuItem
      as={!isReactNative() ? 'button' : undefined}
      selectionType="single"
      isSelected={isSelected}
      onClick={onClick}
      title={children}
      role="option"
    />
  );
};

export { QuickSelectionItem };
