import React from 'react';
import type { ReactElement } from 'react';

import { StyledAnnouncementBanner } from './StyledAnnouncementBanner';
import { getBannerIconColor, getBannerTextColor } from './styles';
import type { AnnouncementBannerProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { BladeElementRef } from '~utils/types';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AnnouncementBanner = (
  {
    children,
    alignment = 'center',
    icon: Icon,
    showIcon = true,
    accessibilityLabel = 'Announcement',
    testID,
    ...rest
  }: AnnouncementBannerProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const a11yProps = makeAccessible({
    role: 'region',
    label: accessibilityLabel,
  });

  const shouldShowIcon = showIcon && Boolean(Icon);

  return (
    <StyledAnnouncementBanner
      ref={ref as never}
      isDark={isDark}
      alignment={alignment}
      {...a11yProps}
      {...metaAttribute({ name: MetaConstants.AnnouncementBanner, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {shouldShowIcon && Icon ? (
        <BaseBox
          display="flex"
          alignItems="center"
          marginRight="spacing.2"
          {...makeAccessible({ hidden: true })}
        >
          <Icon size="small" color={getBannerIconColor(isDark)} />
        </BaseBox>
      ) : null}
      <Text size="small" weight="medium" color={getBannerTextColor(isDark)} truncateAfterLines={1}>
        {children}
      </Text>
    </StyledAnnouncementBanner>
  );
};

const AnnouncementBanner = assignWithoutSideEffects(React.forwardRef(_AnnouncementBanner), {
  displayName: 'AnnouncementBanner',
});

export type { AnnouncementBannerProps };
export { AnnouncementBanner };
