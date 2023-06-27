import type { Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { TagProps } from './Tag';
import { Tag } from './Tag';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=28435%3A581488',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=15234%3A480939',
      }}
      componentName="Tags"
      componentDescription="These are set of interactive keywords that help organise & categorise objects. Tags can be added or removed from an object by the users."
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Tag } from '@razorpay/blade/components';
        
        function App(): JSX.Element {
          return (
            <Tag onDismiss={({ value }) => console.log('Tag dismissed', value)}>
              Unpaid
            </Tag>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<TagProps>;

export const Default = (props: TagProps): React.ReactElement => <Tag {...props} />;

Default.args = {
  children: 'Unpaid',
  onDismiss: ({ value }) => console.log('dismiss tag', value),
} as TagProps;
