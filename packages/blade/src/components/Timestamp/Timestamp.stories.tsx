import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { TimestampProps } from './Timestamp';
import { Timestamp as TimestampComponent } from './Timestamp';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

// Fixed reference date for deterministic story renders
const REFERENCE_DATE = new Date('2026-05-30T13:08:32.000Z');
// A date 5 minutes in the past relative to reference (for illustrative relative stories)
const FIVE_MIN_AGO = new Date(REFERENCE_DATE.getTime() - 5 * 60 * 1000);

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Timestamp"
      componentDescription="Timestamp displays a date and/or time in a consistent, locale-aware format. It solves the problem of 50+ unique format strings scattered across dashboards by providing a single API for all date/time display needs."
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Timestamp } from '@razorpay/blade/components';

        function App() {
          return (
            <Timestamp
              value={new Date()}
              format="dateTime"
              dateStyle="medium"
            />
          );
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Timestamp',
  component: TimestampComponent,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<TimestampProps>;

const TimestampTemplate: StoryFn<typeof TimestampComponent> = (args) => (
  <TimestampComponent {...args} />
);

export const Default = TimestampTemplate.bind({});
Default.args = {
  value: REFERENCE_DATE,
  format: 'dateTime',
  dateStyle: 'medium',
  timeStyle: 'short',
};
Default.storyName = 'Default';

export const RelativeFormat: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Relative Format</Text>
    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text size="small" color="surface.text.gray.muted">
        precision="second"
      </Text>
      <TimestampComponent
        value={new Date(REFERENCE_DATE.getTime() - 45 * 1000)}
        format="relative"
        precision="second"
      />
    </BaseBox>
    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text size="small" color="surface.text.gray.muted">
        precision="minute" (default)
      </Text>
      <TimestampComponent value={FIVE_MIN_AGO} format="relative" precision="minute" />
    </BaseBox>
    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text size="small" color="surface.text.gray.muted">
        precision="hour"
      </Text>
      <TimestampComponent
        value={new Date(REFERENCE_DATE.getTime() - 3 * 60 * 60 * 1000)}
        format="relative"
        precision="hour"
      />
    </BaseBox>
    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text size="small" color="surface.text.gray.muted">
        precision="day"
      </Text>
      <TimestampComponent
        value={new Date(REFERENCE_DATE.getTime() - 3 * 24 * 60 * 60 * 1000)}
        format="relative"
        precision="day"
      />
    </BaseBox>
  </BaseBox>
);
RelativeFormat.storyName = 'Relative Format';

export const DateStyles: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Date Styles (format="date")</Text>
    {(['short', 'medium', 'long', 'full'] as const).map((dateStyle) => (
      <BaseBox key={dateStyle} display="flex" flexDirection="column" gap="spacing.1">
        <Text size="small" color="surface.text.gray.muted">
          dateStyle="{dateStyle}"
        </Text>
        <TimestampComponent value={REFERENCE_DATE} format="date" dateStyle={dateStyle} />
      </BaseBox>
    ))}
  </BaseBox>
);
DateStyles.storyName = 'Date Styles';

export const TimeStyles: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Time Styles (format="time")</Text>
    {(['short', 'medium', 'long', 'full'] as const).map((timeStyle) => (
      <BaseBox key={timeStyle} display="flex" flexDirection="column" gap="spacing.1">
        <Text size="small" color="surface.text.gray.muted">
          timeStyle="{timeStyle}"
        </Text>
        <TimestampComponent value={REFERENCE_DATE} format="time" timeStyle={timeStyle} />
      </BaseBox>
    ))}
  </BaseBox>
);
TimeStyles.storyName = 'Time Styles';

export const HourCycle: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Hour Cycle</Text>
    <BaseBox display="flex" flexDirection="column" gap="spacing.1">
      <Text size="small" color="surface.text.gray.muted">
        hourCycle="12h"
      </Text>
      <TimestampComponent value={REFERENCE_DATE} format="time" hourCycle="12h" />
    </BaseBox>
    <BaseBox display="flex" flexDirection="column" gap="spacing.1">
      <Text size="small" color="surface.text.gray.muted">
        hourCycle="24h"
      </Text>
      <TimestampComponent value={REFERENCE_DATE} format="time" hourCycle="24h" />
    </BaseBox>
  </BaseBox>
);
HourCycle.storyName = 'Hour Cycle';

export const TextSizes: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Text Sizes</Text>
    {(['xsmall', 'small', 'medium', 'large'] as const).map((size) => (
      <BaseBox key={size} display="flex" flexDirection="column" gap="spacing.1">
        <Text size="small" color="surface.text.gray.muted">
          size="{size}"
        </Text>
        <TimestampComponent value={REFERENCE_DATE} format="dateTime" size={size} />
      </BaseBox>
    ))}
  </BaseBox>
);
TextSizes.storyName = 'Text Sizes';

export const InlineUsage: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Inline Usage</Text>
    <Text>
      Payment created on{' '}
      <TimestampComponent value={REFERENCE_DATE} format="date" dateStyle="long" />.
    </Text>
    <Text>
      Last updated: <TimestampComponent value={FIVE_MIN_AGO} format="relative" />
    </Text>
  </BaseBox>
);
InlineUsage.storyName = 'Inline in Text';

export const DashboardUseCases: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.6">
    <Text weight="semibold" size="large">
      Dashboard Use Cases
    </Text>

    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="medium">Transaction Table — relative, compact</Text>
      <TimestampComponent value={FIVE_MIN_AGO} format="relative" />
    </BaseBox>

    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="medium">Order Detail Drawer — full absolute</Text>
      <TimestampComponent value={REFERENCE_DATE} format="dateTime" dateStyle="full" />
    </BaseBox>

    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="medium">Events & Logs — 24h with seconds</Text>
      <TimestampComponent
        value={REFERENCE_DATE}
        format="dateTime"
        dateStyle="short"
        timeStyle="medium"
        hourCycle="24h"
      />
    </BaseBox>

    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="medium">Settlement Date — date only</Text>
      <TimestampComponent value={REFERENCE_DATE} format="date" />
    </BaseBox>
  </BaseBox>
);
DashboardUseCases.storyName = 'Dashboard Use Cases';
