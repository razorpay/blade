import type { ComponentStory, Meta } from '@storybook/react';
import capitalize from 'lodash/capitalize';
import { Title } from '@storybook/addon-docs';
import type { BadgeProps } from './Badge';
import { Badge as BadgeComponent } from './Badge';
import { InfoIcon } from '~components/Icons';
import iconMap from '~components/Icons/iconMap';
import BaseBox from '~components/Box/BaseBox';
import { Text as BladeText } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8110%3A417',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9727%3A118573',
      }}
      componentName="Badge"
      componentDescription="Badges are used to show small amount of color coded metadata, which are ideal for getting user attention."
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Badge, InfoIcon } from '@razorpay/blade/components';
        
        function App(): React.ReactElement {
          return (
            <Badge variant="neutral" icon={InfoIcon}>
              Boop
            </Badge>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Badge',
  component: BadgeComponent,
  argTypes: {
    ...getStyledPropsArgTypes(),
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
    <BaseBox display="flex" flexDirection="column">
      <BladeText>Low Contrast</BladeText>
      <BaseBox
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {variants.map((variant) => (
          <BadgeComponent
            {...args}
            variant={variant}
            contrast="low"
            key={variant}
            marginRight="spacing.3"
            marginTop="spacing.2"
          >
            {getLabel(variant)}
          </BadgeComponent>
        ))}
      </BaseBox>
      <BladeText>High Contrast</BladeText>
      <BaseBox
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {variants.map((variant) => (
          <BadgeComponent
            {...args}
            variant={variant}
            contrast="high"
            key={variant}
            marginRight="spacing.3"
            marginTop="spacing.2"
          >
            {getLabel(variant)}
          </BadgeComponent>
        ))}
      </BaseBox>
    </BaseBox>
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

export const BadgeLargeSize = BadgesWithVariantTemplate.bind({});
BadgeLargeSize.args = {
  size: 'large',
};
BadgeLargeSize.storyName = 'Large Size';

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
