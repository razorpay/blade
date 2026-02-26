import React from 'react';
import type { LightBoxBodyProps, LightBoxItemProps } from './types';
import { useLightBoxContext } from './LightBoxContext';
import { LightBoxItem } from './LightBoxItem';
import { Carousel, CarouselItem } from '~components/Carousel';
import { Card, CardBody } from '~components/Card';
import { Preview, PreviewBody } from '~components/Preview';
import { Box } from '~components/Box';

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

const LightBoxMainView = ({
  items,
  activeIndex,
  onChange,
}: LightBoxMainViewProps): React.ReactElement => (
  <Box flex="1" overflow="hidden" minHeight="spacing.0">
    <Carousel
      activeSlide={activeIndex}
      onChange={onChange}
      visibleItems={1}
      navigationButtonPosition="side"
      showIndicators={false}
      carouselItemWidth="100%"
      carouselItemAlignment="center"
      accessibilityLabel="Media viewer carousel"
    >
      {items.map((item, i) => (
        <CarouselItem key={i}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            padding="spacing.5"
          >
            {item.src ? (
              <Box width="fit-content" height="fit-content">
                <Preview>
                  <PreviewBody>
                    <img
                      src={item.src}
                      alt={item.alt ?? `Item ${i + 1}`}
                      style={{
                        display: 'block',
                        width: 'auto',
                        height: 'auto',
                        maxWidth: 'calc(100vw - 32px)',
                        maxHeight: '65vh',
                        objectFit: 'contain',
                      }}
                    />
                  </PreviewBody>
                </Preview>
              </Box>
            ) : (
              item.children
            )}
          </Box>
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
    gap="spacing.3"
    overflowX="auto"
    padding="spacing.3"
    justifyContent="center"
    flexShrink="0"
  >
    {items.map((item, i) => (
      <Card
        key={i}
        onClick={() => onSelect(i)}
        isSelected={i === activeIndex}
        padding="spacing.0"
        accessibilityLabel={item.alt ?? `Item ${i + 1}`}
        width="80px"
        height="60px"
      >
        <CardBody>
          <img
            src={item.thumbnailSrc}
            alt={item.alt ?? `Thumbnail ${i + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </CardBody>
      </Card>
    ))}
  </Box>
);

const LightBoxBody = ({ children }: LightBoxBodyProps): React.ReactElement => {
  const { activeIndex, handleIndexChange } = useLightBoxContext();

  const items: ExtractedItem[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === LightBoxItem) {
      const { src, thumbnailSrc, alt, children: itemChildren } =
        child.props as LightBoxItemProps & { children?: React.ReactNode };
      items.push({
        src,
        thumbnailSrc: thumbnailSrc ?? src ?? '',
        alt,
        children: itemChildren,
      });
    }
  });

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <LightBoxMainView
        items={items}
        activeIndex={activeIndex}
        onChange={handleIndexChange}
      />
      <LightBoxThumbnailStrip
        items={items}
        activeIndex={activeIndex}
        onSelect={handleIndexChange}
      />
    </Box>
  );
};

LightBoxBody.displayName = 'LightBoxBody';

export { LightBoxBody };
