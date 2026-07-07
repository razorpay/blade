import React from 'react';
import styled from 'styled-components/native';
import BaseBox from '~components/Box/BaseBox';
import type { Theme } from '~components/BladeProvider';
import { makeBorderSize } from '~utils';

type TicketStateProps = {
  isSelected?: boolean;
  isDisabled?: boolean;
};

const getTicketBorderColor = (
  theme: Theme,
  { isSelected, isDisabled }: TicketStateProps,
): string => {
  if (isSelected && !isDisabled) {
    return theme.colors.surface.border.primary.normal;
  }
  return theme.colors.surface.border.gray.subtle;
};

const getTicketBorderStyle = ({ isDisabled }: TicketStateProps): 'solid' | 'dashed' =>
  isDisabled ? 'dashed' : 'solid';

// React Native cannot punch notches or paint scalloped masks, so the native ticket degrades to
// bordered sections split by a dashed tear line without the semicircular cut-outs/scallops.
const NativeTearLine = styled(BaseBox)(({ theme }) => ({
  borderTopWidth: makeBorderSize(theme.border.width.thin),
  borderStyle: 'dashed' as const,
  borderTopColor: theme.colors.surface.border.gray.subtle,
}));

const TicketSection = styled(BaseBox)<TicketStateProps & { position: 'top' | 'bottom' }>(
  ({ theme, isSelected, isDisabled, position }) => {
    const borderColor = getTicketBorderColor(theme, { isSelected, isDisabled });
    const borderStyle = getTicketBorderStyle({ isDisabled });
    const borderWidth = makeBorderSize(theme.border.width.thin);
    const radius = makeBorderSize(theme.border.radius.medium);
    const isTop = position === 'top';

    return {
      borderStyle,
      borderColor,
      borderLeftWidth: borderWidth,
      borderRightWidth: borderWidth,
      ...(isTop
        ? {
            backgroundColor: theme.colors.surface.background.gray.intense,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            borderTopWidth: borderWidth,
          }
        : {
            backgroundColor: theme.colors.surface.background.gray.moderate,
            borderBottomLeftRadius: radius,
            borderBottomRightRadius: radius,
            borderBottomWidth: borderWidth,
          }),
    };
  },
);

type CardTicketSurfaceProps = {
  top: React.ReactNode;
  bottom: React.ReactNode;
  tearLine: React.ReactNode;
  children?: React.ReactNode;
} & TicketStateProps;

const CardTicketSurface = ({
  top,
  bottom,
  // tearLine is intentionally unused on native — NativeTearLine draws the tear line unconditionally
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tearLine: _tearLine,
  children,
  isSelected,
  isDisabled,
}: CardTicketSurfaceProps): React.ReactElement => {
  return (
    <BaseBox width="100%" flexDirection="column">
      {children}
      <TicketSection
        position="top"
        isSelected={isSelected}
        isDisabled={isDisabled}
        paddingTop="spacing.4"
        paddingBottom="spacing.2"
        paddingLeft="spacing.4"
        paddingRight="spacing.4"
      >
        {top}
      </TicketSection>
      <NativeTearLine marginX="spacing.4" />
      <TicketSection
        position="bottom"
        isSelected={isSelected}
        isDisabled={isDisabled}
        paddingTop="spacing.2"
        paddingBottom="spacing.4"
        paddingLeft="spacing.4"
        paddingRight="spacing.4"
      >
        {bottom}
      </TicketSection>
    </BaseBox>
  );
};

export { CardTicketSurface };
