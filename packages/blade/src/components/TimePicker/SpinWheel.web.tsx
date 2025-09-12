import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { SpinWheelProps } from './types';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { useIsMobile } from '~utils/useIsMobile';

// Styled scroll container with scroll snap
const StyledScrollContainer = styled(BaseBox)`
  scroll-snap-type: y proximity; /* Changed from mandatory to proximity for smoother scrolling */
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

// Styled scroll item with scroll snap
const StyledScrollItem = styled(BaseBox)`
  scroll-snap-align: center;
  /* Removed scroll-snap-stop: always for smoother interaction */
`;

/**
 * Reusable SpinWheel component for time selection
 * Creates a scrollable column of values where the center item is selected.
 */
const SpinWheel = ({
  values,
  selectedValue,
  onValueChange,
  activeIndex,
  onActiveIndexChange,
  displayValue,
  scrollContainerRef,
  tabIndex,
}: SpinWheelProps): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  // Flag to prevent onValueChange from being triggered during auto-positioning
  // Problem: When minuteStep > 1 and user types "03", we auto-position to nearest step "00"
  // This programmatic scroll triggers handleScroll -> onValueChange -> changes value from "03" to "00"
  // But we want to preserve the typed value "03" and only visually position at "00"
  // Solution: Set this flag during programmatic scrolls to prevent onValueChange calls
  // preserving user's typed value while showing correct visual positioning
  const isProgrammaticScroll = useRef(false);

  // Use displayValue for visual positioning, selectedValue for actual data
  // This supports minute steps: user types "03", displayValue shows "00" for positioning,
  // but selectedValue preserves "03" for form submission
  const positioningValue = displayValue ?? selectedValue;

  // Auto-scroll to positioned item when dropdown opens or positioning value changes
  useEffect(() => {
    const positionIndex = values.findIndex((val) => String(val) === String(positioningValue));
    if (positionIndex >= 0 && itemRefs.current[positionIndex]) {
      isProgrammaticScroll.current = true;

      itemRefs.current[positionIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Reset flag after scroll finishes
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 300);
    }
  }, [positioningValue, values]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Scroll event handler to update selection based on center position
  const handleScroll = (): void => {
    if (isProgrammaticScroll.current || !containerRef.current || !itemRefs.current.length) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    // Only check actual value items (not padding items)
    values.forEach((_, index) => {
      const item = itemRefs.current[index];
      if (item) {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const distance = Math.abs(containerCenter - itemCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    // Update active index immediately for visual feedback
    onActiveIndexChange?.(closestIndex);

    // Debounce the actual value change to avoid jerky scrolling
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      onValueChange(values[closestIndex], closestIndex);
    }, 150);
  };

  const handleItemClick = (value: string | number, index: number): void => {
    // Always allow explicit user selection via click, even when displayValue is present
    // This lets users choose to override their typed value with a step value if desired
    onValueChange(value, index);
    onActiveIndexChange?.(index);
  };

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={isMobile ? '82px' : '66px'}
      height="172px"
    >
      <BaseBox position="relative" width="100%" overflow="hidden">
        {/* Scrollable container */}
        <StyledScrollContainer
          ref={(node: HTMLDivElement | null) => {
            containerRef.current = node;
            if (typeof scrollContainerRef === 'function') {
              scrollContainerRef(node);
            } else if (scrollContainerRef && 'current' in scrollContainerRef) {
              (scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }
          }}
          height="100%"
          overflowY="auto"
          onScroll={handleScroll}
          tabIndex={typeof tabIndex === 'number' ? tabIndex : undefined}
        >
          {/* Invisible spacer at top - allows first item to scroll to center */}
          <BaseBox height="120px" flexShrink={0} />

          {values.map((value, index) => {
            // Show visual selection based on positioning value (for smooth minute steps)
            // but preserve actual selectedValue for form data integrity
            const isVisuallySelected =
              activeIndex === index || String(value) === String(positioningValue);

            return (
              <StyledScrollItem
                key={`${value}-${index}`}
                ref={(el) => (itemRefs.current[index] = el)}
                height="34px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => handleItemClick(value, index)}
                style={{ cursor: 'pointer' }}
              >
                <Text
                  variant="body"
                  size={isVisuallySelected ? 'large' : 'medium'}
                  weight={isVisuallySelected ? 'semibold' : 'regular'}
                  color={
                    isVisuallySelected
                      ? 'interactive.text.gray.normal'
                      : 'interactive.text.gray.muted'
                  }
                  textAlign="center"
                >
                  {String(value).padStart(2, '0')}
                </Text>
              </StyledScrollItem>
            );
          })}

          {/* Invisible spacer at bottom - allows last item to scroll to center */}
          <BaseBox height="120px" flexShrink={0} />
        </StyledScrollContainer>
      </BaseBox>
    </BaseBox>
  );
};

export { SpinWheel };
