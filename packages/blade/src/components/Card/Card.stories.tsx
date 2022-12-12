import type { Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
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
  CardHeaderText,
} from './Card';
import type { CardFooterAction } from './CardFooter';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';

import { Text } from '~components/Typography';
import type { IconComponent } from '~components/Icons';
import { TrashIcon } from '~components/Icons';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import iconMap from '~components/Icons/iconMap';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Card"
      componentDescription="Cards are used to group similar concepts and tasks together to make easier for merchants to scan, read, and get things done. In simpler words Cards help seprates content into sections. They are the surfaces that display content and actions on a single topic. They should be easy to scan for relevant and actionable information."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=21248%3A400833&t=ZCWT255jVK78xf1J-4',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=12791%3A336279&t=ZCWT255jVK78xf1J-4',
      }}
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
                      onClick: () => console.log(1),
                      text: 'Accept',
                    },
                    secondary: {
                      onClick: () => console.log(1),
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
  CARD_HEADER_LEADING: 'Header Leading Props',
  CARD_HEADER_TRAILING: 'Header Trailing Props',
  CARD_FOOTER_LEADING: 'Footer Leading Props',
  CARD_FOOTER_TRAILING: 'Footer Trailing Props',
};

type StoryControlProps = {
  surfaceLevel: 2;
  headerTitle: string;
  headerSubtitle: string;
  prefix: IconComponent;
  suffix: number;
  visual: React.ReactNode;
  body: string;
  footerTitle: string;
  footerSubtitle: string;
  footerPrimaryAction: CardFooterAction;
  footerSecondaryAction: CardFooterAction;
};

const visual = {
  Link: <CardHeaderLink href="/">Learn more</CardHeaderLink>,
  Text: <CardHeaderText>$100</CardHeaderText>,
  IconButton: <CardHeaderIconButton icon={TrashIcon} />,
  Badge: <CardHeaderBadge variant="positive">NEW</CardHeaderBadge>,
};

export default {
  title: 'Components/Card',
  component: Card,
  args: {
    surfaceLevel: 2,
    headerTitle: 'Payment Links',
    headerSubtitle: 'Share payment link via an email, SMS, messenger, chatbot etc.',
    footerTitle: 'Built for Developers',
    footerSubtitle: 'By Developers.',
    body:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    footerPrimaryAction: {
      text: 'Learn More',
      onClick: () => {
        console.log('Primary');
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
        console.log('Secondary');
      },
      isDisabled: false,
      icon: undefined,
      accessibilityLabel: undefined,
      iconPosition: undefined,
      isLoading: false,
      type: undefined,
    },
  },
  argTypes: {
    surfaceLevel: {
      table: { category: propsCategory.CARD },
    },
    headerTitle: {
      table: { category: propsCategory.CARD_HEADER_LEADING },
    },
    headerSubtitle: {
      table: { category: propsCategory.CARD_HEADER_LEADING },
    },
    prefix: {
      control: {
        type: 'select',
      },
      mapping: iconMap,
      options: Object.keys(iconMap),
      defaultValue: 'LinkIcon',
      table: {
        category: propsCategory.CARD_HEADER_LEADING,
      },
    },
    suffix: {
      control: {
        type: 'number',
      },
      defaultValue: 12,
      table: { category: propsCategory.CARD_HEADER_LEADING },
    },
    visual: {
      control: {
        type: 'select',
      },
      mapping: visual,
      options: Object.keys(visual),
      defaultValue: 'Badge',
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
    footerPrimaryAction: {
      table: { category: propsCategory.CARD_FOOTER_TRAILING },
    },
    footerSecondaryAction: {
      table: { category: propsCategory.CARD_FOOTER_TRAILING },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<StoryControlProps>;

const CardTemplate = ({ ...args }: StoryControlProps): React.ReactElement => {
  return (
    <Card surfaceLevel={args.surfaceLevel}>
      <CardHeader>
        <CardHeaderLeading
          title={args.headerTitle}
          subtitle={args.headerSubtitle}
          prefix={<CardHeaderIcon icon={args.prefix} />}
          suffix={<CardHeaderCounter value={args.suffix} />}
        />
        <CardHeaderTrailing visual={args.visual} />
      </CardHeader>
      <CardBody>
        <Text>{args.body}</Text>
      </CardBody>
      <CardFooter>
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
