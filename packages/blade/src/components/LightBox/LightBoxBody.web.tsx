import React from 'react';
import type { LightBoxBodyProps, LightBoxItemProps } from './types';
import { useLightBoxContext } from './LightBoxContext';
import { LightBoxItem } from './LightBoxItem';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Carousel, CarouselItem } from '~components/Carousel';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { BaseBox } from '~components/Box/BaseBox';

type ExtractedItem = {
  src?: string;
  thumbnailSrc: string;
  alt?: string;
  children?: React.ReactNode;
};

type LightBoxMainViewProps = {
  items: ExtractedItem[];
  activeIndex: number;
  onChange: (index: number) => void;
};

const LIGHTBOX_MAX_WIDTH = { base: '100%', m: '680px' } as const;
const LIGHTBOX_MAX_HEIGHT = { base: '60vh', m: '480px' } as const;

const LightBoxMainView = ({
  items,
  activeIndex,
  onChange,
}: LightBoxMainViewProps): React.ReactElement => (
  <Box
    overflow="hidden"
    height="100%"
    display={{ base: 'flex', m: 'block' }}
    justifyContent="center"
    alignItems="center"
    paddingTop={{ base: 'spacing.0', m: 'spacing.11' }}
  >
    <Carousel
      activeSlide={activeIndex}
      onChange={onChange}
      visibleItems={1}
      shouldAddStartEndSpacing={false}
      navigationButtonPosition="side"
      showNavigationButtons={false}
      showIndicators={false}
      carouselItemWidth="100%"
      carouselItemAlignment="center"
      accessibilityLabel="Media viewer carousel"
    >
      {items.map((item, i) => (
        <CarouselItem key={i}>
          <BaseBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={{ base: 'spacing.0', m: 'spacing.5' }}
          >
            {item.src ? (
              <BaseBox
                width={LIGHTBOX_MAX_WIDTH}
                height={LIGHTBOX_MAX_HEIGHT}
                justifyContent="center"
                display="flex"
              >
                <img
                  src={item.src}
                  alt={item.alt ?? `Item ${i + 1}`}
                  style={{
                    display: 'block',
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </BaseBox>
            ) : (
              <BaseBox
                width={LIGHTBOX_MAX_WIDTH}
                height={LIGHTBOX_MAX_HEIGHT}
                justifyContent="center"
                alignItems="center"
                display="flex"
                onClick={(e) => e.stopPropagation()}
              >
                {item.children}
              </BaseBox>
            )}
          </BaseBox>
        </CarouselItem>
      ))}
    </Carousel>
  </Box>
);

type LightBoxThumbnailStripProps = {
  items: ExtractedItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const LightBoxThumbnailStrip = ({
  items,
  activeIndex,
  onSelect,
}: LightBoxThumbnailStripProps): React.ReactElement => (
  <Box
    display="flex"
    flexDirection="row"
    gap="spacing.5"
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
        padding="spacing.0"
        accessibilityLabel={item.alt ?? `Item ${i + 1}`}
        width="80px"
        height="60px"
      >
        <CardBody height="100%">
          <Box overflow="hidden" borderRadius="medium" width="100%" height="100%">
            <img
              src={item.thumbnailSrc}
              alt={item.alt ?? `Thumbnail ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Box>
        </CardBody>
      </Card>
    ))}
  </Box>
);

const _LightBoxBody = ({ children }: LightBoxBodyProps): React.ReactElement => {
  const { activeIndex, handleIndexChange } = useLightBoxContext();

  const items: ExtractedItem[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === LightBoxItem) {
      const {
        src,
        thumbnailSrc,
        alt,
        children: itemChildren,
      } = child.props as LightBoxItemProps & { children?: React.ReactNode };
      items.push({
        src,
        thumbnailSrc: thumbnailSrc ?? src ?? '',
        alt,
        children: itemChildren,
      });
    }
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      overflow="hidden"
      justifyContent="space-between"
      height="100%"
    >
      <LightBoxMainView items={items} activeIndex={activeIndex} onChange={handleIndexChange} />
      <LightBoxThumbnailStrip
        items={items}
        activeIndex={activeIndex}
        onSelect={handleIndexChange}
      />
    </Box>
  );
};

const LightBoxBody = assignWithoutSideEffects(_LightBoxBody, {
  displayName: 'LightBoxBody',
});

export { LightBoxBody };
