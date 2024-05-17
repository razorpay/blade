import { StyledActionListItem } from '~components/ActionList/styles/StyledActionListItem';
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsMobile } from '~utils/useIsMobile';

type QuickSelectionItemProps = {
  children: React.ReactNode;
  isSelected: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
const QuickSelectionItem = ({
  children,
  onClick,
  isSelected,
}: QuickSelectionItemProps): React.ReactElement => {
  const isMobile = useIsMobile();
  return (
    <StyledActionListItem
      as={!isReactNative() ? 'button' : undefined}
      selectionType="single"
      hasDescription={true}
      isMobile={isMobile}
      isKeydownPressed={false}
      isSelected={isSelected}
      onClick={onClick}
      isVisible
      {...makeAccessible({
        selected: isSelected,
        current: true,
        role: 'option',
      })}
    >
      <Text size="small" weight="medium" color="interactive.text.gray.normal">
        {children}
      </Text>
    </StyledActionListItem>
  );
};

export { QuickSelectionItem };
