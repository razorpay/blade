import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { HeadingProps } from './';
import { Heading as HeadingComponent } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="The Heading Component is usually used for headings of each major section of a page."
      componentName="Heading"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147140',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A189907',
      }}
    >
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
    </StoryPageWrapper>
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
    ...getStyledPropsArgTypes(),
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
