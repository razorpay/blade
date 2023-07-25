import React from 'react';
import styled from 'styled-components';
import { Box } from '~components/Box';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import type { IconButtonProps } from '~components/Button/IconButton';
import { IconButton } from '~components/Button/IconButton';
import type { IconComponent, IconProps } from '~components/Icons';
import { CloseIcon } from '~components/Icons';
import type { TextProps } from '~components/Typography';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { StringChildrenType, TestID } from '~utils/types';
import { isReactNative, makeSize } from '~utils';
import { size as globalSizeTokens } from '~tokens/global';
import BaseBox from '~components/Box/BaseBox';
import type { PaddingProps } from '~components/Box/BaseBox/types/spacingTypes';

type TagProps = {
  /**
   * Decides the size of Tag
   *
   * @default medium
   */
  size?: 'medium' | 'large';

  /**
   * Leading icon for your Tag
   */
  icon?: IconComponent;

  /**
   * Callback when close icon on Tag is clicked
   */
  onDismiss: () => void;

  /**
   * Text that renders inside Tag
   */
  children: StringChildrenType;

  /**
   * Disable tag
   */
  isDisabled?: boolean;

  /**
   *
   */
  _isTagFocussed?: boolean;
} & StyledPropsBlade &
  TestID;

const FocussableTag = styled(BaseBox)<{ isTagFocussed: TagProps['_isTagFocussed'] }>((props) => {
  if (props.isTagFocussed) {
    return {
      outline: `1px solid ${props.theme.colors.surface.background.level1.lowContrast}`,
      boxShadow: `0px 0px 0px 4px ${props.theme.colors.brand.primary[400]}`,
    };
  }

  return {};
});
const Desktop = ({ children }: { children: (React.ReactElement | null)[] }): React.ReactElement => (
  <Box display={{ base: 'none', m: 'flex' }} alignItems="center" flexDirection="row">
    {children}
  </Box>
);

const Mobile = ({ children }: { children: (React.ReactElement | null)[] }): React.ReactElement => (
  <Box display={{ base: 'flex', m: 'none' }} alignItems="center" flexDirection="row">
    {children}
  </Box>
);

const Tag = ({
  size = 'medium',
  icon: Icon,
  onDismiss,
  children,
  isDisabled,
  testID,
  _isTagFocussed,
  ...styledProps
}: TagProps): React.ReactElement | null => {
  const textColor = isDisabled
    ? 'surface.text.placeholder.lowContrast'
    : 'surface.text.subtle.lowContrast';

  const mediumPadding: PaddingProps['padding'] = {
    base: ['spacing.2', 'spacing.3', 'spacing.2', 'spacing.4'],
    m: ['spacing.1', 'spacing.2', 'spacing.1', 'spacing.3'],
  };

  const largePadding: PaddingProps['padding'] = {
    base: ['spacing.2', 'spacing.3', 'spacing.2', 'spacing.4'],
    m: ['spacing.2', 'spacing.3', 'spacing.2', 'spacing.4'],
  };

  const getLeadingIcon = ({ size }: { size: IconProps['size'] }): React.ReactElement | null =>
    Icon ? (
      <Box>
        <Icon color={textColor} size={size} marginRight="spacing.2" />
      </Box>
    ) : null;

  const getTagText = ({
    size,
  }: {
    size: TextProps<{ variant: 'body' }>['size'];
  }): React.ReactElement => (
    <Box maxWidth={makeSize(globalSizeTokens['100'])}>
      <Text truncateAfterLines={1} marginRight="spacing.2" color={textColor} size={size}>
        {children}
      </Text>
    </Box>
  );

  const getCloseIcon = ({ size }: { size: IconButtonProps['size'] }): React.ReactElement => (
    <IconButton
      size={size}
      icon={CloseIcon}
      accessibilityLabel={`Close ${children} tag`}
      isDisabled={isDisabled}
      onClick={() => {
        onDismiss();
      }}
    />
  );

  return (
    <FocussableTag
      display={(isReactNative() ? 'flex' : 'inline-flex') as never}
      alignSelf={isReactNative() ? 'center' : undefined}
      flexDirection="row"
      flexWrap="nowrap"
      backgroundColor="brand.gray.a100.lowContrast"
      borderRadius="max"
      padding={size === 'medium' ? mediumPadding : largePadding}
      {...getStyledProps(styledProps)}
      {...metaAttribute({ name: MetaConstants.Tag, testID })}
      isTagFocussed={_isTagFocussed}
    >
      <Box display="flex" flexDirection="row" flexWrap="nowrap" alignItems="center">
        <Desktop>
          {getLeadingIcon({ size: 'small' })}
          {getTagText({ size: 'small' })}
          {getCloseIcon({ size: 'small' })}
        </Desktop>
        <Mobile>
          {getLeadingIcon({ size: size === 'large' ? 'medium' : 'small' })}
          {getTagText({ size: size === 'large' ? 'medium' : 'small' })}
          {getCloseIcon({ size: size === 'large' ? 'medium' : 'small' })}
        </Mobile>
      </Box>
    </FocussableTag>
  );
};

export { Tag, TagProps };
