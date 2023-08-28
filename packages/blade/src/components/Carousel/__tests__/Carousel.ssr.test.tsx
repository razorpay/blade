/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Carousel } from '../Carousel';
import { CarouselItem } from '../CarouselItem';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Text } from '~components/Typography';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Carousel />', () => {
  it('should render a Carousel ssr', () => {
    const { container } = renderWithSSR(
      <Carousel visibleItems={2}>
        <CarouselItem>
          <Text>Carousel Item 1</Text>
        </CarouselItem>
        <CarouselItem>
          <Text>Carousel Item 2</Text>
        </CarouselItem>
        <CarouselItem>
          <Text>Carousel Item 3</Text>
        </CarouselItem>
        <CarouselItem>
          <Text>Carousel Item 4</Text>
        </CarouselItem>
        <CarouselItem>
          <Text>Carousel Item 5</Text>
        </CarouselItem>
      </Carousel>,
    );

    expect(container).toMatchSnapshot();
  });
});
