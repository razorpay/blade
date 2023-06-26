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
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8110%3A417',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9727%3A118573',
      }}
      componentName="Badge"
      componentDescription="Badges are used to show small amount of color coded metadata, which are ideal for getting user attention."
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Badge, InfoIcon } from '@razorpay/blade/components';
        
        function App(): JSX.Element {
          return (
            <Badge variant="neutral" icon={InfoIcon}>
              Boop
            </Badge>
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
};
