import { NavigationButton } from './NavigationButton';

type CarouselProps = {
  children: React.ReactNode;
};

const Carousel = (): React.ReactElement => {
  return (
    <>
      <NavigationButton type="previous" variant="filled" />
      <NavigationButton type="next" variant="stroke" />
    </>
  );
};

export { Carousel, CarouselProps };
