import type { ComponentType, ReactElement } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Title, Description } from '@storybook/addon-docs';
import iconMap from './iconMap';
import PlusIcon from './PlusIcon';
import type { IconProps } from '.';
import BaseBox from '~components/Box/BaseBox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Blade provides a bunch of icons out of the box in 6 different sizes. You can choose the size & color that fits best for your use case using the color & size props."
      componentName="Icon"
      apiDecisionLink=""
      note="Blade consists of a limited set of icons that are commonly used however you can contribute to Blade by adding more icons that are available on the Figma board as and when a use case arises. **See the adding icons section below for reference.**"
      imports={`// Replace IconName with actual Icon's name that you would like to use \nimport { IconName } from '@razorpay/blade/components' \n// IconProps are generic Icon props for all icons, don't replace it with your IconName \nimport type { IconProps } from '@razorpay/blade/components'`}
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=59-177&t=asW4d8ea1ARhVt6g-1&scaling=min-zoom&page-id=57%3A0&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Button, ArrowRightIcon } from '@razorpay/blade/components';

        function App() {
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
      <Title>Adding icons</Title>
      <Description>
        1. Please validate in the all icons story below in case the icon you wish to add is already
        present. Steps for adding a new icon from Figma:
      </Description>
      <Description>
        2. Visit the [icons figma
        file](https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=59-177&t=asW4d8ea1ARhVt6g-1&scaling=min-zoom&page-id=57%3A0&mode=design)
      </Description>
      <Description>
        3. Click the icon you wish to add on Figma. Select the root icon element instead of the
        layer within. Copy this root icon as SVG. **Note**: Generally the root svgs have a viewbox
        of `0 0 24 24`.
      </Description>
      <Description>
        ![](https://user-images.githubusercontent.com/24487274/203279145-1e0b0540-467d-4901-97c8-014f98b3cfca.png)
      </Description>
      <Description>
        4. Replace the native HTML elements with Blade's components (eg. `svg` becomes `Svg`). You
        may use a tool such as [SVGR](https://react-svgr.com/playground/?native=true) for the
        initial transformation. Some properties may still need to be adjusted. Follow an existing
        icon as a reference.
      </Description>
      <Description>
        5. Once you're done making changes, run the storybook to verify how the new icon looks and
        if it is inline with rest of the icons. Once you're happy with the results run the tests for
        web and native to update the snapshots.
      </Description>
      <Description>
        6. See [this reference PR](https://github.com/razorpay/blade/pull/872).
      </Description>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Icons',
  component: PlusIcon, // need to give it some icon component so that storybook can infer props & arg types
  args: {
    color: 'surface.icon.gray.normal',
    size: 'medium',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select' as 'string',
      options: Object.keys(iconMap),
    },
    size: {
      options: ['small', 'medium', 'large', 'xlarge', '2xlarge'],
      control: { type: 'select' },
    },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
} as Meta<IconProps>;

const IconTemplate: StoryFn<ComponentType<IconProps & { icon: string }>> = ({ icon, ...args }) => {
  const IconComponent = iconMap[icon];
  return <IconComponent {...args} />;
};

export const Icon = IconTemplate.bind({});
Icon.args = {
  icon: 'CreditCardIcon',
};

export const AllIcons: StoryFn<ComponentType<IconProps>> = ({ ...args }) => {
  return (
    <BaseBox>
      {Object.keys(iconMap).map((icon, key) => {
        const IconComponent = iconMap[icon];
        return (
          <BaseBox
            height="95px"
            width="125px"
            display="inline-flex"
            flexDirection="column"
            alignItems="center"
            gap="spacing.6"
            key={key}
          >
            <IconComponent {...args} />
            <BaseBox
              style={{
                fontSize: 12,
                width: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'center',
              }}
            >
              {icon}
            </BaseBox>
          </BaseBox>
        );
      })}
    </BaseBox>
  );
};
