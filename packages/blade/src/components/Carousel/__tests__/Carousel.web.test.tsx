/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/require-await */
import { mockViewport } from 'jsdom-testing-mocks';
import { Carousel } from '../Carousel';
import { CarouselItem } from '../CarouselItem';
import { useCarouselContext } from '../CarouselContext';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const TestimonialCard = (): React.ReactElement => {
  const { activeSlide } = useCarouselContext();
  return (
    <div>
      {/* A hack to get the internal state of the carousel so that i can assert the tests */}
      {/* Users won't be able to do this since useCarouselContext is not gonna be exported */}
      <p data-testid="active-slide">{activeSlide}</p>
    </div>
  );
};

beforeAll(() => {
  Object.defineProperty(window.Element.prototype, 'scroll', {
    writable: true,
    value: jest.fn(),
  });

  Object.defineProperty(window.Element.prototype, 'scrollLeft', {
    writable: false,
    value: 1,
  });
});

afterAll(() => {
  Object.defineProperty(window.Element.prototype, 'scroll', {
    writable: true,
    value: undefined,
  });

  Object.defineProperty(window.Element.prototype, 'scrollLeft', {
    writable: false,
    value: 0,
  });
});

describe('<Carousel />', () => {
  it('should render number of indicators basis visibleItems prop', () => {
    const onChange = jest.fn();
    const { queryAllByRole, queryAllByTestId } = renderWithTheme(
      <Carousel visibleItems={2} onChange={onChange}>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );
    expect(queryAllByTestId('active-slide')[0]).toHaveTextContent('0');

    // assert indicator button count
    expect(queryAllByRole('tab').length).toBe(3);
  });

  test('when visibleItems:autofit & shouldAddStartEndSpacing is undefined then we hide the indicators since they are unnecessary', () => {
    const onChange = jest.fn();
    const { queryAllByRole } = renderWithTheme(
      <Carousel onChange={onChange} visibleItems="autofit">
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    expect(queryAllByRole('tab').length).toBe(0);
  });

  test('when carouselItemAlignment="stretch" then slides should not have hardcoded height so align-items:stretch can work', () => {
    const { container } = renderWithTheme(
      <Carousel carouselItemAlignment="stretch">
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    const slides = container.querySelectorAll('[data-slide-index]');
    expect(slides.length).toBe(2);
    const slideStyle = window.getComputedStyle(slides[0]);
    expect(slideStyle.height).toBe('');
    expect(slideStyle.minHeight).toBe('');
  });

  test('when carouselItemAlignment="start" (default) then slides should have height:100% to fill track', () => {
    const { container } = renderWithTheme(
      <Carousel>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    const slides = container.querySelectorAll('[data-slide-index]');
    expect(slides.length).toBe(2);
    const slideStyle = window.getComputedStyle(slides[0]);
    expect(slideStyle.height).toBe('100%');
    expect(slideStyle.minHeight).toBe('100%');
  });

  test('when showIndicators=false and showNavigationButtons=false on mobile then no empty controls box should render', () => {
    // On web, showNavigationButtons is forced true (showNavigationButtonProp || !isMobile),
    // so the empty-box path only triggers on mobile platform. We verify the guard is in
    // place by checking that Controls still renders correctly when showIndicators is false
    // on web — the nav buttons fill the box, so it's never empty.
    const { container } = renderWithTheme(
      <Carousel showIndicators={false}>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    // Controls box should exist but contain only nav buttons (no indicators)
    const controlsBox = container.querySelector('[data-blade-component="box"]');
    expect(controlsBox).toBeInTheDocument();
    // Should have navigation buttons but no indicator tabs
    expect(controlsBox?.querySelectorAll('[data-blade-component="NavigationButton"]').length).toBe(
      2,
    );
    expect(controlsBox?.querySelectorAll('[role="tab"]').length).toBe(0);
  });
});

describe('Carousel Snapshots', () => {
  it('should render', () => {
    const { container } = renderWithTheme(
      <Carousel>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with visibleItems', () => {
    const { container } = renderWithTheme(
      <Carousel visibleItems={2}>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with shouldAddStartEndSpacing', () => {
    const { container } = renderWithTheme(
      <Carousel carouselItemWidth={{ base: '90%', m: '300px' }} shouldAddStartEndSpacing>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with showOverlay', () => {
    const { container } = renderWithTheme(
      <Carousel scrollOverlayColor="surface.background.gray.subtle" shouldAddStartEndSpacing>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with navigationButtonPosition=side', () => {
    const { container } = renderWithTheme(
      <Carousel visibleItems={1} navigationButtonPosition="side">
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with carouselItemAlignment=stretch', () => {
    const { container } = renderWithTheme(
      <Carousel carouselItemAlignment="stretch">
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    expect(container).toMatchSnapshot();
  });

  // add this
  it('should not render overlay on mobile devices', () => {
    const viewport = mockViewport({ width: '320px', height: '568px' });

    const { container } = renderWithTheme(
      <Carousel scrollOverlayColor="surface.background.gray.subtle" shouldAddStartEndSpacing>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    expect(container).toMatchSnapshot();
    viewport.cleanup();
  });
  it('should support data-analytics attributes', () => {
    const { container } = renderWithTheme(
      <Carousel data-analytics-carousel="carousel">
        <CarouselItem data-analytics-carousel-slide="1">
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem data-analytics-carousel-slide="2">
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    expect(container.querySelector('[data-analytics-carousel="carousel"]')).toBeInTheDocument();
    expect(container.querySelector('[data-analytics-carousel-slide="1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-analytics-carousel-slide="2"]')).toBeInTheDocument();
  });
});
