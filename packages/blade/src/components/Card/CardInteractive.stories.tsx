/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-alert */
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import type { CardProps } from './Card';
import {
  CardBody,
  Card,
  CardFooter,
  CardFooterLeading,
  CardFooterTrailing,
  CardHeader,
  CardHeaderLeading,
  CardHeaderTrailing,
  CardHeaderIcon,
  CardHeaderCounter,
  CardHeaderBadge,
} from '.';
import { Code, Text, Heading } from '~components/Typography';
import { RupeeIcon, RazorpayIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Amount } from '~components/Amount';
import { isReactNative } from '~utils';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Switch } from '~components/Switch';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Radio, RadioGroup } from '~components/Radio';
import { Checkbox, CheckboxGroup } from '~components/Checkbox';
import { Divider } from '~components/Divider';
import { List, ListItem, ListItemText } from '~components/List';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Interactive Card"
      componentDescription="Enhancing the Card component to add additional interactions and behaviour. This includes making the card clickable, hoverable, linkable, selectable and more."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75857-127700&t=qZx2sCUVp8UPW4qj-1&scaling=min-zoom&page-id=21248%3A307966&mode=design"
    >
      <Heading size="large">Usage</Heading>
      <Box marginY="spacing.6">
        <Sandbox>
          {`
        import React from 'react';
        import { Card, CardBody, Box, Text, Amount, VisuallyHidden } from '@razorpay/blade/components';

        type HiddenInputProps = {
          onChange: (value: string) => void;
          value: string;
          name: string;
          type?: string;
        }
        const HiddenInput = ({
          onChange,
          value,
          name,
          type,
        }: HiddenInputProps): React.ReactElement => {
          return (
            <VisuallyHidden>
              <input
                type={type ?? 'radio'}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                name={name}
                value={value}
              />
            </VisuallyHidden>
          );
        };

        const App = () => {
          const [selected, setSelected] = React.useState('free');

          return (
            <Box display="flex" gap="spacing.5">
              <Card
                as="label"
                accessibilityLabel="Free Tier"
                shouldScaleOnHover
                isSelected={selected === 'free'}
              >
                <CardBody>
                  <HiddenInput
                    onChange={(value) => setSelected(value)}
                    value="free"
                    name="pricing-card"
                  />
                  <Amount marginBottom="spacing.1" value={0} currency="USD" size="large" />
                  <Box paddingX="spacing.2">
                    <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                      Free
                    </Text>
                    <Text>
                      For individuals or teams just getting started with payments. No setup fees, no
                      monthly or annual fees.
                    </Text>
                  </Box>
                </CardBody>
              </Card>
              <Card
                as="label"
                accessibilityLabel="Standard Tier"
                shouldScaleOnHover
                isSelected={selected === 'standard'}
              >
                <CardBody>
                  <HiddenInput
                    onChange={(value) => setSelected(value)}
                    value="standard"
                    name="pricing-card"
                  />
                  <Amount marginBottom="spacing.1" value={10} currency="USD" size="large" />
                  <Box paddingX="spacing.2">
                    <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                      Standard
                    </Text>
                    <Text>
                      For teams that are scaling up and need advanced features like payment failure.
                    </Text>
                  </Box>
                </CardBody>
              </Card>
              <Card
                as="label"
                accessibilityLabel="Premium Tier"
                shouldScaleOnHover
                isSelected={selected === 'premium'}
                height="100%"
              >
                <CardBody>
                  <HiddenInput
                    onChange={(value) => setSelected(value)}
                    value="premium"
                    name="pricing-card"
                  />
                  <Amount marginBottom="spacing.1" value={20} currency="USD" size="large" />
                  <Box paddingX="spacing.2">
                    <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                      Premium
                    </Text>
                    <Text>
                      Best suited for businesses that need a dedicated account manager and 24x7 support.
                    </Text>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          );
        };

        export default App;
        `}
        </Sandbox>
      </Box>
    </StoryPageWrapper>
  );
};

const disable = {
  table: {
    disable: true,
  },
};
const propCategory = {
  category: 'Supports All Card Props Plus:',
};
export default {
  title: 'Components/Card/Interactive',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    width: disable,
    height: disable,
    alignSelf: disable,
    bottom: disable,
    display: disable,
    children: disable,
    gridArea: disable,
    margin: disable,
    top: disable,
    left: disable,
    right: disable,
    marginLeft: disable,
    marginRight: disable,
    marginTop: disable,
    marginBottom: disable,
    testID: disable,
    marginX: disable,
    marginY: disable,
    as: disable,
    target: {
      control: {
        type: 'text',
      },
      table: propCategory,
    },
    onClick: {
      control: {
        type: 'function',
      },
      table: propCategory,
    },
    onHover: {
      control: {
        type: 'function',
      },
      table: propCategory,
    },
    accessibilityLabel: {
      control: {
        type: 'text',
      },
      table: propCategory,
    },
    isSelected: {
      control: {
        type: 'boolean',
      },
      table: propCategory,
    },
    shouldScaleOnHover: {
      control: {
        type: 'boolean',
      },
      table: propCategory,
    },
    href: {
      control: {
        type: 'text',
      },
      table: propCategory,
    },
    rel: {
      control: {
        type: 'text',
      },
      table: propCategory,
    },
    surfaceLevel: {
      control: {
        type: 'number',
      },
      table: propCategory,
    },
    elevation: {
      table: propCategory,
    },
    padding: {
      table: propCategory,
    },
  },
  args: {
    accessibilityLabel: 'Payment Pages Card',
    isSelected: false,
    shouldScaleOnHover: true,
    surfaceLevel: 2,
    elevation: 'midRaised',
    padding: 'spacing.7',
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<CardProps>;

const CardTemplate: StoryFn<typeof Card> = (args): React.ReactElement => {
  return (
    <Card
      onHover={() => {
        console.log('Hovered');
      }}
      isSelected={args.isSelected}
      shouldScaleOnHover={args.shouldScaleOnHover}
      href={args.href}
      target={args.target}
      accessibilityLabel={args.accessibilityLabel}
      backgroundColor={args.backgroundColor}
      elevation={args.elevation}
      padding={args.padding}
      width={{ s: '100%', m: '400px' }}
    >
      <CardHeader>
        <CardHeaderLeading
          title="Payment Pages"
          subtitle="Card Header Subtitle"
          prefix={<CardHeaderIcon icon={RupeeIcon} />}
          suffix={<CardHeaderCounter value={12} />}
        />
        <CardHeaderTrailing visual={<CardHeaderBadge color="positive">NEW</CardHeaderBadge>} />
      </CardHeader>
      <CardBody>
        <Text>
          Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
          Accepting payments from customers is now just a link away.
        </Text>
      </CardBody>
      <CardFooter>
        <CardFooterLeading title="Footer" subtitle="Footer Subtitle" />
        <CardFooterTrailing
          actions={{
            primary: { text: 'Primary', onClick: () => console.log('Primary') },
            secondary: { text: 'Secondary', onClick: () => console.log('Secondary') },
          }}
        />
      </CardFooter>
    </Card>
  );
};

export const Default = CardTemplate.bind({});

export const ClickableCard = (): React.ReactElement => {
  const [cardClickCount, setCardClickCount] = React.useState(0);
  const [buttonClickCount, setButtonClickCount] = React.useState(0);
  const [switchToggleCounter, setSwitchToggleCounter] = React.useState(0);

  return (
    <Box>
      <Box marginBottom="spacing.6">
        <Text>
          Cards can be made clickable by passing the <Code size="medium">onClick</Code> prop.
        </Text>
        <Text>
          You will also need to pass the <Code size="medium">accessibilityLabel</Code> to make the
          card accessible to screen readers.
        </Text>
      </Box>
      <Card
        accessibilityLabel="Payment Pages Card"
        onClick={() => setCardClickCount((prev) => prev + 1)}
        width={{ s: '100%', m: '400px' }}
      >
        <CardHeader>
          <CardHeaderLeading title="Payment Pages" />
        </CardHeader>
        <CardBody>
          <Text>
            Take your store online instantly with zero coding. Accept international & domestic
            payments.
          </Text>
          <Text marginY="spacing.2">
            Card Clicked:{' '}
            <Text as="span" weight="semibold">
              {cardClickCount}
            </Text>
          </Text>
          <Text marginY="spacing.2">
            Button Clicked:{' '}
            <Text as="span" weight="semibold">
              {buttonClickCount}
            </Text>
          </Text>
          <Text marginY="spacing.2">
            Switch Toggled:{' '}
            <Text as="span" weight="semibold">
              {switchToggleCounter}
            </Text>
          </Text>
          <Button
            size="small"
            marginTop="spacing.5"
            onClick={() => {
              setButtonClickCount((prev) => prev + 1);
            }}
          >
            Get Demo
          </Button>
          <Switch
            accessibilityLabel="switch"
            size="small"
            onChange={() => {
              setSwitchToggleCounter((prev) => prev + 1);
            }}
          />
        </CardBody>
      </Card>
    </Box>
  );
};

export const HoverableCard = (): React.ReactElement => {
  return (
    <Box>
      <Text marginBottom="spacing.6">
        By passing the <Code size="medium">shouldScaleOnHover</Code> prop, the card will scale up on
        hover. (on mobile devices the interaction will happen on press and the card will scale down
        instead)
      </Text>
      <Card shouldScaleOnHover width={{ s: '100%', m: '400px' }}>
        <CardHeader>
          <CardHeaderLeading
            title="Payment Links"
            subtitle="Collect faster payments on UPI Payment Links with upto 50% lower fees"
          />
        </CardHeader>
        <CardBody>
          <Text>
            Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
            Accepting payments from customers is now just a link away.
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
};

export const LinkableCard = (): React.ReactElement => {
  return (
    <Box>
      <Box marginBottom="spacing.6">
        <Text>
          Cards can be made linkable by passing the <Code size="medium">href</Code> prop,
        </Text>
        <Text>
          You will also need to pass the <Code size="medium">accessibilityLabel</Code> to make the
          link accessible to screen readers.
        </Text>
      </Box>
      <Card
        href="https://razorpay.com/payment-links"
        accessibilityLabel="Payment Links"
        shouldScaleOnHover
        width={{ s: '100%', m: '400px' }}
      >
        <CardHeader>
          <CardHeaderLeading
            title="Payment Links"
            subtitle="Collect faster payments on UPI Payment Links with upto 50% lower fees"
          />
        </CardHeader>
        <CardBody>
          <Text>
            Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
            Accepting payments from customers is now just a link away.
          </Text>
          <Link marginTop="spacing.4" href="https://razorpay.com/payment-links/#overview">
            Get Demo
          </Link>
        </CardBody>
      </Card>
    </Box>
  );
};

const HiddenInput = ({
  onChange,
  value,
  name,
  type,
}: {
  onChange: (value: string) => void;
  value: string;
  name: string;
  type?: string;
}): React.ReactElement => {
  return (
    <VisuallyHidden>
      <input
        type={type ?? 'radio'}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        name={name}
        value={value}
      />
    </VisuallyHidden>
  );
};

const SingleSelectCardWeb = (): React.ReactElement => {
  const [selected, setSelected] = React.useState('free');

  return (
    <Box>
      <Text marginBottom="spacing.6">
        To make a group of cards behave like radio buttons, you can put a hidden radio input inside
        the <Code size="medium">CardBody</Code> and pass <Code size="medium">as="label"</Code> prop
        to the <Code size="medium">Card</Code>.
      </Text>

      <Box
        display="flex"
        gap="spacing.5"
        flexDirection={{ xs: 'column', m: 'row' }}
        alignItems="stretch"
      >
        <Card
          as="label"
          accessibilityLabel="Free Tier"
          shouldScaleOnHover
          isSelected={selected === 'free'}
          minHeight="100%"
        >
          <CardBody>
            <HiddenInput
              onChange={(value) => setSelected(value)}
              value="free"
              name="pricing-card"
            />
            <Amount marginBottom="spacing.1" value={0} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Free
              </Text>
              <Text>
                For individuals or teams just getting started with payments. No setup fees, no
                monthly or annual fees.
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card
          as="label"
          accessibilityLabel="Standard Tier"
          shouldScaleOnHover
          isSelected={selected === 'standard'}
          minHeight="100%"
        >
          <CardBody>
            <HiddenInput
              onChange={(value) => setSelected(value)}
              value="standard"
              name="pricing-card"
            />
            <Amount marginBottom="spacing.1" value={10} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Standard
              </Text>
              <Text>
                For teams that are scaling up and need advanced features like payment failure.
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card
          as="label"
          accessibilityLabel="Premium Tier"
          shouldScaleOnHover
          isSelected={selected === 'premium'}
          minHeight="100%"
        >
          <CardBody>
            <HiddenInput
              onChange={(value) => setSelected(value)}
              value="premium"
              name="pricing-card"
            />
            <Amount marginBottom="spacing.1" value={20} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Premium
              </Text>
              <Text>
                Best suited for businesses that need a dedicated account manager and 24x7 support.
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

const MultiSelectCardWeb = (): React.ReactElement => {
  const [selected, setSelected] = React.useState(['free']);

  const handleChange = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <Box>
      <Text marginBottom="spacing.6">
        To make a group of cards behave like checkboxes, you can put a hidden checkbox input inside
        the <Code size="medium">CardBody</Code> and pass <Code size="medium">as="label"</Code> prop
        to the <Code size="medium">Card</Code>.
      </Text>

      <Box
        display="flex"
        gap="spacing.5"
        flexDirection={{ xs: 'column', m: 'row' }}
        alignItems="stretch"
      >
        <Card as="label" shouldScaleOnHover isSelected={selected.includes('free')} minHeight="100%">
          <CardBody>
            <HiddenInput
              type="checkbox"
              onChange={(value) => handleChange(value)}
              value="free"
              name="pricing-card"
            />
            <Amount marginBottom="spacing.1" value={0} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Free
              </Text>
              <Text>
                For individuals or teams just getting started with payments. No setup fees, no
                monthly or annual fees.
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card
          as="label"
          shouldScaleOnHover
          isSelected={selected.includes('standard')}
          minHeight="100%"
        >
          <CardBody>
            <HiddenInput
              type="checkbox"
              onChange={(value) => handleChange(value)}
              value="standard"
              name="pricing-card"
            />
            <Amount marginBottom="spacing.1" value={10} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Standard
              </Text>
              <Text>
                For teams that are scaling up and need advanced features like payment failure.
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card
          as="label"
          shouldScaleOnHover
          isSelected={selected.includes('premium')}
          minHeight="100%"
        >
          <CardBody>
            <HiddenInput
              type="checkbox"
              onChange={(value) => handleChange(value)}
              value="premium"
              name="pricing-card"
            />
            <Amount marginBottom="spacing.1" value={20} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Premium
              </Text>
              <Text>
                Best suited for businesses that need a dedicated account manager and 24x7 support.
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

const SingleSelectCardReactNative = (): React.ReactElement => {
  const [selected, setSelected] = React.useState('free');

  return (
    <Box>
      <Text marginBottom="spacing.6">
        On ReactNative, to make a group of cards behave like radio buttons, you can manage your own
        state for selected card and use the <Code size="medium">isSelected</Code> &{' '}
        <Code size="medium">onClick</Code> prop to highlight the selected card.
      </Text>

      <Box display="flex" gap="spacing.5">
        <Card
          onClick={() => setSelected('free')}
          accessibilityLabel="Free Tier"
          shouldScaleOnHover
          isSelected={selected === 'free'}
        >
          <CardBody>
            <Amount marginBottom="spacing.1" value={0} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Free
              </Text>
              <Text>
                For individuals or teams just getting started with payments. No setup fees, no
                monthly or annual fees.
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card
          onClick={() => setSelected('standard')}
          accessibilityLabel="Standard Tier"
          shouldScaleOnHover
          isSelected={selected === 'standard'}
        >
          <CardBody>
            <Amount marginBottom="spacing.1" value={10} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Standard
              </Text>
              <Text>
                For teams that are scaling up and need advanced features like payment failure.
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card
          onClick={() => setSelected('premium')}
          accessibilityLabel="Premium Tier"
          shouldScaleOnHover
          isSelected={selected === 'premium'}
        >
          <CardBody>
            <Amount marginBottom="spacing.1" value={20} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Premium
              </Text>
              <Text>
                Best suited for businesses that need a dedicated account manager and 24x7 support.
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

const MultiSelectCardReactNative = (): React.ReactElement => {
  const [selected, setSelected] = React.useState(['free']);

  const handleChange = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <Box>
      <Text marginBottom="spacing.6">
        On ReactNative, to make a group of cards behave like checkboxes, you can manage your own
        state for selected card and use the <Code size="medium">isSelected</Code> &{' '}
        <Code size="medium">onClick</Code> prop to highlight the selected card.
      </Text>

      <Box display="flex" gap="spacing.5">
        <Card
          onClick={() => handleChange('free')}
          isSelected={selected.includes('free')}
          accessibilityLabel="Free Tier"
          shouldScaleOnHover
        >
          <CardBody>
            <Amount marginBottom="spacing.1" value={0} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Free
              </Text>
              <Text>
                For individuals or teams just getting started with payments. No setup fees, no
                monthly or annual fees.
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card
          onClick={() => handleChange('standard')}
          isSelected={selected.includes('standard')}
          accessibilityLabel="Standard Tier"
          shouldScaleOnHover
        >
          <CardBody>
            <Amount marginBottom="spacing.1" value={10} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Standard
              </Text>
              <Text>
                For teams that are scaling up and need advanced features like payment failure.
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card
          onClick={() => handleChange('premium')}
          isSelected={selected.includes('premium')}
          accessibilityLabel="Premium Tier"
          shouldScaleOnHover
        >
          <CardBody>
            <Amount marginBottom="spacing.1" value={20} currency="USD" size="large" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" color="surface.text.gray.subtle">
                Premium
              </Text>
              <Text>
                Best suited for businesses that need a dedicated account manager and 24x7 support.
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

const merchantOnboardingOptions = [
  {
    value: 'payment-gateway',
    title: 'Payment Gateway',
    subtitle: 'Accept online payments',
    icon: RazorpayIcon,
    features: [
      '100+ payment methods',
      'UPI, Cards, Netbanking, Wallets',
      'Industry-leading success rates',
      'Real-time payment tracking',
    ],
  },
  {
    value: 'payment-links',
    title: 'Payment Links',
    subtitle: 'Share & collect payments',
    icon: RazorpayIcon,
    features: [
      'No coding required',
      'Share via SMS, email, WhatsApp',
      'Instant payment collection',
      'Custom branding options',
    ],
  },
  {
    value: 'payment-pages',
    title: 'Payment Pages',
    subtitle: 'Create online store',
    icon: RazorpayIcon,
    features: [
      'Ready-to-use online store',
      'Product catalog management',
      'Inventory tracking',
      'Mobile-optimized checkout',
    ],
  },
  {
    value: 'pos',
    title: 'Point of Sale (POS)',
    subtitle: 'In-store payments',
    icon: RazorpayIcon,
    features: [
      'Accept card & UPI payments',
      'Contactless payments',
      'Inventory management',
      'Sales analytics & reports',
    ],
  },
];

const OptionCard = ({
  option,
  isSelected,
  children,
}: {
  option: typeof merchantOnboardingOptions[0];
  isSelected: boolean;
  children: React.ReactNode;
}) => (
  <Card
    as="label"
    isSelected={isSelected}
    marginBottom="spacing.3"
    width={{ s: '100%', m: '400px' }}
  >
    <CardBody>
      <Box display="flex" flexDirection="row" gap="spacing.3">
        <CardHeaderLeading
          title={option.title}
          subtitle={option.subtitle}
          prefix={<CardHeaderIcon icon={option.icon} />}
        />
        {children}
      </Box>
      <Divider marginTop="spacing.2" />
      <List variant="unordered" marginTop="spacing.2">
        {option.features.map((feature, index) => (
          <ListItem key={index}>
            <ListItemText>{feature}</ListItemText>
          </ListItem>
        ))}
      </List>
    </CardBody>
  </Card>
);

export const SingleSelectableCardWithRadio = (): React.ReactElement => {
  const [selectedBusinessType, setSelectedBusinessType] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const hasError = isSubmitted && !selectedBusinessType;

  return (
    <Box display="flex" gap="spacing.6" flexDirection="column">
      <Box>
        <Text marginBottom="spacing.4" weight="semibold" size="large">
          Merchant Onboarding - Primary Product Selection
        </Text>
        <Text marginBottom="spacing.4">
          Choose your primary Razorpay product to get started. You can add more products later from
          your dashboard.
        </Text>

        <RadioGroup
          value={selectedBusinessType}
          onChange={({ value }) => setSelectedBusinessType(value)}
          label="Select Product"
          necessityIndicator="required"
          validationState={hasError ? 'error' : 'none'}
          errorText={hasError ? 'Please select a product to continue' : undefined}
          helpText="Select one primary product for your initial setup"
          orientation="horizontal"
          flexWrap="wrap"
        >
          {merchantOnboardingOptions.map((option) => (
            <OptionCard
              key={option.value}
              option={option}
              isSelected={selectedBusinessType === option.value}
            >
              <Radio value={option.value} />
            </OptionCard>
          ))}
        </RadioGroup>

        <Box display="flex" justifyContent="space-between">
          <Button marginTop="spacing.4" onClick={() => setIsSubmitted(true)} variant="primary">
            Continue Setup
          </Button>
          {selectedBusinessType && (
            <Box
              marginTop="spacing.3"
              backgroundColor="surface.background.gray.intense"
              padding="spacing.3"
              borderRadius="medium"
            >
              <Text color="surface.text.gray.subtle">
                Selected:{' '}
                {
                  merchantOnboardingOptions.find((option) => option.value === selectedBusinessType)
                    ?.title
                }
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const MultiSelectableCardWithCheckbox = (): React.ReactElement => {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const hasError = isSubmitted && selectedProducts.length === 0;
  const hasMaxError = selectedProducts.length > 3;
  const validationState = hasError || hasMaxError ? 'error' : 'none';
  const errorText = hasError
    ? 'Please select at least one Razorpay product to get started'
    : hasMaxError
    ? 'You can select maximum 3 products during initial setup'
    : undefined;

  return (
    <Box display="flex" gap="spacing.6" flexDirection="column">
      <Box>
        <Text marginBottom="spacing.4" weight="semibold" size="large">
          Merchant Onboarding - Multiple Product Selection
        </Text>
        <Text marginBottom="spacing.4">
          Choose multiple Razorpay products you want to integrate. You can always add more products
          later from your dashboard.
        </Text>

        <CheckboxGroup
          value={selectedProducts}
          onChange={({ values }) => setSelectedProducts(values)}
          label="Which products do you want to use?"
          necessityIndicator="required"
          validationState={validationState}
          errorText={errorText}
          helpText="Select 1-3 products to start with. Additional products can be enabled later."
          orientation="horizontal"
          flexWrap="wrap"
        >
          {merchantOnboardingOptions.map((option) => (
            <OptionCard
              key={option.value}
              option={option}
              isSelected={selectedProducts.includes(option.value)}
            >
              <Checkbox value={option.value} />
            </OptionCard>
          ))}
        </CheckboxGroup>

        <Box display="flex" justifyContent="space-between">
          <Button marginTop="spacing.4" onClick={() => setIsSubmitted(true)} variant="primary">
            Continue Setup
          </Button>

          {selectedProducts.length > 0 && (
            <Box
              marginTop="spacing.3"
              backgroundColor="surface.background.gray.intense"
              padding="spacing.3"
              borderRadius="medium"
            >
              <Text color="surface.text.gray.subtle">
                Selected products ({selectedProducts.length}/3):{' '}
                {selectedProducts
                  .map(
                    (productValue) =>
                      merchantOnboardingOptions.find((option) => option.value === productValue)
                        ?.title,
                  )
                  .join(', ')}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const SelectableCardWithLabelLeft = (): React.ReactElement => {
  const [selectedBusinessType, setSelectedBusinessType] = React.useState('');

  return (
    <Box display="flex" gap="spacing.6" flexDirection="column">
      <Box>
        <Text marginBottom="spacing.4" weight="semibold" size="large">
          Label Position Left Example
        </Text>
        <Text marginBottom="spacing.4">
          RadioGroup with label positioned on the left side of the cards.
        </Text>

        <RadioGroup
          value={selectedBusinessType}
          onChange={({ value }) => setSelectedBusinessType(value)}
          label="Select Product"
          orientation="horizontal"
          labelPosition="left"
          flexWrap="wrap"
          helpText="Select one primary product for your initial setup"
        >
          {merchantOnboardingOptions.slice(0, 2).map((option) => (
            <OptionCard
              key={option.value}
              option={option}
              isSelected={selectedBusinessType === option.value}
            >
              <Radio value={option.value} />
            </OptionCard>
          ))}
        </RadioGroup>
      </Box>
    </Box>
  );
};

export const SingleSelectableCard = (): React.ReactElement => {
  if (isReactNative()) {
    return <SingleSelectCardReactNative />;
  }
  return <SingleSelectCardWeb />;
};

export const MultiSelectableCard = (): React.ReactElement => {
  if (isReactNative()) {
    return <MultiSelectCardReactNative />;
  }
  return <MultiSelectCardWeb />;
};
