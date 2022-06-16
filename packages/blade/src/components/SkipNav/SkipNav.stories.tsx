import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title as StorybookTitle,
  Subtitle,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
  Description,
} from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import type { ReactElement } from 'react';
import { Text } from '../Typography';
import { SkipNavContent, SkipNavLink } from '.';

const Page = (): ReactElement => {
  return (
    <>
      <StorybookTitle />
      <Description>SkipNav component is only available on web.</Description>
      <Subtitle>
        The SkipNav component lets users skip the navigation and jump to the main content of the
        page. Useful when you have navbars at the top and the user wants to jump directly to the
        main content.
      </Subtitle>
      <br />
      <br />
      <StorybookTitle>Usage</StorybookTitle>
      <Highlight language="tsx">{`import { SkipNavLink, SkipNavContent } from '@razorpay/blade/components'`}</Highlight>
      <StorybookTitle>Example</StorybookTitle>
      <Primary />
      <StorybookTitle>Properties</StorybookTitle>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const SkipNavStoryMeta: Meta = {
  title: 'Components/Accessibility/SkipNav',
  component: SkipNavLink,
  args: {},
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const SkipNavTemplate: ComponentStory<typeof SkipNavLink> = () => {
  return (
    <>
      <SkipNavLink>Skip to content</SkipNavLink>
      <SkipNavLink id="second">Skip to second content</SkipNavLink>
      <nav style={{ display: 'flex' }}>
        <ul style={{ marginLeft: 'auto', display: 'flex', listStyle: 'none', gap: '10px' }}>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Pricing</a>
          </li>
          <li>
            <a href="#">Login</a>
          </li>
          <li>
            <a href="#">SignUp</a>
          </li>
        </ul>
      </nav>
      <main>
        <SkipNavContent />
        <Text>Main content of the page</Text>
        <button>Button 1</button>
        <button>Button 2</button>
        <SkipNavContent id="second" />
        <Text>Second Main content of the page</Text>
        <button>Button 3</button>
        <button>Button 4</button>
      </main>
    </>
  );
};

export default SkipNavStoryMeta;
export const SkipNavExample = SkipNavTemplate.bind({});
