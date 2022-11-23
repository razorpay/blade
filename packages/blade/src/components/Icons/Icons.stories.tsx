import type { ComponentType, ReactElement } from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Description } from '@storybook/addon-docs';
import iconMap from './iconMap';
import type { IconProps } from '.';
import { CreditCardIcon } from '.';
import Box from '~components/Box';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="We provide a bunch of icons out-of-the-box for Blade in 6 different sizes. You can choose which size & color fits the best for your use case using the color & size props."
      componentName="Icon"
      note="For now, we have added only a few icons but you can contribute to Blade by adding more icons that are available on the Figma board as and when a use-case arises. **See the adding icons section below for reference.**"
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
      <Title>Adding icons</Title>
      <Description>
        Please validate in the all icons story below in case the icon you wish to add is already
        added. Steps for adding a new icon from Figma:
      </Description>
      <ul>
        <li>
          <Description>
            Visit the [icons figma
            file](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=57%3A0&t=xzz6HfFC50U8iuJp-0)
          </Description>
        </li>
        <li>
          <Description>
            Click the icon you wish to add on Figma. Select the root icon element and not the layer
            within. Copy this root icon as SVG. **Note**: generally the root svgs have a viewbox of
            `0 0 24 24`.
          </Description>
        </li>
        <li>
          <Description>
            ![](https://user-images.githubusercontent.com/24487274/203279145-1e0b0540-467d-4901-97c8-014f98b3cfca.png)
          </Description>
        </li>
        <li>
          <Description>
            Replace the native HTML elements with Blade's components (eg. `svg` becomes `Svg`). You
            may use a tool such as [SVGR](https://react-svgr.com/playground/?native=true) for the
            initial transformation. Some properties may still need to be adjusted. Follow an
            existing icon as a reference.
          </Description>
        </li>
        <li>
          <Description>
            Once you're done making changes, run the storybook to verify how the new icon is looking
            and if it looks inline with rest of the icons. Once you're happy with the results run
            the tests for web and native to update the snapshots.
          </Description>
        </li>
        <li>
          <Description>
            See [this reference PR](https://github.com/razorpay/blade/pull/872).
          </Description>
        </li>
      </ul>
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

export const AllIcons: ComponentStory<ComponentType<IconProps>> = ({ ...args }) => {
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
            <Box
              style={{
                fontSize: 12,
                width: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'center',
              }}
            >
              {icon}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
