import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, Props, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { HeadingProps } from './';
import HeadingComponent from './';

const HeadingStoryMeta: Meta<
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
          <Title />
          <Subtitle>
            The Heading Component is usually used for headings of each major section of a page.
          </Subtitle>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <Props story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const HeadingTemplate: ComponentStory<typeof HeadingComponent> = (args) => {
  return <HeadingComponent {...args}>{args.children}</HeadingComponent>;
};

export default HeadingStoryMeta;
export const Heading = HeadingTemplate.bind({});
