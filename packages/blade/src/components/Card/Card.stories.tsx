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
  CardHeaderBox,
  CardHeaderButton,
} from './';
import { Sandbox } from '~utils/storybook/Sandbox';

import { Heading, Text } from '~components/Typography';
import type { IconComponent } from '~components/Icons';
import {
  UsersIcon,
  TrashIcon,
  CheckCircleIcon,
  ArrowSquareUpIcon,
  PlusIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
  MoreVerticalIcon,
  EditIcon,
  EyeIcon,
} from '~components/Icons';
import { useIsMobile } from '~utils/useIsMobile';

import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import iconMap from '~components/Icons/iconMap';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import type { Elevation } from '~tokens/global';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { TextInput } from '~components/Input/TextInput';
import { Amount } from '~components/Amount';
import { Button } from '~components/Button';
import { BottomSheet, BottomSheetBody } from '~components/BottomSheet';
import { ActionList, ActionListItem, ActionListItemIcon } from '~components/ActionList';

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
                <CardHeaderTrailing visual={<CardHeaderBadge color="positive">NEW</CardHeaderBadge>} />
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

const CardWithoutPaddingExample: StoryFn<typeof Card> = (args): React.ReactElement => {
  return (
    <Card {...args}>
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

CardWithoutPadding.args = {
  elevation: 'highRaised',
  padding: 'spacing.0',
};

export const CardWithMaxWidth = CardWithoutPaddingExample.bind({});
CardWithMaxWidth.args = {
  maxWidth: '800px',
  padding: 'spacing.0',
};

const GraphSVG = (): React.ReactElement => {
  return (
    <Box width="100%" height="100%" display="flex" alignItems="center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 546 139"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.09"
          d="M32.9065 100.629L2 98.949V138.237H544V40.7617L510.041 42.2896C508.598 42.3545 507.171 42.6144 505.798 43.0623L475.74 52.867C473.114 53.7237 470.31 53.8858 467.603 53.3377L436.728 47.0865C435.977 46.9345 435.216 46.8366 434.451 46.7936L402.384 44.9901C400.455 44.8816 398.522 45.1234 396.68 45.7038L367.358 54.9386C364.72 55.7694 361.912 55.9023 359.207 55.3243L330.544 49.1985C328.34 48.7274 326.06 48.7274 323.856 49.1985L291.067 56.2061L257.144 68.0347C255.678 68.5458 254.146 68.8408 252.595 68.9106L222.608 70.2598C220.104 70.3724 217.609 69.8954 215.324 68.8671L192.115 58.4249C186.366 55.8383 179.634 56.8685 174.922 61.0558L150.475 82.7792C147.915 85.0541 144.692 86.4476 141.281 86.7545L113.756 89.2313C111.543 89.4305 109.313 89.1664 107.207 88.4558L81.6226 79.8226C76.9776 78.2552 71.8704 78.9037 67.7646 81.5823L42.5174 98.0533C39.669 99.9116 36.3025 100.814 32.9065 100.629Z"
          fill="#305EFF"
        />
        <path
          d="M2 98.949L32.9065 100.629C36.3025 100.814 39.669 99.9116 42.5174 98.0533L67.7646 81.5823C71.8704 78.9037 76.9776 78.2552 81.6226 79.8226L107.207 88.4558C109.313 89.1664 111.543 89.4305 113.756 89.2313L141.281 86.7545C144.692 86.4476 147.915 85.0541 150.475 82.7792L174.922 61.0558C179.634 56.8685 186.366 55.8383 192.115 58.4249L215.324 68.8671C217.609 69.8954 220.104 70.3724 222.608 70.2598L252.595 68.9106C254.146 68.8408 255.678 68.5458 257.144 68.0347L291.067 56.2061L323.856 49.1985C326.06 48.7274 328.34 48.7274 330.544 49.1985L359.207 55.3243C361.912 55.9023 364.72 55.7694 367.358 54.9386L396.679 45.7038C398.522 45.1234 400.455 44.8816 402.384 44.9901L434.451 46.7936C435.216 46.8366 435.977 46.9345 436.728 47.0865L467.603 53.3377C470.31 53.8858 473.114 53.7237 475.74 52.867L505.798 43.0623C507.171 42.6144 508.598 42.3545 510.041 42.2896L544 40.7617"
          stroke="#305EFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </Box>
  );
};

const MetricInfo = (): React.ReactElement => {
  return (
    <CardHeaderBox display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
      <Amount
        value={1000}
        color="surface.text.gray.normal"
        weight="semibold"
        size="2xlarge"
        type="heading"
      />
      <Box
        display="flex"
        flexDirection="row"
        gap="spacing.1"
        alignItems="center"
        justifyContent="center"
      >
        <ArrowSquareUpIcon color="interactive.icon.positive.normal" />

        <Text color="interactive.text.positive.normal">12</Text>
      </Box>
    </CardHeaderBox>
  );
};

const MetricCardVariantExample = (): React.ReactElement => {
  const isMobile = useIsMobile();
  return (
    <Card backgroundColor="surface.background.gray.intense" maxWidth="500px" minWidth="300px">
      <CardHeader showDivider={false}>
        <CardHeaderLeading
          title={isMobile ? 'TPV' : 'Total Payment Volume'}
          subtitle={
            isMobile ? 'TPV for the current month' : 'Total Payment Volume for the current month'
          }
          toolTipTittle="Total Payment Volume"
          slot={isMobile ? undefined : <MetricInfo />}
        />
        <CardHeaderTrailing
          visual={
            isMobile ? (
              <CardHeaderLink href="/" icon={ArrowRightIcon} iconPosition="right">
                Chart settings
              </CardHeaderLink>
            ) : (
              <CardHeaderBadge color="positive"> New </CardHeaderBadge>
            )
          }
        />
      </CardHeader>
      <CardBody>
        {isMobile ? (
          <Box display="flex" flexDirection="row" gap="spacing.5">
            <Box display="flex" flexDirection="column" justifyContent="flex-end">
              <MetricInfo />
            </Box>
            <GraphSVG />
          </Box>
        ) : (
          <GraphSVG />
        )}
      </CardBody>
    </Card>
  );
};

export const MetricCardVariant = MetricCardVariantExample.bind({});

const LayoutCardVariantExample = (): React.ReactElement => {
  const isMobile = useIsMobile();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);
  return (
    <Card backgroundColor="surface.background.gray.intense" maxWidth="700px" minWidth="300px">
      <CardHeader showDivider={false}>
        <CardHeaderLeading
          title={isMobile ? 'TPV' : 'Total Payment Volume'}
          subtitle={
            isMobile ? 'TPV for the current month' : 'Total Payment Volume for the current month'
          }
          suffix={
            <CardHeaderLink
              href="https://www.google.com/search?q=what+is+total+payment+volume"
              target="_blank"
              icon={ExternalLinkIcon}
              iconPosition="right"
            >
              Learn more
            </CardHeaderLink>
          }
        />
        <CardHeaderTrailing
          visual={
            <CardHeaderBox display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
              {isMobile ? (
                <Box>
                  <Button
                    accessibilityLabel="View More Options"
                    icon={MoreVerticalIcon}
                    onClick={() => setIsBottomSheetOpen(true)}
                    variant="tertiary"
                  />
                  <BottomSheet
                    isOpen={isBottomSheetOpen}
                    onDismiss={() => setIsBottomSheetOpen(false)}
                    // Optional: Define custom snap points (heights) for the sheet
                    snapPoints={[0.35, 0.5, 0.85]}
                  >
                    <BottomSheetBody>
                      <ActionList>
                        <ActionListItem
                          title="View Dashboard"
                          value="view-dashboard"
                          trailing={<ActionListItemIcon icon={EyeIcon} />}
                        />
                        <ActionListItem
                          trailing={<ActionListItemIcon icon={EditIcon} />}
                          title="Edit Chart"
                          value="edit-chart"
                        />
                      </ActionList>
                    </BottomSheetBody>
                  </BottomSheet>
                </Box>
              ) : (
                <CardHeaderButton variant="secondary" icon={PlusIcon}>
                  View
                </CardHeaderButton>
              )}

              <CardHeaderButton variant="primary" icon={PlusIcon}>
                Add
              </CardHeaderButton>
            </CardHeaderBox>
          }
        />
      </CardHeader>
      <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <GraphSVG />
        </Box>
      </CardBody>
    </Card>
  );
};

export const LayoutCardVariant = LayoutCardVariantExample.bind({});
