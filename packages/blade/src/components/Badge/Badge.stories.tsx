import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title,
  Subtitle,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
  Description,
} from '@storybook/addon-docs';
import capitalize from 'lodash/capitalize';
import { Highlight, Link } from '@storybook/design-system';
import type { ReactElement } from 'react';
import type { BadgeProps } from './Badge';
import { Badge as BadgeComponent } from './Badge';
import { InfoIcon } from '~components/Icons';
import iconMap from '~components/Icons/iconMap';
import Box from '~components/Box';
import { Text as BladeText } from '~components/Typography';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';
import Sandbox from '~src/_helpers/storybook/Sandbox';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8110%3A417',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8110%3A417',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9727%3A118573',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9727%3A118573',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Badges are used to show small amount of color coded metadata, which are ideal for getting
        user attention.
      </Subtitle>
      <Link withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </Link>
      <br />
      <br />
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Badge } from '@razorpay/blade/components';
        import type { BadgeProps } from '@razorpay/blade/components';
        
        function App() {
          return <Badge>Boop</Badge>
        }

        export default App;
        `}
      </Sandbox>
      <Title>Example</Title>
      <Subtitle>
        This is the default badge. You can change the properties of this button using the controls
        in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Description markdown=">Note: `icon` prop accepts an `IconComponent` of Blade which should be used as:" />
      <Highlight language="tsx">{`import { Badge, InfoIcon } from '@razorpay/blade/components'; \n\n &ltBadge icon={InfoIcon}>Label&lt/Badge>`}</Highlight>
      <Stories />
    </>
  );
};

export default {
  title: 'Components/Badge',
  component: BadgeComponent,
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<BadgeProps>;

const BadgeTemplate: ComponentStory<typeof BadgeComponent> = ({ children, ...args }) => {
  return <BadgeComponent {...args}>{children}</BadgeComponent>;
};

export const Badge = BadgeTemplate.bind({});
Badge.args = {
  children: 'Label',
  variant: 'neutral',
  fontWeight: 'regular',
  contrast: 'low',
  size: 'small',
};
Badge.storyName = 'Default';

const BadgesWithVariantTemplate: ComponentStory<typeof BadgeComponent> = ({ ...args }) => {
  const variants = ['positive', 'negative', 'notice', 'information', 'neutral', 'blue'] as const;

  const getLabel = (label: string): string => {
    return args.fontWeight === 'bold' ? label.toUpperCase() : capitalize(label);
  };

  return (
    <Box display="flex" flexDirection="column">
      <BladeText>Low Contrast</BladeText>
      <Box
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {variants.map((variant) => (
          <Box key={variant} paddingRight="spacing.3" paddingTop="spacing.2">
            <BadgeComponent {...args} variant={variant} contrast="low">
              {getLabel(variant)}
            </BadgeComponent>
          </Box>
        ))}
      </Box>
      <BladeText>High Contrast</BladeText>
      <Box
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {variants.map((variant) => (
          <Box key={variant} paddingRight="spacing.3" paddingTop="spacing.2">
            <BadgeComponent {...args} variant={variant} contrast="high">
              {getLabel(variant)}
            </BadgeComponent>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const BadgeSmallSize = BadgesWithVariantTemplate.bind({});
BadgeSmallSize.args = {
  size: 'small',
};
BadgeSmallSize.storyName = 'Small Size';

export const BadgeMediumSize = BadgesWithVariantTemplate.bind({});
BadgeMediumSize.args = {
  size: 'medium',
};
BadgeMediumSize.storyName = 'Medium Size';

export const BadgeWithIcon = BadgesWithVariantTemplate.bind({});
BadgeWithIcon.args = {
  icon: InfoIcon,
};
BadgeWithIcon.parameters = {
  docs: {
    source: {
      code: `<Badge variant='positive' icon={InfoIcon}>Positive</Badge>
      \n<Badge variant='negative' icon={InfoIcon}>Negative</Badge>
      \n<Badge variant='notice' icon={InfoIcon}>Notice</Badge>
      \n<Badge variant='information' icon={InfoIcon}>Information</Badge>
      \n<Badge variant='neutral' icon={InfoIcon}>Neutral</Badge>`,
      language: 'jsx',
      type: 'code',
    },
  },
};
BadgeWithIcon.storyName = 'With Icon';

export const BadgeBold = BadgesWithVariantTemplate.bind({});
BadgeBold.args = {
  fontWeight: 'bold',
};
BadgeBold.storyName = 'Bold Font';
