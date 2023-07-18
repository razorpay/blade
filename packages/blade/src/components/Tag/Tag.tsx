import React from 'react';
import { Box } from '~components/Box';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { IconButton } from '~components/Button/IconButton';
import type { IconComponent } from '~components/Icons';
import { CloseIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { StringChildrenType, TestID } from '~utils/types';
import { isReactNative } from '~utils';
import BaseBox from '~components/Box/BaseBox';

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
} & StyledPropsBlade &
  TestID;

const Tag = ({
  size = 'medium',
  icon: Icon,
  onDismiss,
  children,
  isDisabled,
  testID,
  ...styledProps
}: TagProps): React.ReactElement | null => {
  const textColor = isDisabled
    ? 'surface.text.placeholder.lowContrast'
    : 'surface.text.subtle.lowContrast';

  return (
    <BaseBox
      display={(isReactNative() ? 'flex' : 'inline-flex') as never}
      alignSelf={isReactNative() ? 'center' : undefined}
      flexDirection="row"
      flexWrap="nowrap"
      backgroundColor="brand.gray.a100.lowContrast"
      borderRadius="max"
      padding={
        size === 'medium'
          ? ['spacing.1', 'spacing.2', 'spacing.1', 'spacing.3']
          : ['spacing.2', 'spacing.3', 'spacing.2', 'spacing.4']
      }
      {...getStyledProps(styledProps)}
      {...metaAttribute({ name: MetaConstants.Tag, testID })}
    >
      <Box display="flex" flexDirection="row" flexWrap="nowrap" alignItems="center">
        {Icon ? <Icon color={textColor} size="small" marginRight="spacing.2" /> : null}
        <Text marginRight="spacing.2" color={textColor} size="small">
          {children}
        </Text>
        <IconButton
          size="small"
          icon={CloseIcon}
          accessibilityLabel={`Close ${children} tag`}
          isDisabled={isDisabled}
          data-tagremove="true"
          onClick={() => {
            onDismiss();
          }}
        />
      </Box>
    </BaseBox>
  );
};

export { Tag, TagProps };
