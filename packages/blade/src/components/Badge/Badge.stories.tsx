import type { StoryFn, Meta } from '@storybook/react';
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
      componentName="Badge"
      componentDescription="Badges are used to show small amount of color coded metadata, which are ideal for getting user attention."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=73941-78445&t=pjKzaOWOoMI2J9jb-1&scaling=min-zoom&page-id=8110%3A0&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Badge, InfoIcon } from '@razorpay/blade/components';
        
        function App() {
          return (
            <Badge color="neutral" icon={InfoIcon}>
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
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    icon: {
      name: 'icon',
      // weird TS error
      type: 'select' as 'string',
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

const BadgeTemplate: StoryFn<typeof BadgeComponent> = ({ children, ...args }) => {
  return <BadgeComponent {...args}>{children}</BadgeComponent>;
};

export const Badge = BadgeTemplate.bind({});
Badge.args = {
  children: 'Label',
  color: 'neutral',
  size: 'small',
};
Badge.storyName = 'Default';

const BadgesWithVariantTemplate: StoryFn<typeof BadgeComponent> = ({ ...args }) => {
  const variants = ['positive', 'negative', 'notice', 'information', 'neutral', 'primary'] as const;

  return (
    <BaseBox display="flex" flexDirection="column">
      <BladeText>Subtle Emphasis</BladeText>
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
            color={variant}
            key={variant}
            emphasis="subtle"
            marginRight="spacing.3"
            marginTop="spacing.2"
          >
            {variant}
          </BadgeComponent>
        ))}
      </BaseBox>
      <BladeText>Intense Emphasis</BladeText>
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
            color={variant}
            key={variant}
            emphasis="intense"
            marginRight="spacing.3"
            marginTop="spacing.2"
          >
            {variant}
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
