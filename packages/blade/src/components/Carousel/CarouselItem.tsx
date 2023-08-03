/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import React from 'react';
import type { CarouselProps } from './types';
import { useCarouselContext } from './CarouselContext';
import BaseBox from '~components/Box/BaseBox';
import { useBreakpoint, useTheme } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';

// 1 slide
// start - scrollSnapAlign:start & double padding
// end - scrollSnapAlign:end & double padding
// center - scrollSnapAlign:center & double padding

// 2 slides
// start - scrollMarginRight & scrollSnapAlign:start
// end - scrollMarginLeft & scrollSnapAlign:end
// center - scrollMargin & scrollSnapAlign:start

// 3 slides
// start - no scrollMargin & scrollSnapAlign:start & half padding
// end - no scrollMargin & scrollSnapAlign:start & half padding
// center - no scrollMargin & scrollSnapAlign:start & half padding

type StyledCarouselItemProps = Pick<CarouselProps, 'visibleItems'> &
  Pick<CarouselItemProps, 'shouldHaveEndSpacing' | 'shouldHaveStartSpacing'> & {
    isMobile?: boolean;
  };

const StyledCarouselItem = styled(BaseBox)<StyledCarouselItemProps>(
  ({ visibleItems, shouldHaveStartSpacing, shouldHaveEndSpacing, theme }) => {
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isMobile = matchedDeviceType === 'mobile';
    const isResponsive = visibleItems === undefined;

    const gap = isMobile ? theme.spacing[4] : theme.spacing[5];
    const calculatedWidth = `calc(100% / ${visibleItems!} - ${gap}px * (${visibleItems} - 1) / ${visibleItems})`;

    return {
      flexGrow: 0,
      flexShrink: 0,
      width: calculatedWidth,
      minHeight: '100%',
      scrollSnapAlign: 'start',

      // Responsive slider styles, a special case
      ...(isResponsive && {
        width: '100%',
        scrollSnapAlign: 'center',
        // maxWidth: '500px', // user needs to set this
        marginLeft: shouldHaveStartSpacing ? '100%' : 0,
        marginRight: shouldHaveEndSpacing ? '100%' : 0,
      }),
    };
  },
);

type CarouselItemProps = {
  id?: string;
  index?: number;
  children: React.ReactNode;
  shouldHaveStartSpacing?: boolean;
  shouldHaveEndSpacing?: boolean;
};

function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  { threshold = 0, root = null, rootMargin = '0%' }: IntersectionObserverInit,
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>();

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  React.useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef?.current, JSON.stringify(threshold), root, rootMargin]);

  return entry;
}

const CarouselItem = ({
  children,
  shouldHaveStartSpacing,
  shouldHaveEndSpacing,
  id,
  index,
}: CarouselItemProps): React.ReactElement => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const {
    totalNumberOfSlides,
    visibleItems,
    carouselItemWidth,
    carouselContainerRef,
    setActiveIndicator,
  } = useCarouselContext();
  const { platform } = useTheme();
  const isMobile = platform === 'onMobile';

  const entry = useIntersectionObserver(itemRef, {
    root: carouselContainerRef!.current!,
    threshold: 0.99,
  });

  React.useEffect(() => {
    if (entry?.isIntersecting) {
      const slideIndex = Number(entry?.target.getAttribute('data-slide-index'));
      setActiveIndicator(Math.floor((slideIndex ?? 1) / (visibleItems ?? 1)));
    }
  }, [entry?.isIntersecting, entry?.target, setActiveIndicator, visibleItems]);

  return (
    <StyledCarouselItem
      {...makeAccessible({
        role: 'tabpanel',
        roleDescription: 'slide',
        label: `${index} of ${totalNumberOfSlides}`,
      })}
      ref={itemRef}
      id={id}
      isMobile={isMobile}
      data-slide-index={index}
      visibleItems={visibleItems}
      maxWidth={carouselItemWidth}
      shouldHaveStartSpacing={shouldHaveStartSpacing}
      shouldHaveEndSpacing={shouldHaveEndSpacing}
    >
      {children}
    </StyledCarouselItem>
  );
};

export { CarouselItem };
