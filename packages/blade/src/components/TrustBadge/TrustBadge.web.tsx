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
 * A generic trust badge — a brand shield paired with a sea-tinted pill that displays
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
 * <TrustBadge />                        // shield + label pill (default)
 * <TrustBadge variant="icon-only" />    // shield only, no pill/text
 * <TrustBadge label="Razorpay Verified" />  // custom trust label
 * ```
 */
const _TrustBadge = ({
  variant = 'default',
  label = DEFAULT_LABEL,
  testID,
  ...rest
}: TrustBadgeProps): React.ReactElement => {
  const isIconOnly = variant === 'icon-only';

  return (
    <BaseBox
      display="inline-flex"
      flexDirection="row"
      alignItems="center"
      flexShrink={0}
      gap={isIconOnly ? undefined : 'spacing.2'}
      height={isIconOnly ? undefined : '24px'}
      padding={isIconOnly ? 'spacing.2' : ['spacing.2', 'spacing.3']}
      borderRadius={isIconOnly ? undefined : 'max'}
      backgroundColor={isIconOnly ? undefined : 'surface.background.sea.subtle'}
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
        {...(isIconOnly ? makeAccessible({ role: 'img', label }) : { 'aria-hidden': true })}
      >
        <RazorpayTrustIcon size="medium" />
      </BaseBox>
      {isIconOnly ? null : (
        <Text size="xsmall" weight="regular" color="surface.text.gray.subtle">
          {label}
        </Text>
      )}
    </BaseBox>
  );
};

const TrustBadge = assignWithoutSideEffects(_TrustBadge, {
  componentId: MetaConstants.TrustBadge,
});

export { TrustBadge };
