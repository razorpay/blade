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
import { RupeeIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Amount } from '~components/Amount';
import { isReactNative } from '~utils';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Badge } from '~components/Badge';
import { Radio, RadioGroup } from '~components/Radio';
import { Checkbox, CheckboxGroup } from '~components/Checkbox';

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

      <Box display="flex" gap="spacing.5" flexDirection={{ xs: 'column', m: 'row' }}>
        <Card as="label" shouldScaleOnHover isSelected={selected.includes('free')}>
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
        <Card as="label" shouldScaleOnHover isSelected={selected.includes('standard')}>
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
        <Card as="label" shouldScaleOnHover isSelected={selected.includes('premium')}>
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

const RadioCard = ({ value, label }: { value: string; label: string }) => {
  return (
    <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="flex-start">
      <Radio value={value} />
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Box display="flex" flexDirection="row" gap="spacing.4">
          <Text weight="semibold">{label}</Text>
          <Badge color="positive">Issued</Badge>
        </Box>
        <Box display="flex" flexDirection="row" gap="spacing.4">
          <Text size="small">13 Aug’23</Text>
          <Amount size="small" value={1000} />
          <Text size="small">Un-billed/₹1,000</Text>
        </Box>
      </Box>
    </Box>
  );
};

export const SingleSelectWithRadio = (): React.ReactElement => {
  const [selected, setSelected] = React.useState('P0');

  const onChange = (value: string) => {
    setSelected(value);
  };

  return (
    <Box display="flex" gap="spacing.5" flexDirection={{ xs: 'column', m: 'column' }}>
      <Text>⚡️ 1 open PO(s) detected against Vendor Name, Selected: {selected}</Text>

      <RadioGroup value={selected} onChange={({ value }) => onChange(value)}>
        <Card
          as="label"
          accessibilityLabel="PO Issue 1234"
          isSelected={selected === 'P0'}
          marginBottom="spacing.2"
        >
          <CardBody>
            <RadioCard value="P0" label="P0#123" />
          </CardBody>
        </Card>
        <Card
          as="label"
          accessibilityLabel="P1 Issue 123"
          isSelected={selected === 'P1'}
          marginBottom="spacing.2"
        >
          <CardBody>
            <RadioCard value="P1" label="P1#123" />
          </CardBody>
        </Card>
        <Card as="label" accessibilityLabel="P2 Issue 123" isSelected={selected === 'P2'}>
          <CardBody>
            <RadioCard value="P2" label="P2#123" />
          </CardBody>
        </Card>
      </RadioGroup>
    </Box>
  );
};

const CheckboxCard = ({ value, label }: { value: string; label: string }) => {
  return (
    <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="flex-start">
      <Checkbox value={value} />
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Box display="flex" flexDirection="row" gap="spacing.4">
          <Text weight="medium">{label}</Text>
          <Badge color="positive">Issued</Badge>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.4">
          <Text size="small">13 Aug’23</Text>
          <Amount size="small" weight="medium" value={1000} />
          <Text size="small">Un-billed | ₹1,000</Text>
        </Box>
      </Box>
    </Box>
  );
};

export const MultiSelectSelectWithCheckbox = (): React.ReactElement => {
  const [selected, setSelected] = React.useState(['P0']);

  const onChange = (value: string[]) => {
    setSelected(value);
  };

  return (
    <Box display="flex" gap="spacing.5" flexDirection={{ xs: 'column', m: 'column' }}>
      <Text>⚡️ 1 open PO(s) detected against Vendor Name, Selected: {selected.join(', ')}</Text>

      <CheckboxGroup value={selected} onChange={({ values }) => onChange(values)}>
        <Card
          as="label"
          accessibilityLabel="PO Issue 1234"
          isSelected={selected.includes('P0')}
          marginBottom="spacing.2"
        >
          <CardBody>
            <CheckboxCard value="P0" label="P0#123" />
          </CardBody>
        </Card>
        <Card
          as="label"
          accessibilityLabel="P1 Issue 123"
          isSelected={selected.includes('P1')}
          marginBottom="spacing.2"
        >
          <CardBody>
            <CheckboxCard value="P1" label="P1#123" />
          </CardBody>
        </Card>
        <Card as="label" accessibilityLabel="P2 Issue 123" isSelected={selected.includes('P2')}>
          <CardBody>
            <CheckboxCard value="P2" label="P2#123" />
          </CardBody>
        </Card>
      </CheckboxGroup>
    </Box>
  );
};
