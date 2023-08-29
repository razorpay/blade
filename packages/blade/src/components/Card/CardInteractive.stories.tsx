/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-alert */
import type { Meta, ComponentStory } from '@storybook/react';
import React from 'react';
import { SandpackCodeEditor, SandpackLayout, SandpackPreview } from '@codesandbox/sandpack-react';
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
import { Code, Text, Title } from '~components/Typography';
import { RupeeIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Amount } from '~components/Amount';
import { castWebType, isReactNative } from '~utils';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { SandboxProvider } from '~utils/storybook/Sandbox';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Interactive Card"
      componentDescription="Enhancing the Card component to add additional interactions and behaviour. This includes making the card clickable, hoverable, linkable, selectable and more."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=21248%3A400833&t=ZCWT255jVK78xf1J-4',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=12791%3A336279&t=ZCWT255jVK78xf1J-4',
      }}
    >
      <Title>Usage</Title>
      <Box marginY="spacing.6">
        <SandboxProvider
          code={`
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

        const App = (): React.ReactElement => {
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
                  <Amount marginBottom="spacing.1" value={0} currency="USD" size="heading-large-bold" />
                  <Box paddingX="spacing.2">
                    <Text marginBottom="spacing.3" size="large" type="subtle">
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
                  <Amount marginBottom="spacing.1" value={10} currency="USD" size="heading-large-bold" />
                  <Box paddingX="spacing.2">
                    <Text marginBottom="spacing.3" size="large" type="subtle">
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
                  <Amount marginBottom="spacing.1" value={20} currency="USD" size="heading-large-bold" />
                  <Box paddingX="spacing.2">
                    <Text marginBottom="spacing.3" size="large" type="subtle">
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
        >
          <SandpackLayout>
            <SandpackCodeEditor />
            <Box display={castWebType({ base: 'none', m: 'block' })} height="200px" width="100%">
              <SandpackPreview style={{ width: '100%', height: '100%' }} />
            </Box>
          </SandpackLayout>
        </SandboxProvider>
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
      defaultValue: undefined,
      table: propCategory,
    },
    onClick: {
      control: {
        type: 'function',
      },
      defaultValue: undefined,
      table: propCategory,
    },
    onHover: {
      control: {
        type: 'function',
      },
      defaultValue: undefined,
      table: propCategory,
    },
    accessibilityLabel: {
      control: {
        type: 'text',
      },
      defaultValue: 'Payment Pages Card',
      table: propCategory,
    },
    isSelected: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
      table: propCategory,
    },
    shouldScaleOnHover: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
      table: propCategory,
    },
    href: {
      control: {
        type: 'text',
      },
      defaultValue: undefined,
      table: propCategory,
    },
    surfaceLevel: {
      control: {
        type: 'number',
      },
      defaultValue: 2,
      table: propCategory,
    },
    elevation: {
      defaultValue: 'midRaised',
      table: propCategory,
    },
    padding: {
      defaultValue: 'spacing.7',
      table: propCategory,
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<CardProps>;

const CardTemplate: ComponentStory<typeof Card> = (args): React.ReactElement => {
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
      surfaceLevel={args.surfaceLevel}
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
        <CardHeaderTrailing visual={<CardHeaderBadge variant="positive">NEW</CardHeaderBadge>} />
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
            <Text as="span" weight="bold">
              {cardClickCount}
            </Text>
          </Text>
          <Text marginY="spacing.2">
            Button Clicked:{' '}
            <Text as="span" weight="bold">
              {buttonClickCount}
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

export const SelectableCard = (): React.ReactElement => {
  const [isSelected, setIsSelected] = React.useState(true);

  return (
    <Box>
      <Text marginBottom="spacing.6">
        By passing the <Code size="medium">isSelected</Code> prop, the card will be highlighted.
      </Text>
      <Card
        shouldScaleOnHover
        isSelected={isSelected}
        onClick={() => {
          setIsSelected(!isSelected);
        }}
        accessibilityLabel="Payment Links Card"
        width={{ s: '100%', m: '400px' }}
      >
        <CardHeader>
          <CardHeaderLeading title="Payment Links" subtitle="Click the Card to toggle selection" />
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

      <Box display="flex" gap="spacing.5" flexDirection={{ xs: 'column', m: 'row' }}>
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
            <Amount marginBottom="spacing.1" value={0} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
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
            <Amount marginBottom="spacing.1" value={10} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
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
        >
          <CardBody>
            <HiddenInput
              onChange={(value) => setSelected(value)}
              value="premium"
              name="pricing-card"
            />
            <Amount marginBottom="spacing.1" value={20} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
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

      <Box display="flex" gap="spacing.5" flexDirection={{ xs: 'column', m: 'row' }}>
        <Card as="label" shouldScaleOnHover isSelected={selected.includes('free')}>
          <CardBody>
            <HiddenInput
              type="checkbox"
              onChange={(value) => handleChange(value)}
              value="free"
              name="pricing-card"
            />
            <Amount marginBottom="spacing.1" value={0} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
                Free
              </Text>
              <Text>
                For individuals or teams just getting started with payments. No setup fees, no
                monthly or annual fees.
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card as="label" shouldScaleOnHover isSelected={selected.includes('standard')}>
          <CardBody>
            <HiddenInput
              type="checkbox"
              onChange={(value) => handleChange(value)}
              value="standard"
              name="pricing-card"
            />
            <Amount marginBottom="spacing.1" value={10} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
                Standard
              </Text>
              <Text>
                For teams that are scaling up and need advanced features like payment failure.
              </Text>
            </Box>
          </CardBody>
        </Card>
        <Card as="label" shouldScaleOnHover isSelected={selected.includes('premium')}>
          <CardBody>
            <HiddenInput
              type="checkbox"
              onChange={(value) => handleChange(value)}
              value="premium"
              name="pricing-card"
            />
            <Amount marginBottom="spacing.1" value={20} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
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
            <Amount marginBottom="spacing.1" value={0} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
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
            <Amount marginBottom="spacing.1" value={10} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
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
            <Amount marginBottom="spacing.1" value={20} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
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
            <Amount marginBottom="spacing.1" value={0} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
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
            <Amount marginBottom="spacing.1" value={10} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
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
            <Amount marginBottom="spacing.1" value={20} currency="USD" size="heading-large-bold" />
            <Box paddingX="spacing.2">
              <Text marginBottom="spacing.3" size="large" type="subtle">
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

export const SingleSelectCard = (): React.ReactElement => {
  if (isReactNative()) {
    return <SingleSelectCardReactNative />;
  }
  return <SingleSelectCardWeb />;
};

export const MultiSelectCard = (): React.ReactElement => {
  if (isReactNative()) {
    return <MultiSelectCardReactNative />;
  }
  return <MultiSelectCardWeb />;
};
