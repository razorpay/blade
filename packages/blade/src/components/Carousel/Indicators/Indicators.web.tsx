import { useCarouselContext } from '../CarouselContext';
import { IndicatorButton } from './IndicatorButton';
import { CircularIndicatorButton } from './CircularIndicatorButton';
import type { IndicatorsProps } from './types';
import { makeAccessible } from '~utils/makeAccessible';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';

const Indicators = (props: IndicatorsProps): React.ReactElement => {
  const { carouselId, isResponsive, visibleItems, isAutoPlaying } = useCarouselContext();
  const { platform } = useTheme();
  const isMobile = platform === 'onMobile';

  const ButtonComponent = isMobile ? CircularIndicatorButton : IndicatorButton;

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      gap="spacing.2"
      {...makeAccessible({ role: 'tablist', label: 'Slides' })}
    >
      {new Array(props.totalItems).fill(0).map((_, idx) => {
        let _visibleItems = visibleItems!;
        if (isResponsive) {
          _visibleItems = 1;
        }

        return (
          <ButtonComponent
            key={idx}
            {...makeAccessible({
              role: 'tab',
              label: `Slide ${idx * _visibleItems + 1}`,
              selected: idx === props.activeIndex,
              controls: `${carouselId}-carousel-item-${idx * _visibleItems}`,
            })}
            slideIndex={idx * _visibleItems}
            isActive={idx === props.activeIndex}
            onClick={() => props?.onClick?.(idx)}
            variant={props.variant}
            isAutoPlaying={isAutoPlaying}
          />
        );
      })}
    </BaseBox>
  );
};

export { Indicators };
