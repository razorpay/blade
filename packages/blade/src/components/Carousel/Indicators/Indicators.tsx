import { useCarouselContext } from '../CarouselContext';
import { IndicatorButton } from './IndicatorButton';
import type { IndicatorsProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeAccessible } from '~utils/makeAccessible';

const Indicators = (props: IndicatorsProps): React.ReactElement => {
  const { carouselId, visibleItems } = useCarouselContext();
  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      {...makeAccessible({ role: 'tablist', label: 'Slides' })}
    >
      {new Array(props.totalItems).fill(0).map((_, idx) => {
        const slideIndex = idx * (visibleItems ?? 1);
        return (
          <IndicatorButton
            key={idx}
            {...makeAccessible({
              role: 'tab',
              label: `Slide ${slideIndex + 1}`,
              selected: idx === props.activeIndex,
              controls: `${carouselId}-carousel-item-${slideIndex}`,
            })}
            slideIndex={slideIndex}
            marginLeft={idx !== 0 ? 'spacing.2' : 'spacing.0'}
            isActive={idx === props.activeIndex}
            onClick={() => props?.onIndicatorButtonClick?.(idx)}
            variant={props.variant}
          />
        );
      })}
    </BaseBox>
  );
};

export { Indicators };
