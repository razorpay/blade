import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { HeadingProps } from './';
import { Heading as HeadingComponent } from './';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';
import FigmaEmbed from '~src/_helpers/storybook/FigmaEmbed';
import Sandbox from '~src/_helpers/storybook/Sandbox';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147140',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147140',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A189907',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A189907',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        The Heading Component is usually used for headings of each major section of a page.
      </Subtitle>
      <FigmaEmbed src={figmaURL} title="Heading Figma Designs" />
      <br />
      <br />
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Heading } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <Heading size="large">Blade by Razorpay</Heading>
            )
          }

          export default App;
        `}
      </Sandbox>
      <Title>Example</Title>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const HeadingStoryMeta: Meta<HeadingProps<{ variant: 'regular' | 'subheading' }>> = {
  title: 'Components/Typography/Heading',
  component: HeadingComponent,
  args: {
    variant: 'regular',
    size: 'large',
    type: 'normal',
    children: 'Get Started With Payment Gateway',
    weight: 'bold',
    contrast: 'low',
  },
  argTypes: {
    size: {
      description: 'Decides size of the Heading',
    },
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const HeadingTemplate: ComponentStory<typeof HeadingComponent> = (args) => {
  return <HeadingComponent {...args}>{args.children}</HeadingComponent>;
};

export default HeadingStoryMeta;
export const Heading = HeadingTemplate.bind({});
