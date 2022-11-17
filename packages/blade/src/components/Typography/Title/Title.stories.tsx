import type { ComponentStory, Meta } from '@storybook/react';
import { Title as StorybookTitle } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { TitleProps } from './';
import { Title as TitleComponent } from './';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="The Title Component makes a bold visual statement. Use them to create impact when the main goal is visual storytelling. For example, use Title as marketing content on landing pages or to capture attention during onboarding."
      componentName="Title"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147139',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A190050',
      }}
    >
      <StorybookTitle>Usage</StorybookTitle>
      <Sandbox>
        {`
          import { Title } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <Title size="large">Blade by Razorpay</Title>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const TitleStoryMeta: Meta<TitleProps> = {
  title: 'Components/Typography/Title',
  component: TitleComponent,
  args: {
    size: 'large',
    type: 'normal',
    children: 'Power your finance, grow your business',
    contrast: 'low',
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const TitleTemplate: ComponentStory<typeof TitleComponent> = (args) => {
  return <TitleComponent {...args}>{args.children}</TitleComponent>;
};

export default TitleStoryMeta;
export const Title = TitleTemplate.bind({});
