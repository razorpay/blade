import React from 'react';
import type { TrustBadgeProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { RazorpayTrustIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const DEFAULT_LABEL = 'Razorpay Trusted Business';

/**
 * ### TrustBadge
 *
 * A generic trust badge — a brand shield paired with a faded pill that displays
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
 * <TrustBadge />                        // subtle (default) — dark text, for light surfaces
 * <TrustBadge emphasis="intense" />     // white text, for dark/colored surfaces
 * <TrustBadge variant="icon-only" />    // shield only, no pill/text
 * <TrustBadge label="Razorpay Verified" />  // custom trust label
 * ```
 */
const _TrustBadge = ({
  variant = 'default',
  emphasis = 'subtle',
  label = DEFAULT_LABEL,
  testID,
  ...rest
}: TrustBadgeProps): React.ReactElement => {
  const isIconOnly = variant === 'icon-only';
  const textColor =
    emphasis === 'subtle' ? 'surface.text.staticBlack.normal' : 'surface.text.staticWhite.normal';
  // Checkout DS: intense pill = 32% black; subtle pill = 10% black on light surfaces.
  const pillBackgroundColor =
    emphasis === 'subtle' ? 'rgba(0, 0, 0, 0.1)' : 'surface.icon.staticBlack.disabled';

  return (
    <BaseBox
      display="inline-flex"
      flexDirection="row"
      alignItems="center"
      flexShrink={0}
      {...metaAttribute({ name: MetaConstants.TrustBadge, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {/* In the default variant the pill text announces the badge, so the shield is decorative.
        In the icon-only variant there is no visible text, so the shield wrapper carries the label. */}
      <BaseBox
        display="flex"
        alignItems="center"
        flexShrink={0}
        position="relative"
        zIndex={2}
        marginRight={isIconOnly ? undefined : '-12px'}
        {...(isIconOnly ? makeAccessible({ role: 'img', label }) : { 'aria-hidden': true })}
      >
        <RazorpayTrustIcon size="medium" />
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

const TrustBadge = assignWithoutSideEffects(_TrustBadge, {
  componentId: MetaConstants.TrustBadge,
});

export { TrustBadge };
