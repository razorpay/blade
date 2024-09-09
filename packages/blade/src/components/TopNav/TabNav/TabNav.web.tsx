import React from 'react';
import styled from 'styled-components';
import { useTopNavContext } from '../TopNavContext';
import { approximatelyEqual, MIXED_BG_COLOR, useHasOverflow } from './utils';
import { TabNavContext } from './TabNavContext';
import BaseBox from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';
import { ChevronLeftIcon, ChevronRightIcon } from '~components/Icons';
import { makeMotionTime, makeSize } from '~utils';
import { size } from '~tokens/global';
import getIn from '~utils/lodashButBetter/get';
import type { BoxProps } from '~components/Box';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const GRADIENT_WIDTH = 54 as const;
const GRADIENT_OFFSET = -8 as const;
const OFFSET_BOTTOM = -12 as const;
const SCROLL_AMOUNT = 200;

type TabNavProps = {
  children: React.ReactNode;
};

const ScrollableArea = styled(BaseBox)(() => {
  return {
    '&::-webkit-scrollbar': { display: 'none' },
  };
});

const GradientOverlay = styled(BaseBox)<{
  shouldShow?: boolean;
  variant: 'left' | 'right';
  $color: BoxProps['backgroundColor'];
}>(({ theme, shouldShow, variant, $color }) => {
  const color = getIn(theme.colors, $color as never, MIXED_BG_COLOR);

  return {
    position: 'absolute',
    [variant]: 0,
    pointerEvents: shouldShow ? 'auto' : 'none',
    transform: shouldShow ? 'scale(1)' : 'scale(0.5)',
    opacity: shouldShow ? 1 : 0,
    transitionTimingFunction: `${theme.motion.easing.emphasized}`,
    transitionDuration: `${makeMotionTime(theme.motion.duration.xquick)}`,
    transitionProperty: 'opacity, transform',
    zIndex: 1,
    ':before': {
      content: "''",
      pointerEvents: 'none',
      position: 'absolute',
      [variant]: 0,
      top: makeSize(GRADIENT_OFFSET),
      bottom: makeSize(GRADIENT_OFFSET),
      width: makeSize(GRADIENT_WIDTH),
      background: `linear-gradient(to ${variant}, transparent 0%, ${color} 30%, ${color} 100%);`,
    },
  };
});

const TabNav = ({
  children,
  ...styledProps
}: TabNavProps & StyledPropsBlade): React.ReactElement => {
  const ref = React.useRef<HTMLDivElement>(null);
  const hasOverflow = useHasOverflow(ref);
  const [scrollStatus, setScrollStatus] = React.useState<'start' | 'end' | 'middle'>('start');
  const { backgroundColor } = useTopNavContext();

  // Check if the scroll is at start, end or middle
  const handleScrollStatus = React.useCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
      const target = e.target as HTMLDivElement;
      const isAtStart = target.scrollLeft === 0;
      const isAtEnd = approximatelyEqual(
        target.scrollLeft,
        target.scrollWidth - target.offsetWidth,
      );

      if (isAtStart) {
        setScrollStatus('start');
      } else if (isAtEnd) {
        setScrollStatus('end');
      } else {
        setScrollStatus('middle');
      }
    },
    [],
  );

  const scrollRight = (): void => {
    if (!ref.current) return;
    ref.current.scrollBy({
      behavior: 'smooth',
      left: SCROLL_AMOUNT,
    });
  };

  const scrollLeft = (): void => {
    if (!ref.current) return;
    ref.current.scrollBy({
      behavior: 'smooth',
      left: -SCROLL_AMOUNT,
    });
  };

  return (
    <TabNavContext.Provider value={{ containerRef: ref, hasOverflow }}>
      <BaseBox
        as="nav"
        display="flex"
        width="100%"
        alignItems="center"
        position="relative"
        marginBottom={makeSize(OFFSET_BOTTOM)}
        {...getStyledProps(styledProps)}
        {...metaAttribute({ name: MetaConstants.TabNav })}
      >
        <GradientOverlay
          variant="left"
          $color={backgroundColor}
          shouldShow={hasOverflow && scrollStatus !== 'start'}
        >
          <Button
            size="xsmall"
            variant="tertiary"
            icon={ChevronLeftIcon}
            accessibilityLabel="Scroll Left"
            onClick={scrollLeft}
          />
        </GradientOverlay>
        <ScrollableArea
          ref={ref}
          onScroll={handleScrollStatus}
          display="flex"
          width="100%"
          position="relative"
          whiteSpace="nowrap"
          gap="spacing.0"
          overflowY="hidden"
          overflowX="auto"
        >
          <BaseBox display="flex" flexDirection="row" width="max-content">
            {React.Children.map(children, (child, index) => {
              return (
                <>
                  {index > 0 ? (
                    <Divider
                      margin="auto"
                      variant="muted"
                      orientation="vertical"
                      height={makeSize(size[16])}
                    />
                  ) : null}
                  {child}
                </>
              );
            })}
          </BaseBox>
        </ScrollableArea>
        <GradientOverlay
          variant="right"
          $color={backgroundColor}
          shouldShow={hasOverflow && scrollStatus !== 'end'}
        >
          <Button
            size="xsmall"
            variant="tertiary"
            icon={ChevronRightIcon}
            accessibilityLabel="Scroll Right"
            onClick={scrollRight}
          />
        </GradientOverlay>
      </BaseBox>
    </TabNavContext.Provider>
  );
};

export { TabNav };
