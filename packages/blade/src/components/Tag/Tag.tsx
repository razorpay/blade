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
   * Private property for Blade.
   *
   * Should not be used by consumers.
   *
   * Used for adding virtual focus on tag.
   *
   * @private
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
const ShowOnDesktop = ({
  children,
}: {
  children: (React.ReactElement | null)[];
}): React.ReactElement => (
  <Box
    display={{ base: 'none', m: 'flex' }}
    alignItems="center"
    flexDirection="row"
    flexWrap="nowrap"
  >
    {children}
  </Box>
);

const ShowOnMobile = ({
  children,
}: {
  children: (React.ReactElement | null)[];
}): React.ReactElement => (
  <Box
    display={{ base: 'flex', m: 'none' }}
    alignItems="center"
    flexDirection="row"
    flexWrap="nowrap"
  >
    {children}
  </Box>
);

/**
 * ## Tags
 *
 * Tag component can be used to display selected items on UI.
 *
 * ### Usage
 *
 * ***Note:*** _Make sure to handle state when using Tag_
 *
 * ```jsx
 * const [showTag, setShowTag] = React.useState(true);
 *
 * // ...
 *
 * {showTag && (
 *  <Tag
 *    icon={CheckIcon}
 *    onDismiss={() => setShowTag(false)}
 *  >
 *    Transactions
 *  </Tag>
 * )}
 * ```
 *
 * Checkout [Tags Documentation](https://blade.razorpay.com/?path=/story/components-tag--default) for more info.
 *
 */
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
      <Box display="flex" flexDirection="row" alignItems="center">
        <Icon color={textColor} size={size} marginRight="spacing.2" />
      </Box>
    ) : null;

  const getTagText = ({
    size,
  }: {
    size: TextProps<{ variant: 'body' }>['size'];
  }): React.ReactElement => (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      maxWidth={makeSize(globalSizeTokens['100'])}
    >
      <Text truncateAfterLines={1} marginRight="spacing.2" color={textColor} size={size}>
        {children}
      </Text>
    </Box>
  );

  const getCloseIcon = ({ size }: { size: IconButtonProps['size'] }): React.ReactElement => (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
      <IconButton
        size={size}
        icon={CloseIcon}
        accessibilityLabel={`Close ${children} tag`}
        isDisabled={isDisabled}
        onClick={() => {
          onDismiss();
        }}
      />
    </Box>
  );

  return (
    <BaseBox
      display={(isReactNative() ? 'flex' : 'inline-flex') as never}
      {...getStyledProps(styledProps)}
      {...metaAttribute({ name: MetaConstants.Tag, testID })}
    >
      <FocussableTag
        display={(isReactNative() ? 'flex' : 'inline-flex') as never}
        alignSelf={isReactNative() ? 'center' : undefined}
        flexDirection="row"
        flexWrap="nowrap"
        backgroundColor="brand.gray.a100.lowContrast"
        borderRadius="max"
        padding={size === 'medium' ? mediumPadding : largePadding}
        isTagFocussed={_isTagFocussed}
      >
        <ShowOnDesktop>
          {getLeadingIcon({ size: 'small' })}
          {getTagText({ size: 'small' })}
          {getCloseIcon({ size: 'small' })}
        </ShowOnDesktop>
        <ShowOnMobile>
          {getLeadingIcon({ size: size === 'large' ? 'medium' : 'small' })}
          {getTagText({ size: size === 'large' ? 'medium' : 'small' })}
          {getCloseIcon({ size: size === 'large' ? 'medium' : 'small' })}
        </ShowOnMobile>
      </FocussableTag>
    </BaseBox>
  );
};

export { Tag, TagProps };
