import React, { useMemo, useRef, useState } from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import {
  CARD_TICKET_SCALLOP_PERIOD,
  CARD_TICKET_SCALLOP_RADIUS,
} from './constants';
import BaseBox from '~components/Box/BaseBox';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~utils';
import {
  buildTicketShellPath,
  CARD_TICKET_OUTLINE_STROKE_WIDTH,
} from '~utils/cardTicketOutline';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

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

const TicketWrapper = styled(BaseBox)(
  (): CSSObject => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  }),
);

const TicketClipContent = styled(BaseBox)(
  (): CSSObject => ({
    position: 'relative',
    zIndex: 0,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  }),
);

const TicketOutline = styled.svg(
  (): CSSObject => ({
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
    overflow: 'visible',
  }),
);

const TicketSection = styled(BaseBox)<{ position: 'top' | 'bottom' }>(
  ({ theme, position }): CSSObject => {
    const isTop = position === 'top';

    return {
      position: 'relative',
      boxSizing: 'border-box',
      ...(isTop
        ? {
            backgroundColor: theme.colors.surface.background.gray.intense,
          }
        : {
            backgroundColor: theme.colors.surface.background.gray.moderate,
            ...scallopBackground(theme),
          }),
    };
  },
);

type CardTicketSurfaceProps = {
  top: React.ReactNode;
  bottom: React.ReactNode;
  /**
   * The tear line marker (`CardTearLine`) used only to split the content; the perforation itself
   * is drawn by this surface.
   */
  tearLine: React.ReactNode;
  /**
   * Interactive overlay (link/button) that spans the whole ticket.
   */
  children?: React.ReactNode;
} & TicketStateProps;

/**
 * Renders the ticket "chrome": two stacked sections split by a scalloped tear line with inward
 * side notches. The ticket shell is drawn by an inline SVG; content is clipped to the same path.
 */
const CardTicketSurface = ({
  top,
  bottom,
  tearLine,
  children,
  isSelected,
  isDisabled,
}: CardTicketSurfaceProps): React.ReactElement => {
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, tearLineY: 0 });

  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const topSection = topSectionRef.current;

    if (!wrapper || !topSection) {
      return;
    }

    const updateDimensions = (): void => {
      setDimensions((previousDimensions) => {
        const nextDimensions = {
          width: wrapper.offsetWidth,
          height: wrapper.offsetHeight,
          tearLineY: topSection.offsetHeight,
        };

        if (
          previousDimensions.width === nextDimensions.width &&
          previousDimensions.height === nextDimensions.height &&
          previousDimensions.tearLineY === nextDimensions.tearLineY
        ) {
          return previousDimensions;
        }

        return nextDimensions;
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(wrapper);
    resizeObserver.observe(topSection);

    return (): void => {
      resizeObserver.disconnect();
    };
  }, []);

  const shellPath = useMemo(() => buildTicketShellPath(dimensions), [dimensions]);

  const strokeColor = getTicketBorderColor(theme, { isSelected, isDisabled });
  const strokeDasharray = isDisabled ? '6 4' : undefined;

  const strokePadding = CARD_TICKET_OUTLINE_STROKE_WIDTH / 2;
  const svgViewBox = shellPath
    ? `${-strokePadding} ${-strokePadding} ${dimensions.width + CARD_TICKET_OUTLINE_STROKE_WIDTH} ${dimensions.height + CARD_TICKET_OUTLINE_STROKE_WIDTH}`
    : '0 0 0 0';

  return (
    <TicketWrapper ref={wrapperRef}>
      <TicketClipContent
        style={shellPath ? { clipPath: `path('${shellPath}')` } : undefined}
      >
        <TicketSection
          ref={topSectionRef}
          position="top"
          paddingTop="spacing.4"
          paddingBottom="spacing.4"
          paddingLeft="spacing.4"
          paddingRight="spacing.4"
        >
          {top}
        </TicketSection>
        {tearLine}
        <TicketSection
          position="bottom"
          paddingTop="spacing.4"
          paddingBottom="spacing.4"
          paddingLeft="spacing.4"
          paddingRight="spacing.4"
        >
          {bottom}
        </TicketSection>
      </TicketClipContent>

      {shellPath ? (
        <TicketOutline viewBox={svgViewBox} preserveAspectRatio="none" aria-hidden>
          <path
            d={shellPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={CARD_TICKET_OUTLINE_STROKE_WIDTH}
            strokeDasharray={strokeDasharray}
            vectorEffect="non-scaling-stroke"
          />
        </TicketOutline>
      ) : null}

      {children}
    </TicketWrapper>
  );
};

export { CardTicketSurface };
