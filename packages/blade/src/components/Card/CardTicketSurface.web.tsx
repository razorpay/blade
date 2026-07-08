import React from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import {
  CARD_TICKET_NOTCH_RADIUS,
  CARD_TICKET_SCALLOP_PERIOD,
  CARD_TICKET_SCALLOP_RADIUS,
} from './constants';
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
  // Precedence: a disabled ticket never shows the selected (primary) border.
  if (isSelected && !isDisabled) {
    return theme.colors.surface.border.primary.normal;
  }
  return theme.colors.surface.border.gray.subtle;
};

const getTicketBorderStyle = ({ isDisabled }: TicketStateProps): 'solid' | 'dashed' =>
  isDisabled ? 'dashed' : 'solid';

/**
 * Paints the scalloped perforation onto the top edge of the bottom section. A repeating
 * radial-gradient draws white (header coloured) half-discs that poke down into the gray footer,
 * so the seam reads as a torn/stamp edge. Because the discs are painted (not cut) they keep their
 * colour on any page background.
 */
const scallopBackground = (theme: Theme): CSSObject => {
  const radius = CARD_TICKET_SCALLOP_RADIUS;
  const period = CARD_TICKET_SCALLOP_PERIOD;
  const fill = theme.colors.surface.background.gray.intense;
  return {
    backgroundImage: `radial-gradient(circle ${radius}px at ${period / 2}px 0px, ${fill} ${
      radius - 0.5
    }px, transparent ${radius}px)`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: `${period}px 100%`,
    backgroundPosition: 'left top',
  };
};

const TicketWrapper = styled(BaseBox)((): CSSObject => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  // Clips the half-circle notches (which are positioned half outside each edge) to the inner
  // half, mirroring Figma's `overflow: clip` cut-circle technique.
  overflow: 'hidden',
}));

const TicketSection = styled(BaseBox)<TicketStateProps & { position: 'top' | 'bottom' }>(({
  theme,
  isSelected,
  isDisabled,
  position,
}): CSSObject => {
  const borderColor = getTicketBorderColor(theme, { isSelected, isDisabled });
  const borderStyle = getTicketBorderStyle({ isDisabled });
  const borderWidth = makeBorderSize(theme.border.width.thin);
  const radius = makeBorderSize(theme.border.radius.medium);
  const isTop = position === 'top';

  return {
    position: 'relative',
    boxSizing: 'border-box',
    borderColor,
    borderStyle,
    borderLeftWidth: borderWidth,
    borderRightWidth: borderWidth,
    // The two sections meet flush at the tear line, so the adjoining edges carry no border.
    ...(isTop
      ? {
          backgroundColor: theme.colors.surface.background.gray.intense,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderTopWidth: borderWidth,
          borderBottomWidth: '0px',
        }
      : {
          backgroundColor: theme.colors.surface.background.gray.moderate,
          borderBottomLeftRadius: radius,
          borderBottomRightRadius: radius,
          borderBottomWidth: borderWidth,
          borderTopWidth: '0px',
          ...scallopBackground(theme),
        }),
  };
});

/**
 * A white-filled, state-outlined circle centred on the tear line and pushed half outside an edge.
 * The wrapper's `overflow: hidden` clips it to the inner half, producing an outlined semicircular
 * notch. Rendered inside the (later-painted) bottom section so it sits above both sections.
 */
const NotchCircle = styled(BaseBox)<TicketStateProps & { side: 'left' | 'right' }>(({
  theme,
  isSelected,
  isDisabled,
  side,
}): CSSObject => {
  const radius = CARD_TICKET_NOTCH_RADIUS;
  return {
    position: 'absolute',
    top: `-${radius}px`,
    [side]: `-${radius}px`,
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    borderRadius: '50%',
    boxSizing: 'border-box',
    backgroundColor: theme.colors.surface.background.gray.intense,
    borderStyle: getTicketBorderStyle({ isDisabled }),
    borderColor: getTicketBorderColor(theme, { isSelected, isDisabled }),
    borderWidth: makeBorderSize(theme.border.width.thin),
  };
});

type CardTicketSurfaceProps = {
  top: React.ReactNode;
  bottom: React.ReactNode;
  /**
   * Interactive overlay (link/button) that spans the whole ticket.
   */
  children?: React.ReactNode;
} & TicketStateProps;

/**
 * Renders the ticket "chrome": two stacked sections split by a scalloped tear line with an
 * outlined semicircular notch on either edge. Content for each section is passed via `top`/`bottom`.
 */
const CardTicketSurface = ({
  top,
  bottom,
  children,
  isSelected,
  isDisabled,
}: CardTicketSurfaceProps): React.ReactElement => {
  return (
    <TicketWrapper>
      <TicketSection
        position="top"
        isSelected={isSelected}
        isDisabled={isDisabled}
        paddingTop="spacing.4"
        paddingBottom="spacing.4"
        paddingLeft="spacing.4"
        paddingRight="spacing.4"
      >
        {top}
      </TicketSection>
      <TicketSection
        position="bottom"
        isSelected={isSelected}
        isDisabled={isDisabled}
        paddingTop="spacing.4"
        paddingBottom="spacing.4"
        paddingLeft="spacing.4"
        paddingRight="spacing.4"
      >
        <NotchCircle side="left" isSelected={isSelected} isDisabled={isDisabled} />
        <NotchCircle side="right" isSelected={isSelected} isDisabled={isDisabled} />
        {bottom}
      </TicketSection>
      {children}
    </TicketWrapper>
  );
};

export { CardTicketSurface };
