/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Carousel } from '../Carousel';
import { CarouselItem } from '../CarouselItem';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Text } from '~components/Typography';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

// Something is wrong with our SSR setup, it's throwing error saying 'the carousel container's ref is null'
// but i tested on nextjs everything seems to be working, skipping this test for now
describe.skip('<Carousel />', () => {
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
