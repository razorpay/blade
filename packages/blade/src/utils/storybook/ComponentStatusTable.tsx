import React from 'react';
import styled from 'styled-components';
import { LinkToStorybook } from './LinkToStorybook';

import type { ComponentStatuses } from './componentStatusData';
import { componentData } from './componentStatusData';
import type { IconComponent } from '~components/Icons';
import {
  StampIcon,
  EditIcon,
  CheckIcon,
  ClockIcon,
  LoaderIcon,
  AlertCircleIcon,
} from '~components/Icons';
import { Heading, Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import type { BadgeProps } from '~components/Badge';
import { Badge } from '~components/Badge';
import { Link } from '~components/Link';
import { makeSpace } from '~utils/makeSpace';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';

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

/**
 * Compares two versions and returns true if newVersion is newer than oldVersion
 */
function isNewerVersion(oldVersion: string, newVersion: string): boolean {
  const oldParts = oldVersion.split('.');
  const newParts = newVersion.split('.');
  for (let i = 0; i < newParts.length; i++) {
    const a = parseInt(newParts[i], 10);
    const b = parseInt(oldParts[i], 10);
    if (a > b) return true;
    if (a < b) return false;
  }
  return false;
}

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

    return isNewerVersion(b.releasedIn, a.releasedIn) ? -1 : 1;
  });

  return (
    <>
      <Heading variant="regular">Lifecycle of a component</Heading>
      <br />
      <BaseBox display="flex" flexDirection="row" marginBottom="spacing.7" gap="spacing.2">
        <Tooltip content="Not yet decided or planned" placement="bottom">
          <TooltipInteractiveWrapper>
            <Badge variant="information" icon={StampIcon}>
              TBD
            </Badge>
          </TooltipInteractiveWrapper>
        </Tooltip>
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
