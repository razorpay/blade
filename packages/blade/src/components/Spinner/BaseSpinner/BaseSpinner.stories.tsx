import type { StoryFn, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Link } from '@storybook/design-system';
import type { ReactElement } from 'react';
import type { BaseSpinnerProps } from './BaseSpinner';
import { BaseSpinner as BaseSpinnerComponent } from './BaseSpinner';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <>
      <Title />
      <Subtitle>This is the BaseSpinner Internal component.</Subtitle>
      <Link
        withArrow={true}
        href="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=14825%3A203592"
        target="_blank"
        rel="noreferrer noopener"
      >
        View in Figma
      </Link>
      <br />
      <br />
      <Title>Example</Title>
      <Subtitle>
        This is the default BaseSpinner. You can change the properties of this spinner using the
        controls in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

export default {
  title: 'Components/Spinner/BaseSpinner (Internal)',
  component: BaseSpinnerComponent,
  parameters: {
    docs: {
      page: Page,
    },
  },
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
} as Meta<BaseSpinnerProps>;

const BaseSpinnerTemplate: StoryFn<typeof BaseSpinnerComponent> = ({ ...args }) => {
  return <BaseSpinnerComponent {...args} />;
};

export const BaseSpinner = BaseSpinnerTemplate.bind({});
BaseSpinner.storyName = 'Default';
