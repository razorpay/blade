/* eslint-disable react/display-name */
import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title as StorybookTitle,
  Subtitle,
  Primary,
  Props,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs';
import type { TitleProps } from './';
import TitleComponent from './';

const TitleStoryMeta: Meta<TitleProps> = {
  title: 'Components/Typography/Title',
  component: TitleComponent,
  args: {
    variant: 'large',
    type: 'normal',
    children: 'This is a Landing Page Title',
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <StorybookTitle />
          <Subtitle>
            The Title Component make a bold visual statement. Use them to create impact when the
            main goal is visual storytelling. For example, use Title as marketing content on landing
            pages or to capture attention during onboarding.
          </Subtitle>
          <StorybookTitle>Example</StorybookTitle>
          <Primary />
          <StorybookTitle>Properties</StorybookTitle>
          <Props story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const TitleTemplate: ComponentStory<typeof TitleComponent> = (args) => {
  return <TitleComponent {...args}>{args.children}</TitleComponent>;
};

export default TitleStoryMeta;
export const Title = TitleTemplate.bind({});
