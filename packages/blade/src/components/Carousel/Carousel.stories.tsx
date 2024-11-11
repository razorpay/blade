/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { StoryFn, Meta } from '@storybook/react';
import { Title as AddonTitle } from '@storybook/addon-docs';
import React from 'react';
import type { CarouselProps } from './';
import { Carousel as CarouselComponent, CarouselItem } from './';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Card, CardBody } from '~components/Card';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Divider } from '~components/Divider';
import { isReactNative } from '~utils';
import { List, ListItem } from '~components/List';
import { Link } from '~components/Link';
import { useTheme } from '~components/BladeProvider';
import { Button } from '~components/Button';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Carousel"
      componentDescription="Carousel is a UI component that allows the display and navigation of a set of content items, typically images or cards, within a limited space. It is often used to showcase multiple pieces of content in a visually appealing and interactive way."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75154-263106&t=labtGW09OHM0uSau-1&scaling=min-zoom&page-id=50174%3A778489&mode=design"
    >
      <AddonTitle>Usage</AddonTitle>
      <Sandbox editorHeight={500}>
        {`
        import {
          Carousel,
          CarouselItem,
          Text,
        } from '@razorpay/blade/components';

        function App() {
          return (
            <Carousel>
              <CarouselItem>
                <Text>Slide 1</Text>
              </CarouselItem>
              <CarouselItem>
                <Text>Slide 2</Text>
              </CarouselItem>
              <CarouselItem>
                <Text>Slide 3</Text>
              </CarouselItem>
              <CarouselItem>
                <Text>Slide 3</Text>
              </CarouselItem>
            </Carousel>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const meta: Meta<CarouselProps> = {
  title: 'Components/Carousel',
  component: CarouselComponent,
  args: {
    autoPlay: false,
    accessibilityLabel: undefined,
    carouselItemAlignment: 'start',
    carouselItemWidth: undefined,
    navigationButtonPosition: 'bottom',
    indicatorVariant: 'gray',
    navigationButtonVariant: 'filled',
    visibleItems: 1,
    shouldAddStartEndSpacing: false,
    showIndicators: true,
    scrollOverlayColor: undefined,
  },
  tags: ['autodocs'],
  argTypes: {
    // hide children prop
    children: {
      table: {
        disable: true,
      },
    },
    carouselItemAlignment: {
      control: {
        type: 'select',
        options: [
          'normal',
          'stretch',
          'center',
          'end',
          'flex-end',
          'flex-start',
          'self-end',
          'self-start',
          'start',
        ],
      },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

type TestimonialData = {
  quote: string;
  longQuote: string;
  name: string;
  role: string;
  company: string;
};

const testimonialData: TestimonialData[] = [
  {
    quote: 'Acquire Customers From New Customer Segments',
    longQuote:
      'Creating No Cost EMI offers through the Razorpay dashboard was surprisingly easy and it has proved to be an important driver in making our subscriptions affordable to a wider audience. We saw ~3x increase of the EMI contribution in the overall sales, thereby unlocking a specific affordability sensitive segment for us.',
    name: 'Subham Kumar',
    role: 'Product Manager',
    company: 'Unacademy',
  },
  {
    quote: 'Improved The Bottom Line With Cash-Like Collection',
    longQuote:
      'Instant Settlements helps us capture last-minute EMI payments and let us make deposits with our financing partners within the requisite period. It leads to better money flow management and customer experience.',
    name: 'Saurav Goyal',
    role: 'Chief Finance Officer',
    company: 'Money View',
  },
  {
    quote: 'Readymade Closed Wallet Solution For Quick Refunds',
    longQuote:
      'We were looking for a closed wallet solution for one-step checkout once the money is loaded in the wallet. Razorpay, our online payment partner, built a white label closed wallet solution which enabled us to create & offer cashbacks and easily refund payments. This improved customer loyalty and the trust in our brand.',
    name: 'Ashish Somani',
    role: 'GM, Strategy and Planning',
    company: 'MedLife',
  },
  {
    quote: 'Single Flow To Collect And Disburse Payments',
    longQuote:
      'Razorpay has been an important partner for our business. We are currently using Smart collect and Route marketplace for collecting payments from users. Their innovative products and quick support has helped us scale our offering to our users. From onboarding documentation to technical integration, Razorpay has been a boon for Indian tech startups.',
    name: 'Pranay Bhardwaj',
    role: 'Product Manager',
    company: 'Slice',
  },
  {
    quote: 'Simplified Reconciliation Process For FinOps Teams',
    longQuote:
      '50% of our payments come via NEFT, RTGS and, IMPS bank transfers. Reconciliation of payments was a tedious and cumbersome process. Razorpay Smart Collect has helped us automate this end-to-end and simplified the process for Finance and Operations team.',
    name: 'Shailesh Gupta',
    role: 'Founder',
    company: 'innov8',
  },
  {
    quote: 'Finance Your Working Capital To Continue Growing',
    longQuote:
      "We experienced a 40% decline in demand due to Covid-19 lockdown but we couldn't afford to cut back on marketing and product development. Razorpay did a fine job of processing and disbursing Working Capital Loan quickly with great support throughout. With increased liquidity, we were able to bounce back to normality in no time.",
    name: 'Girish Khemnani',
    role: 'Owner',
    company: 'Market Insights',
  },
  {
    quote: 'Helped Us Reduce Outstandings By 18%',
    longQuote:
      'By using the card tokenization feature on Razorpay Subscriptions, we were able to eliminate up-front deposits for a majority of our customers. This helped us reduce outstandings by 18% and improved our retention numbers, as more customers were able to afford the product.',
    name: 'Aravind Radhakrishnan',
    role: 'Product Director',
    company: 'Zoomcar',
  },
];

const QuoteSvg = (): React.ReactElement => {
  const { theme } = useTheme();

  if (isReactNative()) {
    return <></>;
  }

  return (
    <svg width="38" height="31" viewBox="0 0 38 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.848 0L14.56 4.48C12.2453 6.944 10.6027 9.25867 9.632 11.424C8.66133 13.5893 8.176 15.8293 8.176 18.144L4.704 14.896H15.792V30.576H0V20.272C0 16.464 0.672 12.9547 2.016 9.744C3.36 6.53334 5.63733 3.28534 8.848 0ZM30.576 0L36.288 4.48C33.9733 6.944 32.3307 9.25867 31.36 11.424C30.3893 13.5893 29.904 15.8293 29.904 18.144L26.432 14.896H37.52V30.576H21.728V20.272C21.728 16.464 22.4 12.9547 23.744 9.744C25.088 6.53334 27.3653 3.28534 30.576 0Z"
        fill={theme.colors.interactive.background.primary.faded}
      />
    </svg>
  );
};
const Avatar = ({ name }: { name: string }): React.ReactElement => {
  if (isReactNative()) {
    return <></>;
  }

  return (
    <Box flexShrink={0} width="50px" height="50px" borderRadius="max" overflow="hidden">
      <img
        src={`https://api.dicebear.com/6.x/notionists/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
        alt={name}
      />
    </Box>
  );
};

const TestimonialCard = ({
  name,
  quote,
  longQuote,
  role,
  company,
}: TestimonialData): React.ReactElement => {
  return (
    <Card height="100%">
      <CardBody height="100%">
        <Box height="100%" display="flex" gap="spacing.4" flexDirection="column">
          <QuoteSvg />
          <Box>
            <Heading weight="semibold" size="large">
              {quote}
            </Heading>
            <Text size="medium" marginTop="spacing.4">
              {longQuote}
            </Text>
          </Box>
          <Divider marginY="spacing.4" />
          <Box
            display="flex"
            alignItems={isReactNative() ? 'flex-start' : 'center'}
            gap="spacing.4"
          >
            <Avatar name={name} />
            <Box>
              <Text size="large" weight="semibold">
                {name}
              </Text>
              <Text>
                <Text as="span" weight="semibold">
                  {company}
                </Text>
                {', '}
                <Text as="span">{role}</Text>
              </Text>
            </Box>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export const CarouselExample = (props: Omit<CarouselProps, 'children'>): React.ReactElement => {
  const key = `${props.visibleItems}-${props.shouldAddStartEndSpacing}`;
  return (
    <Box width="100%" height={isReactNative() ? '350px' : 'auto'}>
      <CarouselComponent
        {...props}
        key={key}
        carouselItemAlignment="stretch"
        accessibilityLabel="Testimonials"
      >
        {testimonialData.map((testimonial) => (
          <CarouselItem key={testimonial.name}>
            <TestimonialCard {...testimonial} />
          </CarouselItem>
        ))}
      </CarouselComponent>
    </Box>
  );
};

const CarouselTestimonialTemplate: StoryFn<typeof CarouselComponent> = (props) => {
  return (
    <Box margin="auto" width={{ base: '100%', m: '100%' }} padding="spacing.4">
      <CarouselExample {...props} />
    </Box>
  );
};

export const DefaultCarousel = CarouselTestimonialTemplate.bind({});
DefaultCarousel.args = {
  carouselItemWidth: { base: '100%', m: '100%' },
};

export const VisibleItems: StoryFn<typeof CarouselComponent> = (props) => {
  if (isReactNative()) {
    return (
      <Box margin="auto" width="100%" padding="spacing.4">
        <Text marginY="spacing.5">on mobile visibleItems is always 1</Text>
        <CarouselExample {...props} visibleItems={1} />
      </Box>
    );
  }

  return (
    <Box margin="auto" width={{ base: '100%', m: '100%' }} padding="spacing.4">
      <Code size="medium" marginY="spacing.5">
        visibleItems: 1
      </Code>
      <CarouselExample {...props} visibleItems={1} />
      <Code size="medium" marginY="spacing.5">
        visibleItems: 2
      </Code>
      <CarouselExample {...props} visibleItems={2} />
      <Code size="medium" marginY="spacing.5">
        visibleItems: 3
      </Code>
      <CarouselExample {...props} visibleItems={3} />
    </Box>
  );
};
VisibleItems.args = {
  carouselItemWidth: { base: '100%', m: '100%' },
};
VisibleItems.argTypes = {
  visibleItems: {
    table: {
      disable: true,
    },
  },
  shouldAddStartEndSpacing: {
    table: {
      disable: true,
    },
  },
};

export const AutoBleed: StoryFn<typeof CarouselComponent> = () => {
  if (isReactNative()) {
    return (
      <Box>
        <Text>You can set carouselItemWidth to 90% to get 10% bleed on mobile</Text>
        <CarouselExample carouselItemWidth="90%" />
      </Box>
    );
  }

  return (
    <Box margin="auto" padding="spacing.4" width="100%">
      <Box marginY="spacing.8">
        <Text>
          You can achive bleed by setting <Code size="medium">visibleItems</Code> to autofit &
          adding <Code size="medium">carouselItemWidth</Code> to be a fixed width (eg: 300px)
        </Text>
        <Text marginTop="spacing.2">
          If you want bleed on mobile, you can set{' '}
          <Code size="medium">{`carouselItemWidth={{ base: '90%', m: '300px' }}`}</Code> , this will
          give a 10% bleed on mobile screens
        </Text>
      </Box>

      <Text weight="semibold">Props:</Text>
      <List marginBottom="spacing.3">
        <ListItem>visibleItems: autofit</ListItem>
        <ListItem>
          carouselItemWidth: {'{'} base: '90%', m: 300px {'}'}
        </ListItem>
      </List>
      <CarouselExample visibleItems="autofit" carouselItemWidth={{ base: '90%', m: '300px' }} />

      <Text marginY="spacing.8">
        If you want emphasis on 1 item with bleed you can set{' '}
        <Code size="medium">shouldAddStartEndSpacing</Code> to true
      </Text>

      <Text weight="semibold">Props:</Text>
      <List marginBottom="spacing.3">
        <ListItem>visibleItems: autofit</ListItem>
        <ListItem>shouldAddStartEndSpacing: true</ListItem>
        <ListItem>
          carouselItemWidth: {'{'} base: '90%', m: 300px {'}'}
        </ListItem>
      </List>
      <CarouselExample
        navigationButtonPosition="side"
        shouldAddStartEndSpacing
        visibleItems="autofit"
        carouselItemWidth={{ base: '90%', m: '300px' }}
        scrollOverlayColor="surface.background.gray.subtle"
      />
    </Box>
  );
};

AutoBleed.args = {
  visibleItems: 'autofit',
  carouselItemWidth: { base: '90%', m: '300px' },
};

export const ButtonPositions: StoryFn<typeof CarouselComponent> = (props) => {
  return (
    <Box margin="auto" padding="spacing.4" width="100%">
      <Code size="medium" marginY="spacing.8">
        navigationButtonPosition: bottom
      </Code>
      <CarouselExample key={props.visibleItems} {...props} navigationButtonPosition="bottom" />
      <Code size="medium" marginY="spacing.8">
        navigationButtonPosition: bottom
      </Code>
      <CarouselExample key={props.visibleItems} {...props} navigationButtonPosition="side" />
    </Box>
  );
};

ButtonPositions.args = {
  visibleItems: 2,
};
ButtonPositions.argTypes = {
  shouldAddStartEndSpacing: {
    table: {
      disable: true,
    },
  },
};

export const AutoPlay: StoryFn<typeof CarouselComponent> = (props) => {
  return (
    <Box margin="auto" padding="spacing.4" width="100%">
      <Text marginY="spacing.5">
        Setting autoPlay prop will auto scroll the slides every 6s, if you hover or focus inside the
        Carousel it will pause
      </Text>
      <CarouselExample key={props.visibleItems} {...props} />
    </Box>
  );
};

AutoPlay.args = {
  autoPlay: true,
  visibleItems: 2,
};
AutoPlay.argTypes = {
  shouldAddStartEndSpacing: {
    table: {
      disable: true,
    },
  },
};

export const Uncontrolled: StoryFn<typeof CarouselComponent> = (props) => {
  return (
    <Box margin="auto" padding="spacing.4" width="100%">
      <Text marginY="spacing.5">
        Setting `defaultActiveSlide` you can provide the initial active slide and use the carousel
        in an uncontrolled way.
      </Text>
      <CarouselExample
        {...props}
        defaultActiveSlide={2}
        onChange={(slideIndex) => {
          console.log('slideIndex', slideIndex);
        }}
      />
    </Box>
  );
};

Uncontrolled.args = {
  visibleItems: 2,
};
Uncontrolled.argTypes = {
  shouldAddStartEndSpacing: {
    table: {
      disable: true,
    },
  },
};

export const Controlled: StoryFn<typeof CarouselComponent> = (props) => {
  const [activeSlide, setActiveSlide] = React.useState(0);

  return (
    <Box margin="auto" padding="spacing.4" width="100%">
      <Text marginY="spacing.5">
        Setting <Code>activeSlide</Code> & <Code>onChange</Code> you can control the active slide
        and use the carousel in a controlled way. Here the active slide is {activeSlide}
      </Text>
      <Button marginY="spacing.4" size="small" onClick={() => setActiveSlide(2)}>
        Go to slide #3
      </Button>
      <CarouselExample
        {...props}
        activeSlide={activeSlide}
        onChange={(slideIndex) => {
          console.log('slideIndex', slideIndex);
          setActiveSlide(slideIndex);
        }}
      />
    </Box>
  );
};

Controlled.args = {
  visibleItems: 1,
};
Controlled.argTypes = {
  shouldAddStartEndSpacing: {
    table: {
      disable: true,
    },
  },
};

const InteractiveTestimonialCard = ({
  name,
  quote,
  longQuote,
  role,
  company,
}: TestimonialData): React.ReactElement => {
  return (
    <Box display="flex" alignItems="center" padding="spacing.5" height="100%">
      <Card
        height="100%"
        margin="auto"
        shouldScaleOnHover
        href={`https://www.google.com/search?q=${company}`}
      >
        <CardBody height="100%">
          <Box height="100%" display="flex" gap="spacing.4" flexDirection="column">
            <QuoteSvg />
            <Box>
              <Heading weight="semibold" size="large">
                {quote}
              </Heading>
              <Text size="medium" marginTop="spacing.4">
                {longQuote}
              </Text>
            </Box>
            <Divider marginY="spacing.4" />
            <Box
              display="flex"
              alignItems={isReactNative() ? 'flex-start' : 'center'}
              gap="spacing.4"
            >
              <Avatar name={name} />
              <Box>
                <Link size="large" href={`https://www.google.com/search?q=${name}`}>
                  {name}
                </Link>
                <Text>
                  <Text as="span" weight="semibold">
                    {company}
                  </Text>
                  {', '}
                  <Text as="span">{role}</Text>
                </Text>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

const InteractiveCarouselTestimonialTemplate: StoryFn<typeof CarouselComponent> = () => {
  return (
    <Box margin="auto" width={{ base: '100%', m: '100%' }} padding="spacing.4">
      <Box width="100%" height={isReactNative() ? '350px' : 'auto'}>
        <CarouselComponent
          visibleItems={2}
          carouselItemAlignment="stretch"
          accessibilityLabel="Testimonials"
        >
          {testimonialData.map((testimonial) => (
            <CarouselItem key={testimonial.name}>
              <InteractiveTestimonialCard {...testimonial} />
            </CarouselItem>
          ))}
        </CarouselComponent>
      </Box>
    </Box>
  );
};

export const WithInteractiveCards = InteractiveCarouselTestimonialTemplate.bind({});

export default meta;
