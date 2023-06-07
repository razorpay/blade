import React from 'react';
import styled from 'styled-components';
import type { IconComponent } from '../../components/Icons';
import {
  StampIcon,
  EditIcon,
  CheckIcon,
  ClockIcon,
  LoaderIcon,
  AlertCircleIcon,
} from '../../components/Icons';

import { LinkToStorybook } from './LinkToStorybook';
import { Heading, Text } from '~components/Typography';
import { makeSpace } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import type { BadgeProps } from '~components/Badge';
import { Badge } from '~components/Badge';
import { Link } from '~components/Link';

type ComponentStatuses =
  | 'released'
  | 'in-api-spec'
  | 'in-development'
  | 'in-design'
  | 'deprecated'
  | 'to-be-decided'
  | `planned-Q${1 | 2 | 3 | 4}-${'dev' | 'design'}`;

type ComponentStatusData = {
  name: string;
  status: ComponentStatuses;
  description: string;
  releasedIn?: string;
  storybookLink?: string;
}[];

const componentData: ComponentStatusData = [
  {
    name: 'ActionList',
    status: 'released',
    releasedIn: '6.2.0',
    storybookLink: 'Components/Dropdown/With Select',
    description:
      'List of multiple actionable items. Can be used as menu items inside `Dropdown`, `BottomSheet` and as selectable items when combined with `SelectInput`',
  },
  {
    name: 'Alert',
    status: 'released',
    releasedIn: '1.1.0',
    storybookLink: 'Components/Alert',
    description:
      'Alerts are messages that communicate information to users about any significant changes or explanations inside the system in a prominent way.',
  },
  {
    name: 'Badge',
    status: 'released',
    releasedIn: '1.0.0',
    storybookLink: 'Components/Badge',
    description:
      'Badges are used to show small amount of color coded metadata, which are ideal for getting user attention.',
  },
  {
    name: 'Button',
    status: 'released',
    releasedIn: '0.11.0',
    storybookLink: 'Components/Button',
    description:
      'Button component which can be used for various CTAs. It is available in 3 different variants.',
  },
  {
    name: 'Card',
    status: 'released',
    releasedIn: '5.3.0',
    storybookLink: 'Components/Card',
    description:
      'Cards are used to group similar concepts and tasks together to make easier for merchants to scan, read, and get things done.',
  },
  {
    name: 'Checkbox',
    status: 'released',
    releasedIn: '0.13.0',
    storybookLink: 'Components/Checkbox/Checkbox',
    description:
      'Checkbox can be used in forms when a user needs to select multiple values from several options.',
  },
  {
    name: 'CheckboxGroup',
    status: 'released',
    releasedIn: '0.13.0',
    storybookLink: 'Components/Checkbox/CheckboxGroup',
    description:
      'CheckboxGroup can be used to group together multiple checkboxes in a forms which provides out of the box state management for the multi-checkboxes and other features.',
  },
  {
    name: 'Counter',
    status: 'released',
    releasedIn: '3.6.0',
    storybookLink: 'Components/Counter',
    description:
      'Counters are visual indicators that contains numerical values, tallies or counts in regards to some context. It can be used to show non-interactive numerical data.',
  },
  {
    name: 'IconButton',
    status: 'released',
    releasedIn: '3.6.2',
    storybookLink: 'Components/IconButton',
    description:
      'Useful for making clickable icons. For example - close button for modals, inputs, etc.',
  },
  {
    name: 'Indicator',
    status: 'released',
    releasedIn: '3.7.0',
    storybookLink: 'Components/Indicator',
    description:
      'Indicators describe the condition of an entity. They can be used to convey semantic meaning, such as statuses and semantical-categories.',
  },
  {
    name: 'Link',
    status: 'released',
    releasedIn: '0.13.0',
    storybookLink: 'Components/Link',
    description:
      'Link component can be used for showing external or internal Links to the user. The Link component can also be used as an inline button in certain cases with the `button` variant.',
  },
  {
    name: 'List',
    status: 'released',
    releasedIn: '6.1.0',
    storybookLink: 'Components/List',
    description:
      'Lists display a set of related items that are composed of text/links. Each list item begins with a bullet or a number.',
  },
  {
    name: 'ProgressBar',
    status: 'released',
    releasedIn: '5.4.0',
    storybookLink: 'Components/ProgressBar',
    description:
      'Progress bar is generally a branded element that indicates progress of process or task',
  },
  {
    name: 'Spinner',
    status: 'released',
    releasedIn: '2.2.0',
    storybookLink: 'Components/Spinner',
    description:
      'Spinner component is an element with a looping animation that indicates loading is in process.',
  },
  {
    name: 'TextInput',
    status: 'released',
    releasedIn: '2.1.0',
    storybookLink: 'Components/Input/TextInput',
    description:
      'TextInput component is a component that can be used to input name, email, telephone, url, search or plain text.',
  },
  {
    name: 'TextArea',
    status: 'released',
    releasedIn: '2.3.0',
    storybookLink: 'Components/Input/TextArea',
    description:
      'TextArea component lets you enter long form text which spans over multiple lines.',
  },
  {
    name: 'OTPInput',
    status: 'released',
    releasedIn: '3.1.0',
    storybookLink: 'Components/Input/OTPInput',
    description:
      'A one-time password (OTP), also known as a one-time PIN, one-time authorization code (OTAC) or dynamic password, is a password that is valid for only one login session or a transaction. These are a group of inputs and can be either 4 or 6 characters long.',
  },
  {
    name: 'PasswordInput',
    status: 'released',
    releasedIn: '2.5.0',
    storybookLink: 'Components/Input/PasswordInput',
    description:
      'PasswordInput is an input field for entering passwords. The input is masked by default. On mobile devices the last typed letter is shown for a brief moment. The masking can be toggled using an optional reveal button.',
  },
  {
    name: 'Radio',
    status: 'released',
    releasedIn: '1.0.0',
    storybookLink: 'Components/Radio & RadioGroup',
    description:
      'Radio & RadioGroup can be used in forms when a user needs to single value from several options.',
  },
  {
    name: 'RadioGroup',
    status: 'released',
    releasedIn: '1.0.0',
    storybookLink: 'Components/Radio & RadioGroup',
    description:
      'RadioGroup can be used to group together multiple radios in a forms which provides out of the box state management for the multi-radio and other features.',
  },
  {
    name: 'Text',
    status: 'released',
    releasedIn: '0.4.0',
    storybookLink: 'Components/Typography/Text',
    description:
      'Text component is used to display main content of the page. It is often clubbed with Title or Heading to display content in a hierarchical structure. It applies responsive styles automatically based on the device it is being rendered on.',
  },
  {
    name: 'Heading',
    status: 'released',
    releasedIn: '0.6.0',
    storybookLink: 'Components/Typography/Heading',
    description: 'Heading Component is usually used for headings of each major section of a page.',
  },
  {
    name: 'Title',
    status: 'released',
    releasedIn: '0.5.0',
    storybookLink: 'Components/Typography/Title',
    description:
      'Title Component makes a bold visual statement. Use them to create impact when the main goal is visual storytelling. For example, use Title as marketing content on landing pages or to capture attention during onboarding.',
  },
  {
    name: 'Code',
    status: 'released',
    releasedIn: '3.0.0',
    storybookLink: 'Components/Typography/Code',
    description:
      'Code component can be used for displaying token, variable names, or inlined code snippets.',
  },
  {
    name: 'SkipNav',
    status: 'released',
    releasedIn: '0.9.0',
    storybookLink: 'Components/Accessibility/SkipNav',
    description:
      'SkipNav component lets users skip the navigation and jump to the main content of the page. Useful when you have navbars at the top and the user wants to jump directly to the main content.',
  },
  {
    name: 'VisuallyHidden',
    status: 'released',
    releasedIn: '0.9.0',
    storybookLink: 'Components/Accessibility/VisuallyHidden',
    description:
      'VisuallyHidden component makes content hidden from sighted users but available for screen reader users.',
  },
  {
    name: 'Dropdown',
    status: 'released',
    releasedIn: '6.2.0',
    storybookLink: 'Components/Dropdown/With Select',
    description:
      'Dropdown Menu displays a list of choices on temporary surfaces. They allow users to make a selection from multiple options. They appear when users interact with a button, action, or other control.',
  },
  {
    name: 'SelectInput',
    status: 'released',
    releasedIn: '6.2.0',
    storybookLink: 'Components/Dropdown/With Select',
    description:
      'Select displays a list of choices on temporary surfaces. They allows users pick a value from predefined options',
  },
  {
    name: 'Layout Primitives',
    status: 'released',
    releasedIn: '6.5.0',
    storybookLink: 'Components/Layout Primitives (Box)/Layout Primitives Tutorial',
    description:
      'Layout Primitives are used to build complex responsive layouts. Includes Box component and Styled Props on existing blade components',
  },
  {
    name: 'BottomSheet',
    status: 'released',
    releasedIn: '7.2.0',
    storybookLink: 'Components/BottomSheet',
    description:
      'Bottom sheets are surfaces containing supplementary content that are anchored to the bottom of the screen.',
  },
  {
    name: 'Tags',
    status: 'in-development',
    description: 'A tag labels UI objects for quick recognition and navigation.',
  },
  {
    name: 'Amount',
    status: 'released',
    releasedIn: '6.7.0',
    storybookLink: 'Components/Amount',
    description: 'Amount component is used to display & format various currencies',
  },
  {
    name: 'Switch',
    status: 'released',
    releasedIn: '8.5.0',
    storybookLink: 'Components/Switch',
    description:
      'Switch component is used as an alternative for the checkbox component, It can be used to switch between two states: often on or off.',
  },
  {
    name: 'Accordion',
    status: 'in-development',
    description:
      'Accordion component allows the user to show and hide sections of related content on a page',
  },
  {
    name: 'Collapsible',
    status: 'in-development',
    description:
      'Collapsibles are used to allow users to toggle the visibility of hidden content within a container.',
  },
  {
    name: 'Tooltip',
    status: 'in-development',
    description:
      'Tooltip is a brief, informative message that appears when a user interacts with an element.',
  },
  {
    name: 'Modal',
    status: 'in-development',
    description:
      "Modal is a dialog that focuses the user's attention exclusively on an information via a window that is overlaid on primary content.",
  },
  {
    name: 'SkeletonLoader',
    status: 'planned-Q1-dev',
    description:
      'Skeleton Loader is a static / animated placeholder for the information that is still loading. It mimic the structure and look of the entire view.',
  },
  {
    name: 'Carousel',
    status: 'planned-Q1-design',
    description:
      'Carousel is a component to one-by-one display multiple blocks of information in circular manner',
  },
  {
    name: 'Tabs',
    status: 'planned-Q1-design',
    description:
      'Tabs is a component which will allow you to show multiple clickable tabs in your UI',
  },
  {
    name: 'Divider',
    status: 'planned-Q1-design',
    description: 'Dividers are used to visually separate content in a list or group.',
  },
  {
    name: 'Data Table',
    status: 'planned-Q1-design',
    description: 'DataTable will allow you to display your data in tabular manner',
  },
  {
    name: 'Date Picker',
    status: 'planned-Q2-design',
    description: 'DatePicker will provide an easy way to input dates and ranges',
  },
  {
    name: 'AutoComplete',
    status: 'in-design',
    description:
      'AutoComplete Component will allow you to filter Dropdown options as you type ahead in the Input',
  },
  {
    name: 'Toast',
    status: 'to-be-decided',
    description: 'Toast is a component to show a simple floating messages to your users',
  },
  {
    name: 'Button Group',
    status: 'to-be-decided',
    description: '',
  },
  {
    name: 'Popover',
    status: 'to-be-decided',
    description: 'Used for cases like guided tours',
  },
];

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    width: 20%;
    padding: ${({ theme }) => makeSpace(theme.spacing[4])};
    padding-inline: ${({ theme }) => makeSpace(theme.spacing[7])};
  }

  tr:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.brand.gray[200].lowContrast};
  }

  tr:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.brand.gray[300].lowContrast};
  }
`;

const ComponentStatusBadge = ({ status }: { status: ComponentStatuses }): React.ReactElement => {
  const badgeVariants: Record<
    ComponentStatuses,
    { label: string; variant: BadgeProps['variant']; icon: IconComponent }
  > = {
    released: { label: 'Released', variant: 'positive', icon: CheckIcon },
    deprecated: { label: 'Deprecated', variant: 'negative', icon: AlertCircleIcon },
    'to-be-decided': { label: 'TBD', variant: 'information', icon: StampIcon },
    'in-design': { label: 'In Design', variant: 'notice', icon: LoaderIcon },
    'in-api-spec': { label: 'API In Progress', variant: 'notice', icon: EditIcon },
    'in-development': { label: 'In Development', variant: 'notice', icon: LoaderIcon },
    'planned-Q1-dev': { label: 'Planned: Q1 Dev', variant: 'information', icon: ClockIcon },
    'planned-Q2-dev': { label: 'Planned: Q2 Dev', variant: 'information', icon: ClockIcon },
    'planned-Q3-dev': { label: 'Planned: Q3 Dev', variant: 'information', icon: ClockIcon },
    'planned-Q4-dev': { label: 'Planned: Q4 Dev', variant: 'information', icon: ClockIcon },
    'planned-Q1-design': { label: 'Planned: Q1 Design', variant: 'information', icon: ClockIcon },
    'planned-Q2-design': { label: 'Planned: Q2 Design', variant: 'information', icon: ClockIcon },
    'planned-Q3-design': { label: 'Planned: Q3 Design', variant: 'information', icon: ClockIcon },
    'planned-Q4-design': { label: 'Planned: Q4 Design', variant: 'information', icon: ClockIcon },
  };

  return (
    <Badge variant={badgeVariants[status].variant} icon={badgeVariants[status].icon}>
      {badgeVariants[status].label}
    </Badge>
  );
};

const ReleasedInLink = ({ version }: { version?: string }): React.ReactElement => {
  const ghUrl = 'https://github.com/razorpay/blade/releases/tag/%40razorpay%2Fblade%40';
  return version ? (
    <Link
      href={`${ghUrl}${version}`}
      rel="noopener noreferrer"
      target="_blank"
    >{`v${version}`}</Link>
  ) : (
    <Text>-</Text>
  );
};

const ComponentStatusTable = (): React.ReactElement => {
  const unreleasedComponentsSort: ComponentStatuses[] = [
    'in-design',
    'in-api-spec',
    'in-development',
    'planned-Q1-design',
    'planned-Q1-dev',
    'planned-Q2-design',
    'planned-Q2-dev',
    'planned-Q3-design',
    'planned-Q3-dev',
    'planned-Q4-design',
    'planned-Q4-dev',
    'to-be-decided',
    'released',
  ];

  const sortedData = componentData.sort((a, b) => {
    if (!a.releasedIn || !b.releasedIn) {
      return unreleasedComponentsSort.indexOf(a.status) > unreleasedComponentsSort.indexOf(b.status)
        ? 1
        : -1;
    }
    return b.releasedIn.localeCompare(a.releasedIn);
  });

  return (
    <>
      <Heading variant="regular">Lifecycle of a component</Heading>
      <br />
      <BaseBox display="flex" flexDirection="row" marginBottom="spacing.7" gap="spacing.2">
        <Badge variant="information" icon={StampIcon}>
          TBD
        </Badge>
        ➡️
        <Badge variant="information" icon={ClockIcon}>
          Planned: Qn Design
        </Badge>
        ➡️
        <Badge variant="information" icon={ClockIcon}>
          Planned: Qn Dev
        </Badge>
        ➡️
        <Badge variant="notice" icon={LoaderIcon}>
          In Design
        </Badge>
        ➡️
        <Badge variant="notice" icon={EditIcon}>
          API In Progress
        </Badge>
        ➡️
        <Badge variant="notice" icon={LoaderIcon}>
          In Development
        </Badge>
        ➡️
        <Badge variant="positive" icon={CheckIcon}>
          Released
        </Badge>
      </BaseBox>
      <BaseBox>
        <Table>
          <thead>
            <tr>
              <th align="left">
                <Text weight="bold">Component</Text>
              </th>
              <th align="left">
                <Text weight="bold">Status</Text>
              </th>
              <th style={{ width: '50%' }} align="left">
                <Text weight="bold">Description</Text>
              </th>
              <th align="right">
                <Text weight="bold">Released In</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((data) => {
              return (
                <tr key={data.name}>
                  <td align="left">
                    {data.storybookLink ? (
                      <LinkToStorybook url={data.storybookLink}>{data.name}</LinkToStorybook>
                    ) : (
                      <Text>{data.name}</Text>
                    )}
                  </td>
                  <td align="left">
                    <ComponentStatusBadge status={data.status} />
                  </td>
                  <td align="left">
                    <Text size="medium" color="surface.text.subtle.lowContrast">
                      {data.description}
                    </Text>
                  </td>
                  <td align="right">
                    <ReleasedInLink version={data.releasedIn} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </BaseBox>
    </>
  );
};

export { ComponentStatusTable };
