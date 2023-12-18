import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';

import type { IconButtonProps } from './IconButton';
import { IconButton as IconButtonComponent } from './IconButton';
import iconMap from '~components/Icons/iconMap';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getBladeCommonEventArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="IconButton"
      componentDescription="Useful for making clickable icons. For example - close button for modals, inputs, etc."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=12702%3A149930&t=IyyhF89aEgTcRBzk-4"
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { IconButton, CloseIcon } from '@razorpay/blade/components';

        function App() {
          return (
            <IconButton 
              icon={CloseIcon} 
              accessibilityLabel="Close" 
              onClick={() => console.log('Clicked')} 
            />
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const meta: Meta<IconButtonProps> = {
  title: 'Components/IconButton',
  component: IconButtonComponent,
  args: {
    size: 'medium',
    emphasis: 'intense',
    accessibilityLabel: 'Close',
  },
  argTypes: {
    ...getBladeCommonEventArgTypes(),
    onClick: { action: 'onClick' },
    icon: {
      name: 'icon',
      type: 'select' as 'string',
      options: Object.keys(iconMap),
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const IconButtonTemplate: ComponentStory<typeof IconButtonComponent> = ({
  icon = 'CloseIcon',
  ...args
}) => {
  const IconComponent = iconMap[(icon as unknown) as string];

  return <IconButtonComponent icon={IconComponent} {...args} />;
};

export const IconButton = IconButtonTemplate.bind({});
IconButton.storyName = 'IconButton';

export default meta;
