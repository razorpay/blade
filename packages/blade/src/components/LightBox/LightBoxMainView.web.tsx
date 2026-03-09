import React from 'react';
import styled from 'styled-components';
import type { LightBoxItemProps } from './types';
import { Box } from '~components/Box';
import { BaseBox } from '~components/Box/BaseBox';
import { Carousel, CarouselItem } from '~components/Carousel';

type LightBoxMainViewProps = {
  items: LightBoxItemProps[];
  activeIndex: number;
  onChange: (index: number) => void;
};

const LIGHTBOX_MAX_WIDTH = { base: '100%', m: '680px' } as const;
const LIGHTBOX_MAX_HEIGHT = { base: '60vh', m: '480px' } as const;

type LightBoxContentWrapperProps = {
  children: React.ReactNode;
};

const LightBoxContentWrapper = ({ children }: LightBoxContentWrapperProps): React.ReactElement => (
  <BaseBox
    width={LIGHTBOX_MAX_WIDTH}
    height={LIGHTBOX_MAX_HEIGHT}
    justifyContent="center"
    alignItems="center"
    display="flex"
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </BaseBox>
);

const StyledMainImage = styled.img({
  display: 'block',
  width: 'auto',
  height: 'auto',
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

const LightBoxMainView = ({
  items,
  activeIndex,
  onChange,
}: LightBoxMainViewProps): React.ReactElement => (
  <Box overflow="hidden" height="100%" display="flex" alignItems="center">
    <Carousel
      activeSlide={activeIndex}
      onChange={onChange}
      visibleItems={1}
      shouldAddStartEndSpacing={false}
      navigationButtonPosition="side"
      showNavigationButtons={false}
      showIndicators={false}
      width="100%"
      carouselItemWidth="100%"
      carouselItemAlignment="center"
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
              <LightBoxContentWrapper>
                <StyledMainImage src={item.src} alt={item.alt ?? `Item ${i + 1}`} />
              </LightBoxContentWrapper>
            ) : (
              <LightBoxContentWrapper>{item.children}</LightBoxContentWrapper>
            )}
          </BaseBox>
        </CarouselItem>
      ))}
    </Carousel>
  </Box>
);

export { LightBoxMainView };
