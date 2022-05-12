import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title as StorybookTitle,
  Subtitle,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs';
import { Highlight, Link } from '@storybook/design-system';
import type { ReactElement } from 'react';
import useMakeFigmaURL from '../../../_helpers/storybook/useMakeFigmaURL';
import type { HeadingProps } from './';
import HeadingComponent from './';

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
      <StorybookTitle />
      <Subtitle>
        The Heading Component is usually used as titles of each major section of a page.
      </Subtitle>
      <Link withArrow={true} href={figmaURL} target="_blank">
        View in Figma
      </Link>
      <br />
      <br />
      <StorybookTitle>Usage</StorybookTitle>
      <Highlight language="tsx">{`import { Heading } from '@razorpay/blade/components' \nimport type { HeadingProps } from '@razorpay/blade/components'`}</Highlight>
      <StorybookTitle>Example</StorybookTitle>
      <Primary />
      <StorybookTitle>Properties</StorybookTitle>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

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
      page: () => <Page />,
    },
  },
};

const TitleTemplate: ComponentStory<typeof HeadingComponent> = (args) => {
  return <HeadingComponent {...args}>{args.children}</HeadingComponent>;
};

export default TitleStoryMeta;
export const Heading = TitleTemplate.bind({});
