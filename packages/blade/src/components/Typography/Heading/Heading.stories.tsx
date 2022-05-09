import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title as StorybookTitle,
  Subtitle,
  Primary,
  Props,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs';
import type { HeadingProps } from './';
import HeadingComponent from './';

const TitleStoryMeta: Meta<
  HeadingProps<{ variant: 'small' | 'medium' | 'large' | 'subheading' }>
> = {
  title: 'Components/Typography/Heading',
  component: HeadingComponent,
  args: {
    variant: 'large',
    type: 'normal',
    children: 'Get Started With Payment Gateway',
    weight: 'bold',
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <StorybookTitle />
          <Subtitle>
            The Heading Component is usually used as titles of each major section of a page.
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

const TitleTemplate: ComponentStory<typeof HeadingComponent> = (args) => {
  return <HeadingComponent {...args}>{args.children}</HeadingComponent>;
};

export default TitleStoryMeta;
export const Heading = TitleTemplate.bind({});
