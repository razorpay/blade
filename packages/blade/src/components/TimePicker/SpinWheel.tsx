import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { useIsMobile } from '~utils/useIsMobile';

type SpinWheelProps = {
  values: (string | number)[];
  selectedValue: string | number;
  onValueChange: (value: string | number, index: number) => void;
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  label?: string;
  width?: string;
};

// Styled scroll container with scroll snap
const StyledScrollContainer = styled(BaseBox)`
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

// Styled scroll item with scroll snap
const StyledScrollItem = styled(BaseBox)`
  scroll-snap-align: center;
  scroll-snap-stop: always;
`;

/**
 * Reusable SpinWheel component for time selection
 *
 * Creates a scrollable column of values where the center item is selected.
 * Similar to iOS time picker wheels.
 */
const SpinWheel = ({
  values,
  selectedValue,
  onValueChange,
  activeIndex,
  onActiveIndexChange,
}: SpinWheelProps): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  // Auto-scroll to selected item when dropdown opens or value changes
  useEffect(() => {
    const selectedIndex = values.findIndex((val) => String(val) === String(selectedValue));
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedValue, values]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Scroll event handler to update selection based on center position
  const handleScroll = () => {
    if (!containerRef.current || !itemRefs.current.length) return;

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
    }, 150); // 150ms delay after scroll stops
  };

  const handleItemClick = (value: string | number, index: number) => {
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
      {/* Selection indicator */}
      <BaseBox position="relative" width="100%" overflow="hidden">
        {/* Center highlight area */}
        <BaseBox
          position="absolute"
          top="50%"
          left="spacing.0"
          right="spacing.0"
          height="36px"
          transform="translateY(-50%)"
          backgroundColor="interactive.background.gray.faded"
          pointerEvents="none"
          zIndex={1}
        />

        {/* Scrollable container */}
        <StyledScrollContainer
          ref={containerRef as any}
          height="100%"
          overflowY="auto"
          onScroll={handleScroll}
          role="listbox"
        >
          {/* Invisible spacer at top - allows first item to scroll to center */}
          <BaseBox height="120px" flexShrink={0} />

          {values.map((value, index) => {
            const isSelected = activeIndex === index || String(value) === String(selectedValue);

            return (
              <StyledScrollItem
                key={`${value}-${index}`}
                ref={(el) => (itemRefs.current[index] = el as any)}
                height="34px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => handleItemClick(value, index)}
                style={{ cursor: 'pointer' }}
              >
                <Text
                  variant="body"
                  size={isSelected ? 'large' : 'medium'}
                  weight={isSelected ? 'semibold' : 'regular'}
                  color={
                    isSelected ? 'interactive.text.gray.normal' : 'interactive.text.gray.muted'
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
export type { SpinWheelProps };
