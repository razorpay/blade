import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { QuickFilterGroup } from '../QuickFilterGroup';
import type { QuickFilterGroupProps } from '../types';
import { QuickFilter } from '../QuickFilter';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Counter } from '~components/Counter';
import { Tooltip } from '~components/Tooltip';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="QuickFilter"
      componentDescription="QuickFilter & QuickFilterGroups can be used to show a list of filters that can be selected by the user."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { QuickFilterGroup,QuickFilter  } from '@razorpay/blade/components';
        
        function App() {
          return (
            <QuickFilterGroup >
             <QuickFilter title="Title1" value="value1" trailingElement={<Counter value={234} />} />{' '}
             <QuickFilter title="Title2" value="value2" trailingElement={<Counter value={234} />} />{' '}
           </QuickFilterGroup>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/QuickFilter & QuickFilterGroup',
  component: QuickFilterGroup,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<QuickFilterGroupProps>;

const QuickFilterTemplate: StoryFn<typeof QuickFilterGroup> = (args) => {
  return (
    <QuickFilterGroup {...args}>
      <QuickFilter title="All" value="All" trailing={<Counter value={400} color="information" />} />
      <QuickFilter
        title="Captured"
        value="Captured"
        trailing={<Counter value={234} color="positive" />}
      />
      <QuickFilter
        title="Failed"
        value="Failed"
        trailing={<Counter value={234} color="negative" />}
      />
    </QuickFilterGroup>
  );
};

export const Default = QuickFilterTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  selectionType: 'single',
};

const QuickFilterSingle: StoryFn<typeof QuickFilterGroup> = () => {
  return (
    <QuickFilterGroup
      selectionType="single"
      onChange={({ name, values }) => {
        console.log(name, values);
      }}
    >
      <QuickFilter
        title="Unresolved"
        value="unresolved"
        trailing={<Counter value={234} color="information" />}
      />
      <QuickFilter
        title="Resolved"
        value="resolved"
        trailing={<Counter value={234} color="positive" />}
      />
      <QuickFilter
        title="In Progress"
        value="in_progress"
        trailing={<Counter value={234} color="neutral" />}
      />
    </QuickFilterGroup>
  );
};

export const QuickFilterSingleStory = QuickFilterSingle.bind({});
QuickFilterSingleStory.storyName = 'QuickFilter Single Selection';

const QuickFilterMultiple: StoryFn<typeof QuickFilterGroup> = () => {
  return (
    <QuickFilterGroup
      selectionType="multiple"
      onChange={({ name, values }) => {
        console.log(name, values);
      }}
    >
      <QuickFilter
        title="Captured"
        value="Captured"
        trailing={<Counter value={234} color="positive" />}
      />
      <QuickFilter
        title="Failed"
        value="Failed"
        trailing={<Counter value={234} color="negative" />}
      />
      <QuickFilter
        title="Pending"
        value="Pending"
        trailing={<Counter value={234} color="neutral" />}
      />
    </QuickFilterGroup>
  );
};

export const QuickFilterMultipleStory = QuickFilterMultiple.bind({});
QuickFilterMultipleStory.storyName = 'QuickFilter Multiple Selection';

const QuickFilterWithDefault: StoryFn<typeof QuickFilterGroup> = () => {
  return (
    <QuickFilterGroup selectionType="single" defaultValue="Captured">
      <QuickFilter
        title="Captured"
        value="Captured"
        trailing={<Counter value={234} color="positive" />}
      />
      <QuickFilter
        title="Failed"
        value="Failed"
        trailing={<Counter value={234} color="negative" />}
      />
      <QuickFilter
        title="Pending"
        value="Pending"
        trailing={<Counter value={234} color="neutral" />}
      />
    </QuickFilterGroup>
  );
};
export const QuickFilterWithDefaultStory = QuickFilterWithDefault.bind({});
QuickFilterWithDefaultStory.storyName = 'QuickFilter with default value';

const QuickFilterControlled: StoryFn<typeof QuickFilterGroup> = () => {
  const [value, setValue] = React.useState<string | string[]>(['Captured']);
  return (
    <QuickFilterGroup
      selectionType="multiple"
      value={value}
      onChange={({ values }) => setValue(values ?? [])}
    >
      <QuickFilter
        title="Captured"
        value="Captured"
        trailing={<Counter value={234} color="positive" />}
      />
      <QuickFilter
        title="Failed"
        value="Failed"
        trailing={<Counter value={234} color="negative" />}
      />
      <QuickFilter
        title="Pending"
        value="Pending"
        trailing={<Counter value={234} color="neutral" />}
      />
    </QuickFilterGroup>
  );
};

export const QuickFilterControlledStory = QuickFilterControlled.bind({});
QuickFilterControlledStory.storyName = 'QuickFilter Controlled';

const QuickFiltersWithTooltip: StoryFn<typeof QuickFilterGroup> = () => {
  return (
    <QuickFilterGroup selectionType="single">
      <Tooltip content="Filter all captured tickets" placement="top">
        <QuickFilter
          title="Captured"
          value="Captured"
          trailing={<Counter value={234} color="positive" />}
        />
      </Tooltip>
      <Tooltip content="Filter all failed tickets" placement="top">
        <QuickFilter
          title="Failed"
          value="Failed"
          trailing={<Counter value={234} color="negative" />}
        />
      </Tooltip>
      <Tooltip content="Filter all pending tickets" placement="top">
        <QuickFilter
          title="Pending"
          value="Pending"
          trailing={<Counter value={234} color="neutral" />}
        />
      </Tooltip>
    </QuickFilterGroup>
  );
};

export const QuickFiltersWithTooltipStory = QuickFiltersWithTooltip.bind({});
QuickFiltersWithTooltipStory.storyName = 'QuickFilters with Tooltip';

const ChangeControlledQuickFilter: StoryFn<typeof QuickFilterGroup> = () => {
  const [value, setValue] = React.useState<string | string[]>('');
  const [multipleValue, setMultipleValue] = React.useState<string | string[]>([]);
  console.log('value', value);
  return (
    <Box display="flex" flexDirection="column" gap="spacing.3">
      <Box>
        <Heading size="small">Single Quick Filters Value: {value}</Heading>
        <Button onClick={() => setValue('Failed')}>Set Value</Button>
      </Box>
      <QuickFilterGroup
        selectionType="single"
        value={value}
        onChange={({ values }) => setValue(values[0] ?? '')}
      >
        <QuickFilter
          title="Captured"
          value="Captured"
          trailing={<Counter value={234} color="positive" />}
        />
        <QuickFilter
          title="Failed"
          value="Failed"
          trailing={<Counter value={234} color="negative" />}
        />
        <QuickFilter
          title="Pending"
          value="Pending"
          trailing={<Counter value={234} color="neutral" />}
        />
      </QuickFilterGroup>
      <Divider />
      <Box>
        <Heading size="small">Multiple Quick Filters Value: {multipleValue}</Heading>
        <Button onClick={() => setMultipleValue(['Failed', 'Pending'])}>Set Value</Button>
      </Box>
      <QuickFilterGroup
        selectionType="multiple"
        value={multipleValue}
        onChange={({ values }) => setMultipleValue(values ?? [])}
      >
        <QuickFilter
          title="Captured"
          value="Captured"
          trailing={<Counter value={234} color="positive" />}
        />
        <QuickFilter
          title="Failed"
          value="Failed"
          trailing={<Counter value={234} color="negative" />}
        />
        <QuickFilter
          title="Pending"
          value="Pending"
          trailing={<Counter value={234} color="neutral" />}
        />
      </QuickFilterGroup>
    </Box>
  );
};

export const ChangeControlledQuickFilterStory = ChangeControlledQuickFilter.bind({});
ChangeControlledQuickFilterStory.storyName = 'Change Controlled QuickFilter';
