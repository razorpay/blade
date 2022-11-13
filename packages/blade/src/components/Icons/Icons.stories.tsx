import type { ComponentType, ReactElement } from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import iconMap from './iconMap';
import type { IconProps } from '.';
import { CreditCardIcon } from '.';
import Box from '~components/Box';
import { Text } from '~components/Typography';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import Sandbox from '~src/_helpers/storybook/Sandbox';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="We provide a bunch of icons out-of-the-box for Blade in 6 different sizes. You can choose which size & color fits the best for your use case using the color & size props."
      componentName="Icon"
      note="For now, we have added only a few icons but you can contribute to Blade by adding more icons that are available on the Figma board as and when a use-case arises"
      imports={`// Replace IconName with actual Icon's name that you would like to use \nimport { IconName } from '@razorpay/blade/components' \n// IconProps are generic Icon props for all icons, don't replace it with your IconName \nimport type { IconProps } from '@razorpay/blade/components'`}
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=59%3A177',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9308%3A64839',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Button, ArrowRightIcon } from '@razorpay/blade/components';

        function App(): JSX.Element {
          // Icon component is meant to be used inside \`icon\` prop 
          // along with other components like \`Button\`, \`Badge\`, etc
          return (
            <Button 
              icon={ArrowRightIcon}
              iconPosition="right"
            >
              Button with Icon
            </Button>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Icons',
  component: CreditCardIcon, // need to give it some icon component so that storybook can infer props & arg types
  args: {
    color: 'feedback.icon.neutral.lowContrast',
    size: 'medium',
  },
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
    },
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
} as Meta<IconProps>;

const IconTemplate: ComponentStory<ComponentType<IconProps & { icon?: string }>> = ({
  icon,
  ...args
}) => {
  if (icon) {
    const IconComponent = iconMap[icon];
    return <IconComponent {...args} />;
  }
  return (
    <Box>
      {Object.keys(iconMap).map((icon, key) => {
        const IconComponent = iconMap[icon];
        return (
          <Box
            height={95}
            width={125}
            display="inline-flex"
            flexDirection="column"
            alignItems="center"
            gap="spacing.6"
            key={key}
          >
            <IconComponent {...args} />
            <Text size="small">{icon}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

export const Icon = IconTemplate.bind({});
Icon.args = {
  icon: undefined,
};
