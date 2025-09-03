import React, { useRef, useEffect } from 'react';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';

type SpinWheelProps = {
  values: (string | number)[];
  selectedValue: string | number;
  onValueChange: (value: string | number, index: number) => void;
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  label?: string;
  width?: string;
};

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
  label,
  width = '60px',
}: SpinWheelProps): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Scroll event handler to update selection based on center position
  const handleScroll = () => {
    if (!containerRef.current || !itemRefs.current.length) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

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

    // Update active index and trigger value change
    onActiveIndexChange?.(closestIndex);
  };

  const handleItemClick = (value: string | number, index: number) => {
    onValueChange(value, index);
    onActiveIndexChange?.(index);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width={width}>
      {label && (
        <Text size="small" weight="medium" color="surface.text.gray.muted" marginBottom="spacing.2">
          {label}
        </Text>
      )}

      {/* Selection indicator */}
      <BaseBox
        position="relative"
        width="100%"
        height="200px"
        overflow="hidden"
        borderRadius="medium"
        backgroundColor="surface.background.gray.subtle"
      >
        {/* Center highlight area */}
        <BaseBox
          position="absolute"
          top="50%"
          left="spacing.0"
          right="spacing.0"
          height="40px"
          transform="translateY(-50%)"
          backgroundColor="surface.background.primary.subtle"
          borderColor="surface.border.primary.muted"
          borderWidth="thin"
          borderStyle="solid"
          borderRadius="small"
          pointerEvents="none"
          zIndex={1}
        />

        {/* Scrollable container */}
        <BaseBox
          ref={containerRef as any}
          height="100%"
          overflowY="auto"
          paddingY="spacing.10" // Extra padding for smooth scrolling
          onScroll={handleScroll}
          role="listbox"
          css={{
            scrollSnapType: 'y mandatory',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
        >
          {values.map((value, index) => {
            const isSelected = activeIndex === index || String(value) === String(selectedValue);

            return (
              <BaseBox
                key={`${value}-${index}`}
                ref={(el) => (itemRefs.current[index] = el as any)}
                height="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => handleItemClick(value, index)}
                css={{
                  scrollSnapAlign: 'center',
                  scrollSnapStop: 'always',
                  cursor: 'pointer',
                }}
              >
                <Text
                  size="medium"
                  weight={isSelected ? 'semibold' : 'regular'}
                  color={isSelected ? 'surface.text.gray.normal' : 'surface.text.gray.muted'}
                  textAlign="center"
                >
                  {String(value).padStart(2, '0')}
                </Text>
              </BaseBox>
            );
          })}
        </BaseBox>
      </BaseBox>
    </Box>
  );
};

export { SpinWheel };
export type { SpinWheelProps };
