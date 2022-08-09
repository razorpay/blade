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
import type { TitleProps } from './';
import { Title as TitleComponent } from './';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147139',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147139',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A190050',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A190050',
    },
  ]);

  return (
    <>
      <StorybookTitle />
      <Subtitle>
        The Title Component makes a bold visual statement. Use them to create impact when the main
        goal is visual storytelling. For example, use Title as marketing content on landing pages or
        to capture attention during onboarding.
      </Subtitle>
      <Link withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </Link>
      <br />
      <br />
      <StorybookTitle>Usage</StorybookTitle>
      <Highlight language="tsx">{`import { Title } from '@razorpay/blade/components' \nimport type { TitleProps } from '@razorpay/blade/components'`}</Highlight>
      <StorybookTitle>Example</StorybookTitle>
      <Primary />
      <StorybookTitle>Properties</StorybookTitle>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const TitleStoryMeta: Meta<TitleProps> = {
  title: 'Components/Typography/Title',
  component: TitleComponent,
  args: {
    variant: 'large',
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
