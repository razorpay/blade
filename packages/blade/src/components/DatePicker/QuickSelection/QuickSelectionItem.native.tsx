import { BaseMenuItem } from '~components/BaseMenu';

type QuickSelectionItemProps = {
  children: string;
  isSelected: boolean;
  onClick?: () => void;
};
const QuickSelectionItem = ({
  children,
  onClick,
  isSelected,
}: QuickSelectionItemProps): React.ReactElement => {
  return (
    <BaseMenuItem
      selectionType="single"
      isSelected={isSelected}
      onClick={onClick}
      title={children}
      role="option"
      data-analytics-name={children}
    />
  );
};

export { QuickSelectionItem };
