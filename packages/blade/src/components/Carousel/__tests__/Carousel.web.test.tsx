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

  test('carouselItemAlignment="stretch" should set height:auto (no min-height) so flexbox stretch works', () => {
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

    slides.forEach((slide) => {
      const computedStyle = window.getComputedStyle(slide);
      expect(computedStyle.height).toBe('auto');
      expect(computedStyle.minHeight).not.toBe('100%');
    });
  });

  test('default carouselItemAlignment should preserve height:100% and min-height:100% on slides', () => {
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

    slides.forEach((slide) => {
      const computedStyle = window.getComputedStyle(slide);
      expect(computedStyle.height).toBe('100%');
      expect(computedStyle.minHeight).toBe('100%');
    });
  });

  test('when showIndicators=false and showNavigationButtons=false on mobile, no controls container should be rendered', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query.includes('max-width') && parseInt(query.match(/\d+/)?.[0] || '0', 10) >= 320,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    const { container } = renderWithTheme(
      <Carousel showIndicators={false} showNavigationButtons={false}>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    const navButtons = container.querySelectorAll('[data-blade-component="NavigationButton"]');
    expect(navButtons.length).toBe(0);

    const indicators = container.querySelectorAll(
      '[data-blade-component="carousel-indicator-button"]',
    );
    expect(indicators.length).toBe(0);

    const controlsBoxes = container.querySelectorAll('[data-blade-component="box"]');
    controlsBoxes.forEach((box) => {
      const computedStyle = window.getComputedStyle(box);
      expect(computedStyle.marginTop).not.toBe('24px');
    });

    window.matchMedia = originalMatchMedia;
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
