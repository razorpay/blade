import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import { isReactNative, makeBorderSize } from '~utils';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { BladeElementRef, TestID } from '~utils/types';
import getIn from '~utils/lodashButBetter/get';

type SectionSeparatorProps = {
  /**
   * The section label displayed before the gradient line
   */
  label?: string;
  /**
   * Controls the intensity of the separator line color
   *
   * @default 'muted'
   */
  variant?: 'normal' | 'subtle' | 'muted';
} & TestID &
  StyledPropsBlade;

const StyledGradientLine = styled(BaseBox)<{
  gradientColor: string;
  isNative: boolean;
}>(({ theme, gradientColor, isNative }) =>
  isNative
    ? {
        borderBottomStyle: 'solid',
        borderBottomWidth: makeBorderSize(theme.border.width.thin),
        borderBottomColor: gradientColor,
        flexGrow: 1,
      }
    : {
        background: `linear-gradient(to right, ${gradientColor}, transparent)`,
        height: '1px',
        flexGrow: 1,
      },
);

const _SectionSeparator = (
  { label, variant = 'muted', testID, ...styledProps }: SectionSeparatorProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  const gradientColor = getIn(theme, `colors.surface.border.gray.${variant}`) as string;
  const native = isReactNative();

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap="spacing.3"
      {...metaAttribute({ name: MetaConstants.SectionSeparator, testID })}
      {...getStyledProps(styledProps)}
    >
      {label ? (
        <Text
          size="small"
          color="surface.text.gray.muted"
          weight="medium"
          whiteSpace="nowrap"
        >
          {label}
        </Text>
      ) : null}
      <StyledGradientLine gradientColor={gradientColor} isNative={native} />
    </BaseBox>
  );
};

const SectionSeparator = React.forwardRef(_SectionSeparator);
SectionSeparator.displayName = 'SectionSeparator';

export { SectionSeparator };
export type { SectionSeparatorProps };
