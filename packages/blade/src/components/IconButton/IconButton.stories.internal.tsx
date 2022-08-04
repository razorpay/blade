import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Highlight } from '@storybook/design-system';

import type { IconButtonProps } from './IconButton';
import IconButtonComponent from './IconButton';
import { CloseIcon } from '~components/Icons';

const Page = (): ReactElement => {
  return (
    <>
      <Title />
      <Subtitle>
        Useful for making clickable icons. For example - close button for modals, inputs, etc.
      </Subtitle>
      <Title>Usage</Title>
      <Highlight language="tsx">{`import { IconButton } from '@razorpay/blade/components' \nimport type { IconButtonProps } from '@razorpay/blade/components'`}</Highlight>
      <Title>Example</Title>
      <Subtitle>
        You can change the properties of this button using the controls in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const meta: Meta<IconButtonProps> = {
  title: 'Components/IconButton (Internal)',
  component: IconButtonComponent,
  args: {
    size: 'medium',
    contrast: 'low',
    icon: CloseIcon,
    accessibilityLabel: 'Close',
  },
  argTypes: {
    onClick: { action: 'onClick' },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const IconButtonTemplate: ComponentStory<typeof IconButtonComponent> = ({ ...args }) => {
  return <IconButtonComponent {...args} />;
};

export const IconButton = IconButtonTemplate.bind({});
IconButton.storyName = 'IconButton';

export default meta;
