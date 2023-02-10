import React from 'react';
import styled from 'styled-components';
import type { IconComponent } from '../../components/Icons';
import {
  EditIcon,
  CheckIcon,
  ClockIcon,
  LoaderIcon,
  AlertCircleIcon,
} from '../../components/Icons';
import { LinkToStorybook } from './LinkToStorybook';
import { Text } from '~components/Typography';
import { makeSpace } from '~utils';
import Box from '~components/Box';
import type { BadgeProps } from '~components/Badge';
import { Badge } from '~components/Badge';
import { Link } from '~components/Link';

type ComponentStatuses =
  | 'released'
  | 'in-api-spec'
  | 'in-development'
  | 'in-design'
  | 'deprecated'
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
    name: 'DropDown',
    status: 'in-development',
    description:
      'Dropdown Menu displays a list of choices on temporary surfaces. They allow users to make a selection from multiple options. They appear when users interact with a button, action, or other control.',
  },
  {
    name: 'Select',
    status: 'in-development',
    description:
      'Select displays a list of choices on temporary surfaces. They allows users pick a value from predefined options',
  },
  {
    name: 'Layout',
    status: 'in-api-spec',
    description: 'Layout components/primitives are used to build complex layouts.',
  },
  {
    name: 'BottomSheet',
    status: 'planned-Q4-dev',
    description:
      'Bottom sheets are surfaces containing supplementary content that are anchored to the bottom of the screen.',
  },
  {
    name: 'Tags',
    status: 'planned-Q4-design',
    description: 'A tag labels UI objects for quick recognition and navigation.',
  },
  {
    name: 'Toggle',
    status: 'planned-Q4-dev',
    description:
      'Toggle component is used as an alternative for the checkbox component, It can be used to switch between two states: often on or off.',
  },
  {
    name: 'Amount',
    status: 'planned-Q4-dev',
    description: 'Amount component is used to display & format various currencies',
  },
  {
    name: 'Accordion',
    status: 'planned-Q4-design',
    description:
      'Accordion component allows the user to show and hide sections of related content on a page',
  },
  {
    name: 'Modal',
    status: 'planned-Q4-design',
    description:
      "Modal is a dialog that focuses the user's attention exclusively on an information via a window that is overlaid on primary content.",
  },
  {
    name: 'Tooltip',
    status: 'planned-Q4-design',
    description:
      'Tooltip is a brief, informative message that appears when a user interacts with an element.',
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
  const sortedData = componentData.sort((a, b) => {
    if (!a.releasedIn || !b.releasedIn) {
      return a.status.localeCompare(b.status);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <Box>
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
    </Box>
  );
};

export { ComponentStatusTable };
