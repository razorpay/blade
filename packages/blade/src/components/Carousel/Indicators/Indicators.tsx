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
        const isResponsive = visibleItems === 'autofit';
        let _visibleItems = visibleItems as 1 | 2 | 3;
        if (isResponsive) {
          _visibleItems = 1;
        }

        return (
          <IndicatorButton
            key={idx}
            {...makeAccessible({
              role: 'tab',
              label: `Slide ${idx * _visibleItems + 1}`,
              selected: idx === props.activeIndex,
              controls: `${carouselId}-carousel-item-${idx * _visibleItems}`,
            })}
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
