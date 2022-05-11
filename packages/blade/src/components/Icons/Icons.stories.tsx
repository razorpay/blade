import type { ComponentType } from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title,
  Subtitle,
  Primary,
  Stories,
  PRIMARY_STORY,
  Description,
  Props,
} from '@storybook/addon-docs';
import { Highlight, Link } from '@storybook/design-system';
import iconMap from './iconMap';
import type { IconProps } from '.';
import { CreditCardIcon } from '.';

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
      page: () => (
        <>
          <Title />
          <Subtitle>
            We provide a bunch of icons out-of-the-box for Blade in 6 different sizes. You can
            choose which size & color fits the best for your use case using the color & size props.
          </Subtitle>
          <Link
            withArrow={true}
            href="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=59%3A177"
            target="blank"
          >
            View in Figma
          </Link>
          <br />
          <br />
          <Title>Usage</Title>
          <Highlight language="tsx">{`// Replace IconName with actual Icon's name that you would like to use \nimport { IconName } from '@razorpay/blade/components' \n// IconProps are generic Icon props for all icons, don't replace it with your IconName \nimport type { IconProps } from '@razorpay/blade/components'`}</Highlight>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <Description markdown="You can check all the available icons in the `icon` control dropdown below." />
          <Description
            markdown="
            >The prop `icon` is listed below only to demonstrate the available icons and will *not* be available in the actual Icon (`CreditCardIcon`, `RupeeIcon`, etc.) component.
          "
          />
          <Props story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<IconProps>;

const IconTemplate: ComponentStory<ComponentType<IconProps & { icon: string }>> = ({
  icon,
  ...args
}) => {
  const IconComponent = iconMap[icon];
  return <IconComponent {...args} />;
};

export const Icon = IconTemplate.bind({});
Icon.args = {
  icon: 'CreditCardIcon',
};
