import type { ComponentStory, Meta } from '@storybook/react';
import capitalize from 'lodash/capitalize';
import { Title } from '@storybook/addon-docs';
import type { AmountProps } from './Amount';
import { Amount as AmountComponent } from './Amount';
import Box from '~components/Box';
import { Text as BladeText } from '~components/Typography';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8110%3A417',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9727%3A118573',
      }}
      componentName="Amount"
      componentDescription="Amounts are used to show small amount of color coded metadata, which are ideal for getting user attention."
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Amount, InfoIcon } from '@razorpay/blade/components';
        
        function App(): JSX.Element {
          return (
            <Amount variant="neutral" icon={InfoIcon}>
              Boop
            </Amount>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Amount',
  component: AmountComponent,
  argTypes: {},
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<AmountProps>;

const AmountTemplate: ComponentStory<typeof AmountComponent> = ({ children, ...args }) => {
  return <AmountComponent {...args}>{children}</AmountComponent>;
};

export const Amount = AmountTemplate.bind({});
Amount.args = {
  children: '12000.231',
  variant: 'neutral',
  fontWeight: 'regular',
  size: 'small',
};
Amount.storyName = 'Default';

const AmountsWithVariantTemplate: ComponentStory<typeof AmountComponent> = ({ ...args }) => {
  const variants = ['positive', 'negative', 'notice', 'information', 'neutral', 'blue'] as const;

  const getLabel = (label: string): string => {
    return args.fontWeight === 'bold' ? label.toUpperCase() : capitalize(label);
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {variants.map((variant) => (
          <Box key={variant} paddingRight="spacing.3" paddingTop="spacing.2">
            <AmountComponent {...args} variant={variant}>
              {getLabel(variant)}
            </AmountComponent>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const AmountSmallSize = AmountsWithVariantTemplate.bind({});
AmountSmallSize.args = {
  size: 'large',
};
AmountSmallSize.storyName = 'Small Size';
