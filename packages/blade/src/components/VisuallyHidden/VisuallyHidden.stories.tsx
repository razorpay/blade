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
import { Text } from '../Typography';
import type { VisuallyHiddenProps } from './VisuallyHidden';
import VisuallyHiddenComponent from './VisuallyHidden';

const Page = (): ReactElement => {
  return (
    <>
      <StorybookTitle />
      <Subtitle>
        The VisuallyHidden component makes content hidden from sighted users but available for
        screen reader users.
      </Subtitle>
      <Link
        withArrow={true}
        href="https://github.com/razorpay/blade/blob/anu/a11y-rfc/rfcs/2022-04-09-accessibility.md#hidden-content"
        target="_blank"
      >
        See Hidden Content RFC
      </Link>
      <br />
      <br />
      <StorybookTitle>Usage</StorybookTitle>
      <Highlight language="tsx">{`import { VisuallyHidden } from '@razorpay/blade/components' \nimport type { VisuallyHiddenProps } from '@razorpay/blade/components'`}</Highlight>
      <StorybookTitle>Example</StorybookTitle>
      <Primary />
      <StorybookTitle>Properties</StorybookTitle>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const VisuallyHiddenStoryMeta: Meta<VisuallyHiddenProps> = {
  title: 'Components/Accessibility/VisuallyHidden',
  component: VisuallyHiddenComponent,
  args: { children: 'Visually hidden content' },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const VisuallyHiddenTemplate: ComponentStory<typeof VisuallyHiddenComponent> = () => {
  return (
    <>
      <Text>
        This is an example for VisuallyHidden component, enable voiceover and focus on the checkbox
        to hear it's invisible label.
      </Text>
      <VisuallyHiddenComponent>
        <label htmlFor="darkmode">Toggle dark mode</label>
      </VisuallyHiddenComponent>
      <input id="darkmode" type="checkbox" />
    </>
  );
};

export default VisuallyHiddenStoryMeta;
export const VisuallyHidden = VisuallyHiddenTemplate.bind({});
