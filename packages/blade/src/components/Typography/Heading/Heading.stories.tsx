import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title as StorybookTitle,
  Subtitle,
  Primary,
  Props,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs';
import { Highlight, Link } from '@storybook/design-system';
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
          <Link
            withArrow={true}
            href="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147140"
            target="blank"
          >
            View in Figma
          </Link>
          <br />
          <br />
          <StorybookTitle>Usage</StorybookTitle>
          <Highlight language="tsx">{`import { Heading } from '@razorpay/blade/components' \nimport type { HeadingProps } from '@razorpay/blade/components'`}</Highlight>
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
