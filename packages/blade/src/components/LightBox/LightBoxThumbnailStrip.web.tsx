import React from 'react';
import styled from 'styled-components';
import type { LightBoxItemProps } from './types';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils/platform/castUtils';
import { useTheme } from '~components/BladeProvider';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';

type LightBoxThumbnailStripProps = {
  items: LightBoxItemProps[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const StyledThumbnailImage = styled.img({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

const LightBoxThumbnailStrip = ({
  items,
  activeIndex,
  onSelect,
}: LightBoxThumbnailStripProps): React.ReactElement => {
  const { theme } = useTheme();
  const thumbnailOpacityTransition = `opacity ${makeMotionTime(
    theme.motion.duration.quick,
  )} ${castWebType(theme.motion.easing.standard)}`;

  return (
    <Box
      display="flex"
      flexDirection="row"
      gap="spacing.3"
      overflowX="auto"
      padding="spacing.3"
      justifyContent="center"
      flexShrink="0"
    >
      {items.map((item, i) => (
        <Card
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(i);
          }}
          isSelected={i === activeIndex}
          opacity={i === activeIndex ? 1 : 0.7}
          transition={thumbnailOpacityTransition}
          padding="spacing.0"
          accessibilityLabel={item.alt ?? `Item ${i + 1}`}
          width="80px"
          height="80px"
          flexShrink="0"
        >
          <CardBody height="100%">
            <Box overflow="hidden" borderRadius="medium" width="100%" height="100%">
              <StyledThumbnailImage src={item.thumbnail} alt={item.alt ?? `Thumbnail ${i + 1}`} />
            </Box>
          </CardBody>
        </Card>
      ))}
    </Box>
  );
};

export { LightBoxThumbnailStrip };
