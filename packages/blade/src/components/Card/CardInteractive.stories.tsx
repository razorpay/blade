/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-alert */
import type { Meta } from '@storybook/react';
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
import { Code, Text } from '~components/Typography';
import { RupeeIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Amount } from '~components/Amount';
import { isReactNative } from '~utils';

export default {
  title: 'Components/Card/Interactive',
  component: Card,
} as Meta<CardProps>;

const CardTemplate = ({ ...args }): React.ReactElement => {
  const [selected, setSelected] = React.useState(false);

  return (
    <Card
      onHover={() => {
        console.log('Hovered');
      }}
      scaleOnHover
      width={{ base: '400px', s: '100%' }}
      isSelected={selected}
      onClick={() => setSelected(!selected)}
      surfaceLevel={args.surfaceLevel}
      elevation={args.elevation}
      padding={args.padding}
    >
      <CardHeader>
        <CardHeaderLeading
          title="Card Header"
          subtitle="Card Header Subtitle"
          prefix={<CardHeaderIcon icon={RupeeIcon} />}
          suffix={<CardHeaderCounter value={12} />}
        />
        <CardHeaderTrailing visual={<CardHeaderBadge variant="positive">NEW</CardHeaderBadge>} />
      </CardHeader>
      <CardBody>
        <Text>Hello world</Text>
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
  return (
    <Box>
      <Box marginBottom="spacing.6">
        <Text>
          Cards can be made clickable by passing the <Code size="medium">onClick</Code> prop.
        </Text>
        <Text marginTop="spacing.3">
          If you have nested elements inside the card which have event listeners attached to it, by
          default the events will propagate to the parent element, if you want to stop the event you
          can use <Code size="medium">event.stopPropagation()</Code>.
        </Text>
      </Box>
      <Card onClick={() => alert('Card clicked')} width={{ base: '400px', s: '100%' }}>
        <CardHeader>
          <CardHeaderLeading title="Click the card" />
        </CardHeader>
        <CardBody>
          <Text>
            This button has <Code size="medium">event.stopPropagation()</Code>, and won't propogate
            to the parent element.
          </Text>
          <Button
            size="small"
            marginTop="spacing.5"
            onClick={(e) => {
              e.stopPropagation();
              alert('Child button clicked');
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
        By passing the <Code size="medium">scaleOnHover</Code> prop, the card will scale up on
        hover.
      </Text>
      <Card scaleOnHover width={{ base: '400px', s: '100%' }}>
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
      <Text marginBottom="spacing.6">
        Cards can be made linkable by passing the <Code size="medium">href</Code> prop, you will
        also need to pass the <Code size="medium">accessibilityLabel</Code> to make the link
        accessible to screen readers.
      </Text>
      <Card
        href="https://razorpay.com/payment-links"
        accessibilityLabel="Payment Links"
        scaleOnHover
        width={{ base: '400px', s: '100%' }}
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
        scaleOnHover
        isSelected={isSelected}
        onClick={() => {
          setIsSelected(!isSelected);
        }}
        width={{ base: '400px', s: '100%' }}
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
        To make a group of cards behave like radio buttons, you can use a hidden input and pass{' '}
        <Code size="medium">as="label"</Code> prop to the card.
      </Text>

      <Box display="flex" gap="spacing.5">
        <Card
          as="label"
          accessibilityLabel="Free Tier"
          scaleOnHover
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
          scaleOnHover
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
          scaleOnHover
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
      <Box display="flex" gap="spacing.5">
        <Card as="label" scaleOnHover isSelected={selected.includes('free')}>
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
        <Card as="label" scaleOnHover isSelected={selected.includes('standard')}>
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
        <Card as="label" scaleOnHover isSelected={selected.includes('premium')}>
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
        To make a group of cards behave like radio buttons, you can use a hidden input and pass{' '}
        <Code size="medium">as="label"</Code> prop to the card.
      </Text>

      <Box display="flex" gap="spacing.5">
        <Card
          onClick={() => setSelected('free')}
          accessibilityLabel="Free Tier"
          scaleOnHover
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
          scaleOnHover
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
          scaleOnHover
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
        To make a group of cards behave like radio buttons, you can use a hidden input and pass{' '}
        <Code size="medium">as="label"</Code> prop to the card.
      </Text>

      <Box display="flex" gap="spacing.5">
        <Card
          onClick={() => handleChange('free')}
          isSelected={selected.includes('free')}
          accessibilityLabel="Free Tier"
          scaleOnHover
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
          scaleOnHover
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
          scaleOnHover
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
