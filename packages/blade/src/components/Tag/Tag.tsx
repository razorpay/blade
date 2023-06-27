import styled from 'styled-components';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import type { StringChildrenType } from '~src/_helpers/types';
import { makeSpace } from '~utils';

type TagProps = {
  /**
   * Decides the size of Tag
   *
   * @default medium
   */
  size?: 'medium' | 'large';

  /**
   * Callback when close icon on Tag is clicked
   */
  onDismiss?: () => void;

  /**
   * Text that renders inside Tag
   */
  children: StringChildrenType;

  /**
   * Disable tag
   */
  isDisabled?: boolean;
} & StyledPropsBlade;

const StyledTag = styled(BaseBox)<Pick<TagProps, 'size' | 'isDisabled'>>((props) => {
  return {
    backgroundColor: props.theme.colors.brand.gray.a100.lowContrast,
    // borderRadius: props.theme.border.radius.round,
    // @TODO: check with designer which token should be used for borderRadius
    borderRadius: '100px',
    borderWidth: makeSpace(props.theme.border.width.none),
    display: 'inline-block',
    padding:
      props.size === 'medium'
        ? `${makeSpace(2)} ${makeSpace(4)} ${makeSpace(2)} ${makeSpace(8)}`
        : `${makeSpace(4)} ${makeSpace(8)} ${makeSpace(4)} ${makeSpace(12)}`,
  };
});

const Tag = ({
  size = 'medium',
  onDismiss,
  children,
  isDisabled,
  ...styledProps
}: TagProps): React.ReactElement => {
  return (
    <StyledTag size={size} isDisabled={isDisabled} {...styledProps}>
      <Box display="flex">
        <Text marginRight="spacing.2" type="subtle" contrast="low" size="small">
          {children}
        </Text>
        <IconButton
          size="small"
          icon={CloseIcon}
          accessibilityLabel={`Close ${children} tag`}
          onClick={() => onDismiss?.()}
        />
      </Box>
    </StyledTag>
  );
};

export { Tag, TagProps };
