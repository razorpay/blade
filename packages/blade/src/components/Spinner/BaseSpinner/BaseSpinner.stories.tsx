import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title, Subtitle, Primary, Controls, Stories } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import type { BaseSpinnerProps } from './BaseSpinner';
import { BaseSpinner as BaseSpinnerComponent } from './BaseSpinner';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <>
      <Title />
      <Subtitle>This is the BaseSpinner Internal component.</Subtitle>
      <a
        href="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85575&t=493DSapGGbdA42Lb-1&scaling=min-zoom&page-id=14825%3A203537&mode=design"
        target="_blank"
        rel="noreferrer noopener"
      >
        View in Figma
      </a>
      <br />
      <br />
      <Title>Example</Title>
      <Subtitle>
        This is the default BaseSpinner. You can change the properties of this spinner using the
        controls in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <Controls />
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
