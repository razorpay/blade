import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Highlight, Link } from '@storybook/design-system';
import type { ReactElement } from 'react';
import type { HeadingProps } from './';
import { Heading as HeadingComponent } from './';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';

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
      <Link withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </Link>
      <br />
      <br />
      <Title>Usage</Title>
      <Highlight language="tsx">{`import { Heading } from '@razorpay/blade/components' \nimport type { HeadingProps } from '@razorpay/blade/components'`}</Highlight>
      <Title>Example</Title>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

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
    contrast: 'low',
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
