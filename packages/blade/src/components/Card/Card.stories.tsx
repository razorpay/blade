import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import type { CardSpacingValueType } from './types';
import type { CardFooterAction, CardProps } from './';
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
  CardHeaderIconButton,
  CardHeaderLink,
  CardHeaderAmount,
  CardHeaderText,
} from './';
import { Sandbox } from '~utils/storybook/Sandbox';

import { Heading, Text } from '~components/Typography';
import type { IconComponent } from '~components/Icons';
import { UsersIcon, TrashIcon, CheckCircleIcon } from '~components/Icons';

import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import iconMap from '~components/Icons/iconMap';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import type { Elevation } from '~tokens/global';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { TextInput } from '~components/Input/TextInput';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Card"
      componentDescription="Cards are used to group similar concepts and tasks together to make easier for merchants to scan, read, and get things done. In simpler words Cards help seprates content into sections. They are the surfaces that display content and actions on a single topic. They should be easy to scan for relevant and actionable information."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75857-127700&t=228BuziDJiPsRuIh-1&scaling=min-zoom&page-id=21248%3A307966&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import {
          Card,
          CardBody,
          CardFooter,
          CardFooterLeading,
          CardFooterTrailing,
          CardHeader,
          CardHeaderLeading,
          CardHeaderTrailing,
          CardHeaderIcon,
          CardHeaderCounter,
          CardHeaderBadge,
          CardHeaderIconButton,
          InfoIcon,
          Text
        } from '@razorpay/blade/components';

        function App() {
          return (
            <Card>
              <CardHeader>
                <CardHeaderLeading
                  title="Card Header"
                  subtitle="Subtitle"
                  prefix={<CardHeaderIcon icon={InfoIcon} />}
                  suffix={<CardHeaderCounter value={12} />}
                />
                <CardHeaderTrailing visual={<CardHeaderBadge variant="positive">NEW</CardHeaderBadge>} />
              </CardHeader>
              <CardBody>
                <Text>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                  been the industry's standard dummy text ever since the 1500s, when an unknown printer took
                  a galley of type and scrambled it to make a type specimen book. It has survived not only
                  five centuries, but also the leap into electronic typesetting, remaining essentially
                  unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
                  Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
                  PageMaker including versions of Lorem Ipsum.
                </Text>
              </CardBody>
              <CardFooter>
                <CardFooterLeading title="Card footer title" subtitle="Subtitle" />
                <CardFooterTrailing
                  actions={{
                    primary: {
                      onClick: () => console.log("Primary action clicked"),
                      text: 'Accept',
                    },
                    secondary: {
                      onClick: () => console.log("Secondary action clicked"),
                      text: 'Cancel',
                    },
                  }}
                />
              </CardFooter>
            </Card>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  CARD: 'Card Props',
  CARD_HEADER: 'Header Props',
  CARD_HEADER_LEADING: 'Header Leading Props',
  CARD_HEADER_TRAILING: 'Header Trailing Props',
  CARD_FOOTER: 'Footer Props',
  CARD_FOOTER_LEADING: 'Footer Leading Props',
  CARD_FOOTER_TRAILING: 'Footer Trailing Props',
};

type StoryControlProps = {
  backgroundColor: CardProps['backgroundColor'];
  borderRadius: CardProps['borderRadius'];
  elevation: keyof Elevation;
  padding: CardSpacingValueType;
  headerTitle: string;
  headerSubtitle: string;
  headerMarginBottom: CardSpacingValueType;
  headerPaddingBottom: CardSpacingValueType;
  prefix: IconComponent;
  suffix: number;
  visual: React.ReactNode;
  body: React.ReactNode;
  footerTitle: string;
  footerSubtitle: string;
  footerMarginTop: CardSpacingValueType;
  footerPaddingTop: CardSpacingValueType;
  footerPrimaryAction: CardFooterAction;
  footerSecondaryAction: CardFooterAction;
};

const spacingValueOptions: CardSpacingValueType[] = [
  'spacing.0',
  'spacing.3',
  'spacing.4',
  'spacing.5',
  'spacing.7',
];

const visual = {
  Link: <CardHeaderLink href="/">Learn more</CardHeaderLink>,
  Text: <CardHeaderText>$100</CardHeaderText>,
  IconButton: <CardHeaderIconButton icon={TrashIcon} />,
  Badge: <CardHeaderBadge color="positive">NEW</CardHeaderBadge>,
  Amount: <CardHeaderAmount value={1000} />,
};

export default {
  title: 'Components/Card',
  component: Card,
  args: {
    backgroundColor: 'surface.background.gray.intense',
    borderRadius: 'medium',
    elevation: 'lowRaised',
    padding: 'spacing.7',
    headerTitle: 'Payment Links',
    headerSubtitle: 'Share payment link via an email, SMS, messenger, chatbot etc.',
    headerPaddingBottom: 'spacing.4',
    headerMarginBottom: 'spacing.4',
    footerTitle: 'Built for Developers',
    footerSubtitle: 'By Developers.',
    footerMarginTop: 'spacing.4',
    footerPaddingTop: 'spacing.4',
    body:
      'Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.',
    footerPrimaryAction: {
      text: 'Learn More',
      onClick: () => {
        console.log('Primary Action Clicked');
      },
      isDisabled: false,
      icon: undefined,
      accessibilityLabel: undefined,
      iconPosition: undefined,
      isLoading: false,
      type: undefined,
    },
    footerSecondaryAction: {
      text: 'Try Demo',
      onClick: () => {
        console.log('Secondary Action Clicked');
      },
      isDisabled: false,
      icon: undefined,
      accessibilityLabel: undefined,
      iconPosition: undefined,
      isLoading: false,
      type: undefined,
    },
    prefix: ('LinkIcon' as unknown) as IconComponent,
    suffix: 12,
    visual: 'Badge',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      table: { category: propsCategory.CARD },
    },
    borderRadius: {
      table: { category: propsCategory.CARD },
    },
    elevation: {
      table: { category: propsCategory.CARD },
    },
    padding: {
      table: { category: propsCategory.CARD },
    },
    headerTitle: {
      table: { category: propsCategory.CARD_HEADER_LEADING },
    },
    headerSubtitle: {
      table: { category: propsCategory.CARD_HEADER_LEADING },
    },
    headerMarginBottom: {
      table: { category: propsCategory.CARD_HEADER },
      control: {
        type: 'radio',
        options: spacingValueOptions,
      },
    },
    headerPaddingBottom: {
      table: { category: propsCategory.CARD_HEADER },
      control: {
        type: 'radio',
        options: spacingValueOptions,
      },
    },
    prefix: {
      control: {
        type: 'select',
      },
      mapping: iconMap,
      options: Object.keys(iconMap),
      table: {
        category: propsCategory.CARD_HEADER_LEADING,
      },
    },
    suffix: {
      control: {
        type: 'number',
      },
      table: { category: propsCategory.CARD_HEADER_LEADING },
    },
    visual: {
      control: {
        type: 'select',
      },
      mapping: visual,
      options: Object.keys(visual),
      table: {
        category: propsCategory.CARD_HEADER_LEADING,
      },
    },
    footerTitle: {
      table: { category: propsCategory.CARD_FOOTER_LEADING },
    },
    footerSubtitle: {
      table: { category: propsCategory.CARD_FOOTER_LEADING },
    },
    footerMarginTop: {
      table: { category: propsCategory.CARD_FOOTER },
      control: {
        type: 'radio',
        options: spacingValueOptions,
      },
    },
    footerPaddingTop: {
      table: { category: propsCategory.CARD_FOOTER },
      control: {
        type: 'radio',
        options: spacingValueOptions,
      },
    },
    footerPrimaryAction: {
      table: { category: propsCategory.CARD_FOOTER_TRAILING },
    },
    footerSecondaryAction: {
      table: { category: propsCategory.CARD_FOOTER_TRAILING },
    },
    ...getStyledPropsArgTypes(),
  },

  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<StoryControlProps>;

const CardTemplate = ({ ...args }: StoryControlProps): React.ReactElement => {
  return (
    <Card
      borderRadius={args.borderRadius}
      backgroundColor={args.backgroundColor}
      elevation={args.elevation}
      padding={args.padding}
    >
      <CardHeader paddingBottom={args.headerPaddingBottom} marginBottom={args.headerMarginBottom}>
        <CardHeaderLeading
          title={args.headerTitle}
          subtitle={args.headerSubtitle}
          prefix={args.prefix && <CardHeaderIcon icon={args.prefix} />}
          suffix={args.suffix && <CardHeaderCounter value={args.suffix} />}
        />
        <CardHeaderTrailing visual={args.visual} />
      </CardHeader>
      <CardBody>
        <Text>{args.body}</Text>
      </CardBody>
      <CardFooter paddingTop={args.footerPaddingTop} marginTop={args.footerMarginTop}>
        <CardFooterLeading title={args.footerTitle} subtitle={args.footerSubtitle} />
        <CardFooterTrailing
          actions={{
            primary: args.footerPrimaryAction,
            secondary: args.footerSecondaryAction,
          }}
        />
      </CardFooter>
    </Card>
  );
};

export const CardExample = CardTemplate.bind({});
export const FigmaExample = CardTemplate.bind({});
// @ts-expect-error: storybook thinks it does exist but it does
FigmaExample.args = {
  headerTitle: 'Header Title',
  headerSubtitle: 'Header Subtitle',
  prefix: CheckCircleIcon,
  footerTitle: 'Footer Title',
  footerSubtitle: 'Footer Subtitle',
};

const CardChildrenExample = ({ ...args }: StoryControlProps): React.ReactElement => {
  return (
    <Card backgroundColor={args.backgroundColor}>
      <CardHeader>
        <CardHeaderLeading
          title="Profile Information"
          subtitle="We will use this information to keep your account updated"
          prefix={<CardHeaderIcon icon={UsersIcon} />}
        />
        <CardHeaderTrailing visual={<CardHeaderIconButton icon={TrashIcon} />} />
      </CardHeader>
      <CardBody>
        <BaseBox display="flex" flexDirection="row" gap="spacing.5">
          <BaseBox flex={1}>
            <TextInput
              label="First Name"
              isRequired
              necessityIndicator="required"
              placeholder="Enter your first name"
            />
          </BaseBox>
          <BaseBox flex={1}>
            <TextInput
              label="Last Name"
              isRequired
              necessityIndicator="required"
              placeholder="Enter your last name"
            />
          </BaseBox>
        </BaseBox>
        <BaseBox marginTop="spacing.5" />
        <TextInput
          label="Address Line 1"
          isRequired
          placeholder="Apartment name, number, suite, etc."
          necessityIndicator="required"
        />
        <BaseBox marginTop="spacing.5" />
        <TextInput label="Address Line 2" isRequired placeholder="Area, Locality, etc." />
        <BaseBox marginTop="spacing.5" />
        <BaseBox display="flex" flexDirection="row" gap="spacing.5">
          <BaseBox flex={1}>
            <TextInput
              label="Postal Code"
              isRequired
              necessityIndicator="required"
              placeholder="Zipcode"
            />
          </BaseBox>
          <BaseBox flex={1}>
            <TextInput
              label="Country"
              isRequired
              necessityIndicator="required"
              placeholder="Country"
            />
          </BaseBox>
        </BaseBox>
        <BaseBox marginTop="spacing.5" />
        <TextInput
          label="Mobile Number"
          necessityIndicator="optional"
          placeholder="Area, Locality, etc."
        />
      </CardBody>
      <CardFooter>
        <CardFooterLeading subtitle="Last updated on 20th Sep 2022" />
        <CardFooterTrailing
          actions={{
            primary: {
              text: 'Save Details',
              onClick: () => console.log('Saved'),
            },
            secondary: {
              text: 'Reset',
              onClick: () => console.log('Reset'),
            },
          }}
        />
      </CardFooter>
    </Card>
  );
};

export const CardBodyContent = CardChildrenExample.bind({});

const CardWithoutPaddingExample: StoryFn<typeof Card> = (): React.ReactElement => {
  return (
    <Card elevation="highRaised" padding="spacing.0">
      <CardBody>
        <Box display="flex" flexDirection="row">
          <img
            width="300"
            height="auto"
            src="https://d6xcmfyh68wv8.cloudfront.net/assets/case-studies/common-card/pg_breathingroom.png"
            alt="Breathing Room"
            style={{ borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}
          />
          <Box padding="spacing.7" display="flex" flexDirection="column">
            <Heading size="large">Breathing Room</Heading>
            <Text marginTop="spacing.5">
              Popular in the startup ecosystem, BreathingRoom.co offers short-term workspaces
              conference rooms, training rooms, cabins & hotdesks to individuals and enterprises on
              an hourly & monthly basis. BreathingRoom is perfect for a wide range of professional
              needs like training sessions, recruitment drives, team offsites, and client meetings
              in addition to cost effective office space rentals; great for setting up remote
              offices. With a network of over 450 office spaces spread across Mumbai, Delhi,
              Bangalore, Pune, Hyderabad and Chennai, BreathingRoom offers convenient, flexible
              rental options that can be easily booked through the website or mobile app.
            </Text>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export const CardWithoutPadding = CardWithoutPaddingExample.bind({});
CardWithoutPadding.parameters = {
  controls: {
    disable: true,
  },
};

// Hidden example. It is reused in motion stories
export const InternalCardExample = React.forwardRef((_, ref) => {
  return (
    <Card
      ref={ref as never}
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
      elevation="lowRaised"
      padding="spacing.7"
      width="300px"
      marginRight="spacing.6"
      href="https://razorpay.com"
    >
      <CardHeader marginBottom="spacing.4" paddingBottom="spacing.4">
        <CardHeaderLeading
          prefix={<CardHeaderIcon icon={CheckCircleIcon} />}
          subtitle="Share payment link via an email, SMS, messenger, chatbot etc."
          suffix={<CardHeaderCounter value={12} />}
          title="Payment Links"
        />
        <CardHeaderTrailing visual={<CardHeaderBadge color="positive">NEW</CardHeaderBadge>} />
      </CardHeader>
      <CardBody>
        <Text position="relative" zIndex={1}>
          Create Razorpay Payments Links and share them with your customers from the Razorpay
          Dashboard or using APIs and start accepting payments. Check the advantages, payment
          methods, international currency support and more.
        </Text>
      </CardBody>
      <CardFooter marginTop="spacing.4" paddingTop="spacing.4">
        <CardFooterTrailing
          actions={{
            primary: {
              accessibilityLabel: undefined,
              icon: undefined,
              iconPosition: undefined,
              isDisabled: false,
              isLoading: false,
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick: () => {},
              text: 'Learn More',
              type: undefined,
            },
          }}
        />
      </CardFooter>
    </Card>
  );
});
