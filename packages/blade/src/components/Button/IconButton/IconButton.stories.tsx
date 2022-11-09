import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';

import type { IconButtonProps } from './IconButton';
import IconButtonComponent from './IconButton';
import iconMap from '~components/Icons/iconMap';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';
import FigmaEmbed from '~src/_helpers/storybook/FigmaEmbed';
import Sandbox from '~src/_helpers/storybook/Sandbox';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=12702%3A149930&t=IyyhF89aEgTcRBzk-4',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=12702%3A149930&t=IyyhF89aEgTcRBzk-4',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10564%3A195699&t=b5e9P6qSqxDsq2rz-4',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10564%3A195699&t=b5e9P6qSqxDsq2rz-4',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Useful for making clickable icons. For example - close button for modals, inputs, etc.
      </Subtitle>
      <FigmaEmbed title="IconButton Figma Designs" src={figmaURL} />
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { IconButton } from '@razorpay/blade/components';
        import { CloseIcon } from '@razorpay/blade/components/Icons';

        function App() {
          return (
            <div>
              <IconButton icon={CloseIcon} accessibilityLabel="Close" onClick={() => console.log('Clicked')} />
            </div>
          )
        }

        export default App;
        `}
      </Sandbox>
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
  title: 'Components/IconButton',
  component: IconButtonComponent,
  args: {
    size: 'medium',
    contrast: 'low',
    accessibilityLabel: 'Close',
  },
  argTypes: {
    onClick: { action: 'onClick' },
    icon: {
      name: 'icon',
      type: 'select',
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
