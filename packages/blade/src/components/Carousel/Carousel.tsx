import { Indicators } from './Indicators/Indicators';
import { NavigationButton } from './NavigationButton';
import { Box } from '~components/Box';

type CarouselProps = {
  children: React.ReactNode;
};

const Carousel = (): React.ReactElement => {
  return (
    <Box display="flex" alignItems="center" gap="spacing.2">
      <NavigationButton type="previous" variant="filled" />
      <Indicators
        onIndicatorButtonClick={(index) => alert(index)}
        activeIndex={1}
        totalItems={5}
        variant="blue"
      />
      <NavigationButton type="next" variant="filled" />
    </Box>
  );
};

export { Carousel, CarouselProps };
