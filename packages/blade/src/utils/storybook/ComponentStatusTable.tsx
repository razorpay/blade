import React from 'react';
import styled from 'styled-components';
import { LinkToStorybook } from './LinkToStorybook';

import type { ComponentStatuses } from './componentStatusData';
import { componentData } from './componentStatusData';
import type { IconComponent } from '~components/Icons';
import {
  CloseIcon,
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
    background-color: ${({ theme }) => theme.colors.surface.background.gray.subtle};
  }

  tr:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.surface.background.gray.moderate};
  }
`;

const ComponentStatusBadge = ({ status }: { status: ComponentStatuses }): React.ReactElement => {
  const badgeVariants: Record<
    ComponentStatuses,
    { label: string; color: BadgeProps['color']; icon: IconComponent }
  > = {
    released: { label: 'Released', color: 'positive', icon: CheckIcon },
    deprecated: { label: 'Deprecated', color: 'negative', icon: AlertCircleIcon },
    'to-be-decided': { label: 'TBD', color: 'information', icon: StampIcon },
    'in-design': { label: 'In Design', color: 'notice', icon: LoaderIcon },
    'in-api-spec': { label: 'API In Progress', color: 'notice', icon: EditIcon },
    'in-development': { label: 'In Development', color: 'notice', icon: LoaderIcon },
    'planned-Q1-dev': { label: 'Planned: Q1 Dev', color: 'information', icon: ClockIcon },
    'planned-Q2-dev': { label: 'Planned: Q2 Dev', color: 'information', icon: ClockIcon },
    'planned-Q3-dev': { label: 'Planned: Q3 Dev', color: 'information', icon: ClockIcon },
    'planned-Q4-dev': { label: 'Planned: Q4 Dev', color: 'information', icon: ClockIcon },
    'planned-Q1-design': { label: 'Planned: Q1 Design', color: 'information', icon: ClockIcon },
    'planned-Q2-design': { label: 'Planned: Q2 Design', color: 'information', icon: ClockIcon },
    'planned-Q3-design': { label: 'Planned: Q3 Design', color: 'information', icon: ClockIcon },
    'planned-Q4-design': { label: 'Planned: Q4 Design', color: 'information', icon: ClockIcon },
  };

  return (
    <Badge color={badgeVariants[status].color} icon={badgeVariants[status].icon}>
      {badgeVariants[status].label}
    </Badge>
  );
};

const ReleasedInLink = ({
  version,
  framework = 'react',
}: {
  version?: string;
  framework?: 'react' | 'svelte';
}): React.ReactElement => {
  const ghUrlReact = 'https://github.com/razorpay/blade/releases/tag/%40razorpay%2Fblade%40';
  const ghUrlSvelte =
    'https://github.com/razorpay/blade/releases/tag/%40razorpay%2Fblade-svelte%40';
  const ghUrl = framework === 'svelte' ? ghUrlSvelte : ghUrlReact;

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

  const sortedData = [...componentData].sort((a, b) => {
    const aReact = a.frameworks.react;
    const bReact = b.frameworks.react;

    if (!aReact?.releasedIn || !bReact?.releasedIn) {
      const aStatus = aReact?.status ?? 'to-be-decided';
      const bStatus = bReact?.status ?? 'to-be-decided';
      return unreleasedComponentsSort.indexOf(aStatus) > unreleasedComponentsSort.indexOf(bStatus)
        ? 1
        : -1;
    }

    return isNewerVersion(bReact.releasedIn, aReact.releasedIn) ? -1 : 1;
  });

  return (
    <>
      <Heading>Lifecycle of a component</Heading>
      <br />
      <BaseBox display="flex" flexDirection="row" marginBottom="spacing.7" gap="spacing.2">
        <Tooltip content="Not yet decided or planned" placement="bottom">
          <TooltipInteractiveWrapper>
            <Badge color="information" icon={StampIcon}>
              TBD
            </Badge>
          </TooltipInteractiveWrapper>
        </Tooltip>
        ➡️
        <Badge color="information" icon={ClockIcon}>
          Planned: Qn Design
        </Badge>
        ➡️
        <Badge color="information" icon={ClockIcon}>
          Planned: Qn Dev
        </Badge>
        ➡️
        <Badge color="notice" icon={LoaderIcon}>
          In Design
        </Badge>
        ➡️
        <Badge color="notice" icon={EditIcon}>
          API In Progress
        </Badge>
        ➡️
        <Badge color="notice" icon={LoaderIcon}>
          In Development
        </Badge>
        ➡️
        <Badge color="positive" icon={CheckIcon}>
          Released
        </Badge>
      </BaseBox>
      <BaseBox>
        <Table>
          <thead>
            <tr>
              <th align="left">
                <Text weight="semibold">Component</Text>
              </th>
              <th style={{ width: '30%' }} align="right">
                <Text weight="semibold">Status</Text>
              </th>
              <th style={{ width: '50%' }} align="left">
                <Text weight="semibold">Description</Text>
              </th>
              <th style={{ width: '10%' }} align="center">
                <Text weight="semibold">Web</Text>
              </th>
              <th style={{ width: '10%' }} align="center">
                <Text weight="semibold">RN</Text>
              </th>
              <th style={{ width: '10%' }} align="center">
                <Text weight="semibold">Svelte</Text>
              </th>
              <th align="right">
                <Text weight="semibold">Released In</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((data) => {
              const reactData = data.frameworks.react;
              const svelteData = data.frameworks.svelte;
              const reactStatus = reactData?.status ?? 'to-be-decided';
              const svelteStatus = svelteData?.status ?? 'to-be-decided';
              const releasedIn = reactData?.releasedIn;
              const storybookLink = reactData?.storybookLink;

              const isAvailableOnWeb = data.platform === 'web' || data.platform === 'all';
              const isAvailableOnMobile = data.platform === 'mobile' || data.platform === 'all';
              const isSvelteReleased = svelteStatus === 'released';

              return (
                <tr key={data.name}>
                  <td align="left">
                    {storybookLink ? (
                      <LinkToStorybook url={storybookLink}>{data.name}</LinkToStorybook>
                    ) : (
                      <Text>{data.name}</Text>
                    )}
                  </td>
                  <td align="right">
                    <ComponentStatusBadge status={reactStatus} />
                  </td>
                  <td align="left">
                    <Text size="medium" color="surface.text.gray.subtle">
                      {data.description}
                    </Text>
                  </td>
                  <td align="center">
                    {isAvailableOnWeb && reactStatus === 'released' ? (
                      <CheckIcon color="feedback.icon.positive.intense" />
                    ) : (
                      <CloseIcon color="feedback.icon.negative.intense" />
                    )}
                  </td>
                  <td align="center">
                    {isAvailableOnMobile && reactStatus === 'released' ? (
                      <CheckIcon color="feedback.icon.positive.intense" />
                    ) : (
                      <CloseIcon color="feedback.icon.negative.intense" />
                    )}
                  </td>
                  <td align="center">
                    {isSvelteReleased ? (
                      <CheckIcon color="feedback.icon.positive.intense" />
                    ) : (
                      <CloseIcon color="feedback.icon.negative.intense" />
                    )}
                  </td>
                  <td align="right">
                    <ReleasedInLink version={releasedIn} framework="react" />
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

export { ComponentStatusTable, ComponentStatusBadge };
