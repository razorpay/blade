/* eslint-disable @typescript-eslint/require-await */
import { act, fireEvent } from '@testing-library/react-native';
import { Carousel } from '../Carousel.native';
import { CarouselItem } from '../CarouselItem.native';
import { useCarouselContext } from '../CarouselContext';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const TestimonialCard = (): React.ReactElement => {
  const { activeSlide } = useCarouselContext();
  return (
    <Box>
      {/* A hack to get the internal state of the carousel so that i can assert the tests */}
      {/* Users won't be able to do this since useCarouselContext is not gonna be exported */}
      <Text testID="active-slide">{activeSlide}</Text>
    </Box>
  );
};

describe('<Carousel />', () => {
  it('should go to next/previous slide', () => {
    const onChange = jest.fn();
    const { queryAllByTestId, queryAllByRole, getByA11yState } = renderWithTheme(
      <Carousel onChange={onChange}>
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
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 0);

    const [previousButton, nextButton] = queryAllByRole('button');

    expect(previousButton.props.accessibilityLabel).toBe('Previous Slide');
    expect(nextButton.props.accessibilityLabel).toBe('Next Slide');

    fireEvent.press(nextButton);
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 1);

    fireEvent.press(nextButton);
    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 2);

    fireEvent.press(previousButton);
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 1);

    fireEvent.press(previousButton);
    expect(onChange).toHaveBeenLastCalledWith(0);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 0);

    expect(queryAllByRole('tab').length).toBe(4);
  });

  it('should go to specific slide when clicking on indicator button', () => {
    const onChange = jest.fn();
    const { queryAllByRole, queryAllByTestId, getByA11yState } = renderWithTheme(
      <Carousel onChange={onChange}>
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
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 0);

    fireEvent.press(queryAllByRole('tab')[2]);
    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 2);

    fireEvent.press(queryAllByRole('tab')[0]);
    expect(onChange).toHaveBeenLastCalledWith(0);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 0);
  });

  it('should wrap around when reaching start or end slide', () => {
    const onChange = jest.fn();
    const { queryAllByRole, queryAllByTestId, getByA11yState } = renderWithTheme(
      <Carousel onChange={onChange}>
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
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 0);

    const [previousButton, nextButton] = queryAllByRole('button');
    expect(previousButton.props.accessibilityLabel).toBe('Previous Slide');
    expect(nextButton.props.accessibilityLabel).toBe('Next Slide');

    fireEvent.press(previousButton);

    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 3);

    fireEvent.press(nextButton);
    expect(onChange).toHaveBeenLastCalledWith(0);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 0);
  });

  it('should auto play', async () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    const { queryAllByTestId, getByA11yState } = renderWithTheme(
      <Carousel autoPlay onChange={onChange}>
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
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 0);

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 1);

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 2);

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(0);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 0);
  });

  it('should not auto play when user is scrolling', async () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    const { getByLabelText, queryAllByTestId, getByA11yState } = renderWithTheme(
      <Carousel accessibilityLabel="My Carousel" autoPlay onChange={onChange}>
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
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 0);

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 1);

    fireEvent(getByLabelText('My Carousel'), 'onScrollBeginDrag');

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 1);

    fireEvent(getByLabelText('My Carousel'), 'onScrollEndDrag');

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(getByA11yState({ selected: true })).toHaveProp('slideIndex', 2);
  });
});

describe('Carousel Snapshots', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(
      <Carousel>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
        <CarouselItem>
          <TestimonialCard />
        </CarouselItem>
      </Carousel>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with visibleItems but always renders 1 item only', () => {
    const { toJSON } = renderWithTheme(
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

    expect(toJSON()).toMatchSnapshot();
  });
});
