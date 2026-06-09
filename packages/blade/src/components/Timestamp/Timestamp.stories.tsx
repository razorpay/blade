import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
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
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Timestamp/_decisions/decisions.md"
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
    value: {
      control: { type: 'text' },
      description:
        'The date/time value to display. Accepts a `Date` object, ISO 8601 string, or Unix timestamp in milliseconds.',
    },
    format: {
      control: { type: 'select' },
      options: ['relative', 'date', 'time', 'dateTime'],
      description:
        '`"relative"` — "5 minutes ago" (auto-updates). `"date"` — date only. `"time"` — time only. `"dateTime"` — both.',
    },
    dateStyle: {
      control: { type: 'select' },
      options: ['short', 'medium', 'long', 'full'],
      description:
        'Verbosity of the date portion. Only applies when `format` is `"date"` or `"dateTime"`. `"short"` → "5/30/26", `"full"` → "Saturday, May 30, 2026".',
    },
    hourCycle: {
      control: { type: 'select' },
      options: ['12h', '24h'],
      description: 'Hour cycle for time display. Defaults to the locale\'s preferred cycle.',
    },
    precision: {
      control: { type: 'select' },
      options: ['minute', 'second', 'hour', 'day'],
      description:
        'Time granularity. `"minute"` → "1:08 PM", `"second"` → "1:08:32 PM". `"hour"` and `"day"` are relative-only.',
    },
    type: {
      control: { type: 'select' },
      options: ['body', 'heading', 'display'],
      description:
        'Typographic scale. `"body"` for table cells and inline text. `"heading"` for section headers. `"display"` for dashboard summary cards. Each type unlocks its own valid `size` range.',
    },
    size: {
      control: { type: 'select' },
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge'],
      description:
        'Text size token. Valid values depend on `type`: body → xsmall–large, heading → small–2xlarge, display → small–xlarge.',
    },
    weight: {
      control: { type: 'select' },
      options: ['regular', 'medium', 'semibold'],
      description: 'Font weight. `"medium"` is not available for `type="heading"`.',
    },
    locale: {
      control: { type: 'text' },
      description:
        'BCP 47 locale string. Defaults to `"en-IN"` (Razorpay standard). Override for cross-border: `"en-MY"`, `"en-SG"`, `"en-US"`.',
    },
    noTooltip: {
      control: { type: 'boolean' },
      description:
        '`true` suppresses the tooltip, `false` forces it on, `undefined` (default) uses smart auto-detection: tooltip is shown when text is relative or `dateStyle="short"`.',
    },
    color: {
      description: 'Overrides the text color. Uses Blade semantic color tokens.',
    },
    accessibilityLabel: {
      control: { type: 'text' },
      description: 'Accessible label override. Defaults to the formatted text value.',
    },
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
  precision: 'minute',
  type: 'body',
  size: 'medium',
  weight: 'regular',
};
Default.storyName = 'Default';

// ─── Format variants ───────────────────────────────────────────────────────────

export const RelativeFormat: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Relative Format (auto-updates, shows tooltip on hover)</Text>
    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text size="small" color="surface.text.gray.muted">
        precision="second" — &lt;1 min ago
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
RelativeFormat.parameters = { controls: { disable: true } };

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
DateStyles.parameters = { controls: { disable: true } };

export const TimePrecision: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Time Precision (format="time")</Text>
    <BaseBox display="flex" flexDirection="column" gap="spacing.1">
      <Text size="small" color="surface.text.gray.muted">
        precision="minute" (default) — "1:08 PM"
      </Text>
      <TimestampComponent value={REFERENCE_DATE} format="time" precision="minute" />
    </BaseBox>
    <BaseBox display="flex" flexDirection="column" gap="spacing.1">
      <Text size="small" color="surface.text.gray.muted">
        precision="second" — "1:08:32 PM"
      </Text>
      <TimestampComponent value={REFERENCE_DATE} format="time" precision="second" />
    </BaseBox>
  </BaseBox>
);
TimePrecision.storyName = 'Time Precision';
TimePrecision.parameters = { controls: { disable: true } };

export const HourCycle: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Hour Cycle</Text>
    <BaseBox display="flex" flexDirection="column" gap="spacing.1">
      <Text size="small" color="surface.text.gray.muted">
        hourCycle="12h" — locale default for en-IN
      </Text>
      <TimestampComponent value={REFERENCE_DATE} format="time" hourCycle="12h" />
    </BaseBox>
    <BaseBox display="flex" flexDirection="column" gap="spacing.1">
      <Text size="small" color="surface.text.gray.muted">
        hourCycle="24h" — developer / log surfaces
      </Text>
      <TimestampComponent value={REFERENCE_DATE} format="time" hourCycle="24h" />
    </BaseBox>
  </BaseBox>
);
HourCycle.storyName = 'Hour Cycle';
HourCycle.parameters = { controls: { disable: true } };

// ─── Typography scale ─────────────────────────────────────────────────────────

export const TypographyScale: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.6">
    <BaseBox display="flex" flexDirection="column" gap="spacing.3">
      <Text weight="semibold">type="body" — table cells, inline text</Text>
      {(['xsmall', 'small', 'medium', 'large'] as const).map((size) => (
        <BaseBox key={size} display="flex" alignItems="center" gap="spacing.4">
          <Text size="small" color="surface.text.gray.muted" style={{ minWidth: '60px' }}>
            {size}
          </Text>
          <TimestampComponent value={REFERENCE_DATE} format="dateTime" type="body" size={size} />
        </BaseBox>
      ))}
    </BaseBox>

    <BaseBox display="flex" flexDirection="column" gap="spacing.3">
      <Text weight="semibold">type="heading" — section headers, drawer titles</Text>
      {(['small', 'medium', 'large', 'xlarge', '2xlarge'] as const).map((size) => (
        <BaseBox key={size} display="flex" alignItems="center" gap="spacing.4">
          <Text size="small" color="surface.text.gray.muted" style={{ minWidth: '60px' }}>
            {size}
          </Text>
          <TimestampComponent
            value={REFERENCE_DATE}
            format="dateTime"
            type="heading"
            size={size}
          />
        </BaseBox>
      ))}
    </BaseBox>

    <BaseBox display="flex" flexDirection="column" gap="spacing.3">
      <Text weight="semibold">type="display" — dashboard summary cards, hero numbers</Text>
      {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
        <BaseBox key={size} display="flex" alignItems="center" gap="spacing.4">
          <Text size="small" color="surface.text.gray.muted" style={{ minWidth: '60px' }}>
            {size}
          </Text>
          <TimestampComponent
            value={REFERENCE_DATE}
            format="date"
            type="display"
            size={size}
          />
        </BaseBox>
      ))}
    </BaseBox>
  </BaseBox>
);
TypographyScale.storyName = 'Typography Scale';
TypographyScale.parameters = { controls: { disable: true } };

// ─── Tooltip control ──────────────────────────────────────────────────────────

export const TooltipControl: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Tooltip Behaviour</Text>

    <BaseBox display="flex" flexDirection="column" gap="spacing.1">
      <Text size="small" color="surface.text.gray.muted">
        Auto (default) — tooltip ON for relative and dateStyle="short"
      </Text>
      <TimestampComponent value={FIVE_MIN_AGO} format="relative" />
    </BaseBox>

    <BaseBox display="flex" flexDirection="column" gap="spacing.1">
      <Text size="small" color="surface.text.gray.muted">
        noTooltip — suppress even for relative
      </Text>
      <TimestampComponent value={FIVE_MIN_AGO} format="relative" noTooltip />
    </BaseBox>

    <BaseBox display="flex" flexDirection="column" gap="spacing.1">
      <Text size="small" color="surface.text.gray.muted">
        noTooltip={false} — force tooltip on for medium dateStyle (normally no tooltip)
      </Text>
      <TimestampComponent
        value={REFERENCE_DATE}
        format="dateTime"
        dateStyle="medium"
        noTooltip={false}
      />
    </BaseBox>
  </BaseBox>
);
TooltipControl.storyName = 'Tooltip Control';
TooltipControl.parameters = { controls: { disable: true } };

// ─── Inline in text ───────────────────────────────────────────────────────────

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
InlineUsage.parameters = { controls: { disable: true } };

// ─── Cross-border locale ──────────────────────────────────────────────────────

export const CrossBorderLocale: StoryFn<typeof TimestampComponent> = () => (
  <BaseBox display="flex" flexDirection="column" gap="spacing.4">
    <Text weight="semibold">Cross-Border Locale (MoneySaver)</Text>
    {(
      [
        { locale: 'en-IN', label: 'India (default) — en-IN' },
        { locale: 'en-MY', label: 'Malaysia — en-MY' },
        { locale: 'en-SG', label: 'Singapore — en-SG' },
        { locale: 'en-US', label: 'United States — en-US' },
        { locale: 'en-GB', label: 'United Kingdom — en-GB' },
      ] as const
    ).map(({ locale, label }) => (
      <BaseBox key={locale} display="flex" flexDirection="column" gap="spacing.1">
        <Text size="small" color="surface.text.gray.muted">
          {label}
        </Text>
        <TimestampComponent value={REFERENCE_DATE} format="dateTime" locale={locale} />
      </BaseBox>
    ))}
  </BaseBox>
);
CrossBorderLocale.storyName = 'Cross-Border Locale';
CrossBorderLocale.parameters = { controls: { disable: true } };

// ─── Dashboard use cases ──────────────────────────────────────────────────────

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
      <Text weight="medium">Events &amp; Logs — 24h with seconds</Text>
      <TimestampComponent
        value={REFERENCE_DATE}
        format="dateTime"
        dateStyle="short"
        precision="second"
        hourCycle="24h"
      />
    </BaseBox>

    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="medium">Settlement Date — date only</Text>
      <TimestampComponent value={REFERENCE_DATE} format="date" />
    </BaseBox>

    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="medium">Dashboard Summary Card — display scale</Text>
      <TimestampComponent value={REFERENCE_DATE} format="date" type="display" size="medium" />
    </BaseBox>
  </BaseBox>
);
DashboardUseCases.storyName = 'Dashboard Use Cases';
DashboardUseCases.parameters = { controls: { disable: true } };
