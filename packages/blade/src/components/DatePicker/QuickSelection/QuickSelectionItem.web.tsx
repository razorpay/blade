import styled from 'styled-components';
import { isReactNative } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { BaseMenuItem } from '~components/BaseMenu';

const StyledQuickSelectionWrapper = styled.div(({ theme }) => ({
  '& > *': {
    borderRadius: theme.border.radius.small,
    '&:hover:not([aria-disabled=true])': {
      backgroundColor: `${theme.colors.interactive.background.gray.default} !important`,
    },
    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      backgroundColor: `${theme.colors.interactive.background.gray.default} !important`,
    },
    '&[aria-selected=true], &[aria-selected=true]:hover': {
      backgroundColor: `${theme.colors.interactive.background.gray.fadedHighlighted} !important`,
    },
    '&[aria-selected=true]': {
      backgroundColor: `${theme.colors.interactive.background.gray.fadedHighlighted} !important`,
    },
    '& p': {
      fontSize: `${theme.typography.fonts.size[75]}px !important`,
      lineHeight: `${theme.typography.lineHeights[75]}px !important`,
      fontWeight: `${theme.typography.fonts.weight.medium} !important`,
      fontFamily: `${theme.typography.fonts.family.text} !important`,
    },
  },
}));

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
    <StyledQuickSelectionWrapper>
      <BaseMenuItem
        as={!isReactNative() ? 'button' : undefined}
        selectionType="single"
        isSelected={isSelected}
        onClick={onClick}
        title={children}
        role="option"
        data-analytics-name={children}
      />
    </StyledQuickSelectionWrapper>
  );
};

export { QuickSelectionItem };
