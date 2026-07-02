import React from 'react';
import type { RTBBadgeProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { RTBShieldIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const RTB_LABEL = 'Razorpay Trusted Business';

/**
 * ### RTBBadge
 *
 * The "Razorpay Trusted Business" badge — a brand shield paired with a faded pill.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
 * <RTBBadge variant="neutral" />      // white text, for dark/colored surfaces
 * <RTBBadge variant="subtle" />       // dark text, for light surfaces
 * <RTBBadge type="icon" />            // shield only, no pill/text
 * ```
 */
const _RTBBadge = ({
  type = 'full',
  variant = 'neutral',
  testID,
  ...rest
}: RTBBadgeProps): React.ReactElement => {
  const isIconOnly = type === 'icon';
  const textColor =
    variant === 'subtle' ? 'surface.text.staticBlack.normal' : 'surface.text.staticWhite.normal';
  // Checkout DS: neutral pill = 32% black; subtle pill = 10% black on light surfaces.
  const pillBackgroundColor =
    variant === 'subtle' ? 'rgba(0, 0, 0, 0.1)' : 'surface.icon.staticBlack.disabled';

  return (
    <BaseBox
      display="inline-flex"
      flexDirection="row"
      alignItems="center"
      flexShrink={0}
      {...metaAttribute({ name: MetaConstants.RTBBadge, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {/* In the full form the pill text announces the badge, so the shield is decorative.
       In the icon-only form there is no visible text, so the shield wrapper carries the label. */}
      <BaseBox
        display="flex"
        alignItems="center"
        flexShrink={0}
        position="relative"
        zIndex={2}
        marginRight={isIconOnly ? undefined : '-12px'}
        {...(isIconOnly
          ? makeAccessible({ role: 'img', label: RTB_LABEL })
          : { 'aria-hidden': true })}
      >
        <RTBShieldIcon size="medium" />
      </BaseBox>
      {isIconOnly ? null : (
        <BaseBox
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          position="relative"
          zIndex={1}
          flexShrink={0}
          paddingTop="spacing.1"
          paddingBottom="spacing.1"
          paddingLeft="spacing.5"
          paddingRight="10px"
          borderRadius="large"
          backgroundColor={pillBackgroundColor}
        >
          <Text size="xsmall" weight="regular" color={textColor}>
            {RTB_LABEL}
          </Text>
        </BaseBox>
      )}
    </BaseBox>
  );
};

const RTBBadge = assignWithoutSideEffects(_RTBBadge, {
  componentId: MetaConstants.RTBBadge,
});

export { RTBBadge };
