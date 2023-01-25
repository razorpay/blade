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
  | `planned-Q${1 | 2 | 3 | 4}`;

type ComponentStatusData = {
  name: string;
  status: ComponentStatuses;
  releasedIn?: string;
  storybookLink?: string;
}[];

const componentData: ComponentStatusData = [
  {
    name: 'Alert',
    status: 'released',
    releasedIn: '1.1.0',
    storybookLink: 'Components/Alert',
  },
  {
    name: 'Badge',
    status: 'released',
    releasedIn: '1.0.0',
    storybookLink: 'Components/Badge',
  },
  {
    name: 'Button',
    status: 'released',
    releasedIn: '0.11.0',
    storybookLink: 'Components/Button',
  },
  {
    name: 'Card',
    status: 'released',
    releasedIn: '5.3.0',
    storybookLink: 'Components/Card',
  },
  {
    name: 'Checkbox',
    status: 'released',
    releasedIn: '0.13.0',
    storybookLink: 'Components/Checkbox/Checkbox',
  },
  {
    name: 'CheckboxGroup',
    status: 'released',
    releasedIn: '0.13.0',
    storybookLink: 'Components/Checkbox/CheckboxGroup',
  },
  {
    name: 'Counter',
    status: 'released',
    releasedIn: '3.6.0',
    storybookLink: 'Components/Counter',
  },
  {
    name: 'IconButton',
    status: 'released',
    releasedIn: '3.6.2',
    storybookLink: 'Components/IconButton',
  },
  {
    name: 'Indicator',
    status: 'released',
    releasedIn: '3.7.0',
    storybookLink: 'Components/Indicator',
  },
  {
    name: 'Link',
    status: 'released',
    releasedIn: '0.13.0',
    storybookLink: 'Components/Link',
  },

  {
    name: 'ProgressBar',
    status: 'released',
    releasedIn: '5.4.0',
    storybookLink: 'Components/ProgressBar',
  },
  {
    name: 'Spinner',
    status: 'released',
    releasedIn: '2.2.0',
    storybookLink: 'Components/Spinner',
  },
  {
    name: 'TextInput',
    status: 'released',
    releasedIn: '2.1.0',
    storybookLink: 'Components/Input/TextInput',
  },
  {
    name: 'TextArea',
    status: 'released',
    releasedIn: '2.3.0',
    storybookLink: 'Components/Input/TextArea',
  },
  {
    name: 'OTPInput',
    status: 'released',
    releasedIn: '3.1.0',
    storybookLink: 'Components/Input/OTPInput',
  },
  {
    name: 'PasswordInput',
    status: 'released',
    releasedIn: '2.5.0',
    storybookLink: 'Components/Input/PasswordInput',
  },
  {
    name: 'Radio',
    status: 'released',
    releasedIn: '1.0.0',
    storybookLink: 'Components/Radio & RadioGroup',
  },
  {
    name: 'RadioGroup',
    status: 'released',
    releasedIn: '1.0.0',
    storybookLink: 'Components/Radio & RadioGroup',
  },
  {
    name: 'Text',
    status: 'released',
    releasedIn: '0.4.0',
    storybookLink: 'Components/Typography/Text',
  },
  {
    name: 'Heading',
    status: 'released',
    releasedIn: '0.6.0',
    storybookLink: 'Components/Typography/Heading',
  },
  {
    name: 'Title',
    status: 'released',
    releasedIn: '0.5.0',
    storybookLink: 'Components/Typography/Title',
  },
  {
    name: 'Code',
    status: 'released',
    releasedIn: '3.0.0',
    storybookLink: 'Components/Typography/Code',
  },
  {
    name: 'SkipNav',
    status: 'released',
    releasedIn: '0.9.0',
    storybookLink: 'Components/Accessibility/SkipNav',
  },
  {
    name: 'VisuallyHidden',
    status: 'released',
    releasedIn: '0.9.0',
    storybookLink: 'Components/Accessibility/VisuallyHidden',
  },
  {
    name: 'ListView',
    status: 'in-development',
  },
  {
    name: 'DropDown',
    status: 'in-development',
  },
  {
    name: 'Layout',
    status: 'in-api-spec',
  },
  {
    name: 'BottomSheet',
    status: 'planned-Q4',
  },
  {
    name: 'Tags',
    status: 'planned-Q4',
  },
  {
    name: 'Toggle',
    status: 'planned-Q4',
  },
  {
    name: 'Amount',
    status: 'planned-Q4',
  },
  {
    name: 'Accordion',
    status: 'planned-Q4',
  },
  {
    name: 'Modal',
    status: 'planned-Q4',
  },
  {
    name: 'Tooltip',
    status: 'planned-Q4',
  },
];

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
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
    'planned-Q1': { label: 'Planned: Q1', variant: 'information', icon: ClockIcon },
    'planned-Q2': { label: 'Planned: Q2', variant: 'information', icon: ClockIcon },
    'planned-Q3': { label: 'Planned: Q3', variant: 'information', icon: ClockIcon },
    'planned-Q4': { label: 'Planned: Q4', variant: 'information', icon: ClockIcon },
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
            <th align="right">
              <Text weight="bold">Released In</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {componentData.map((data) => {
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
