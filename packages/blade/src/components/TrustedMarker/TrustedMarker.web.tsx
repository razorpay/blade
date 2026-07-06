import React from 'react';
import type { TrustedMarkerProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { RTBShieldIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const DEFAULT_LABEL = 'Razorpay Trusted Business';

/**
 * ### TrustedMarker
 *
 * A generic trust marker — a brand shield paired with a faded pill that displays
 * a configurable trust label (default: "Razorpay Trusted Business").
 *
 * The component is intentionally generic so the label and semantics can evolve
 * (e.g. "Razorpay Verified") without a breaking API change.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
 * <TrustedMarker variant="neutral" />      // white text, for dark/colored surfaces
 * <TrustedMarker variant="subtle" />       // dark text, for light surfaces
 * <TrustedMarker type="icon" />            // shield only, no pill/text
 * <TrustedMarker label="Razorpay Verified" />  // custom trust label
 * ```
 */
const _TrustedMarker = ({
  type = 'full',
  variant = 'neutral',
  label = DEFAULT_LABEL,
  testID,
  ...rest
}: TrustedMarkerProps): React.ReactElement => {
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
      {...metaAttribute({ name: MetaConstants.TrustedMarker, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {/* In the full form the pill text announces the marker, so the shield is decorative.
        In the icon-only form there is no visible text, so the shield wrapper carries the label. */}
      <BaseBox
        display="flex"
        alignItems="center"
        flexShrink={0}
        position="relative"
        zIndex={2}
        marginRight={isIconOnly ? undefined : '-12px'}
        {...(isIconOnly
          ? makeAccessible({ role: 'img', label })
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
            {label}
          </Text>
        </BaseBox>
      )}
    </BaseBox>
  );
};

const TrustedMarker = assignWithoutSideEffects(_TrustedMarker, {
  componentId: MetaConstants.TrustedMarker,
});

export { TrustedMarker };
