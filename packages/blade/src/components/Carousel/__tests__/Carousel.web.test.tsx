/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/require-await */
import { fireEvent, act } from '@testing-library/react';
import { Carousel } from '../Carousel';
import { CarouselItem } from '../CarouselItem';
import { useCarouselContext } from '../CarouselContext';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const TestimonialCard = ({ index }: { index: number }): React.ReactElement => {
  const { activeSlide } = useCarouselContext();
  return (
    <div>
      <p>{index}</p>
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
    writable: true,
    value: jest.fn(),
  });

  Object.defineProperty(window.Element.prototype, 'getBoundingClientRect', {
    writable: true,
    value: jest.fn(() => ({ width: 100, left: 0 })),
  });
});

describe('<Carousel />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(
      <Carousel carouselItemWidth="100px">
        <CarouselItem>
          <TestimonialCard index={0} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
      </Carousel>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should go to next/previous slide', () => {
    const onChange = jest.fn();
    const { getByRole, queryAllByRole, queryAllByTestId } = renderWithTheme(
      <Carousel visibleItems={1} carouselItemWidth="100px" onChange={onChange}>
        <CarouselItem>
          <TestimonialCard index={0} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
      </Carousel>,
    );
    expect(queryAllByTestId('active-slide')[0]).toHaveTextContent('0');

    const nextButton = getByRole('button', { name: 'Next Slide' });
    const previousButton = getByRole('button', { name: 'Previous Slide' });
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(nextButton).toBeInTheDocument();
    expect(previousButton).toBeInTheDocument();

    expect(onChange).toHaveBeenLastCalledWith(2);

    fireEvent.click(previousButton);
    fireEvent.click(previousButton);

    expect(onChange).toHaveBeenLastCalledWith(0);

    expect(queryAllByRole('tab').length).toBe(4);
  });

  it('should go to specific slide when clicking on indicator button', () => {
    const onChange = jest.fn();
    const { getByRole, queryAllByTestId } = renderWithTheme(
      <Carousel visibleItems={1} onChange={onChange}>
        <CarouselItem>
          <TestimonialCard index={0} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
      </Carousel>,
    );
    expect(queryAllByTestId('active-slide')[0]).toHaveTextContent('0');

    const indicatorButton = getByRole('tab', { name: 'Slide 3' });
    fireEvent.click(indicatorButton);

    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('should wrap around when reaching start or end slide', () => {
    const onChange = jest.fn();
    const { getByRole, queryAllByTestId } = renderWithTheme(
      <Carousel visibleItems={1} onChange={onChange}>
        <CarouselItem>
          <TestimonialCard index={0} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
      </Carousel>,
    );
    expect(queryAllByTestId('active-slide')[0]).toHaveTextContent('0');

    const nextButton = getByRole('button', { name: 'Next Slide' });
    const previousButton = getByRole('button', { name: 'Previous Slide' });
    fireEvent.click(previousButton);

    expect(onChange).toHaveBeenLastCalledWith(3);

    fireEvent.click(nextButton);
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('should work with visibleItems prop', () => {
    const onChange = jest.fn();
    const { getByRole, queryAllByRole, queryAllByTestId } = renderWithTheme(
      <Carousel visibleItems={2} onChange={onChange}>
        <CarouselItem>
          <TestimonialCard index={0} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={2} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={3} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={4} />
        </CarouselItem>
      </Carousel>,
    );
    expect(queryAllByTestId('active-slide')[0]).toHaveTextContent('0');

    const nextButton = getByRole('button', { name: 'Next Slide' });
    const previousButton = getByRole('button', { name: 'Previous Slide' });
    fireEvent.click(nextButton);

    expect(onChange).toHaveBeenLastCalledWith(1);

    fireEvent.click(previousButton);

    expect(onChange).toHaveBeenLastCalledWith(0);

    // assert indicator button count
    expect(queryAllByRole('tab').length).toBe(3);
  });

  it('should auto play', async () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    const { queryAllByTestId } = renderWithTheme(
      <Carousel autoPlay visibleItems={1} onChange={onChange}>
        <CarouselItem>
          <TestimonialCard index={0} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
      </Carousel>,
    );
    expect(queryAllByTestId('active-slide')[0]).toHaveTextContent('0');

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(1);

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(2);

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('should not auto play when mouse is over', async () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    const { getByLabelText, queryAllByTestId } = renderWithTheme(
      <Carousel accessibilityLabel="My Carousel" autoPlay visibleItems={1} onChange={onChange}>
        <CarouselItem>
          <TestimonialCard index={0} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
      </Carousel>,
    );
    expect(queryAllByTestId('active-slide')[0]).toHaveTextContent('0');

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(1);

    // hover over carousel
    fireEvent.mouseEnter(getByLabelText('My Carousel'));

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(1);

    // hover out of carousel
    fireEvent.mouseLeave(getByLabelText('My Carousel'));

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('should not auto play when focus is inside carousel', async () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <Carousel accessibilityLabel="My Carousel" autoPlay visibleItems={1} onChange={onChange}>
        <CarouselItem>
          <button type="button">Button 1</button>
        </CarouselItem>
        <CarouselItem>
          <button type="button">Button 2</button>
        </CarouselItem>
        <CarouselItem>
          <button type="button">Button 3</button>
        </CarouselItem>
      </Carousel>,
    );

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(1);

    // hover over carousel
    fireEvent.focusIn(getByLabelText('My Carousel'));

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(1);

    // hover out of carousel
    fireEvent.focusOut(getByLabelText('My Carousel'));

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  test('when visibleItems:undefined & navigationButtonPosition:side then next / previous buttons should be removed on reaching start/end slide', () => {
    const onChange = jest.fn();
    const { queryByRole, queryAllByTestId } = renderWithTheme(
      <Carousel onChange={onChange} navigationButtonPosition="side">
        <CarouselItem>
          <TestimonialCard index={0} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={1} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={2} />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard index={3} />
        </CarouselItem>
      </Carousel>,
    );
    expect(queryAllByTestId('active-slide')[0]).toHaveTextContent('0');

    const nextButton = queryByRole('button', { name: 'Next Slide' });

    expect(queryByRole('button', { name: 'Next Slide' })).toBeInTheDocument();
    expect(queryByRole('button', { name: 'Previous Slide' })).not.toBeInTheDocument();

    fireEvent.click(nextButton!);

    expect(onChange).toHaveBeenLastCalledWith(1);

    fireEvent.click(nextButton!);
    fireEvent.click(nextButton!);

    expect(onChange).toHaveBeenLastCalledWith(3);

    expect(queryByRole('button', { name: 'Next Slide' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Previous Slide' })).toBeInTheDocument();
  });
});
