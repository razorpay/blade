import React from 'react';
import styled from 'styled-components';
import { Text } from '~components/Typography';
import { makeSpace } from '~utils';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: ${({ theme }) => makeSpace(theme.spacing[8])};
  margin-bottom: ${({ theme }) => makeSpace(theme.spacing[8])};

  th,
  td {
    width: 20%;
    padding: ${({ theme }) => makeSpace(theme.spacing[4])};
    padding-inline: ${({ theme }) => makeSpace(theme.spacing[7])};
  }

  tr:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.surface.background.gray.moderate};
  }

  tr:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.surface.background.gray.subtle};
  }
`;

const Strong = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return <Text weight="semibold">{children}</Text>;
};

const BundleSizeReport = (): React.ReactElement => {
  return (
    <Table>
      <thead>
        <tr>
          <th />
          <th align="left">
            <Strong>Tooltip</Strong>
          </th>
          <th align="left">
            <Strong>Popover</Strong>
          </th>
          <th align="left">
            <Strong>Guided Tour (Future scope)</Strong>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Strong>Use Case</Strong>
          </td>
          <td>
            <Text>Set context</Text>
          </td>
          <td>
            <Text>Set context</Text>
            <br />
            <Text>Let user take action</Text>
          </td>
          <td>
            <Text>Highlight new feature</Text>
            <br />
            <Text>Let users take action</Text>
          </td>
        </tr>
        <tr>
          <td>
            <Strong>Trigger Interaction</Strong>
          </td>
          <td>
            <Text>Hover</Text>
          </td>
          <td>
            <Text>onClick</Text>
            <br />
            <Text>onLoad</Text>
          </td>
          <td>
            <Text>onClick</Text>
            <br />
            <Text>onLoad</Text>
          </td>
        </tr>
        <tr>
          <td>
            <Strong>Triggered By</Strong>
          </td>
          <td>
            <Text>Interactive elements</Text>
            <br />
            <Text>Non-interactive elements</Text>
          </td>
          <td>
            <Text>On page load</Text>
            <br />
            <Text>Interactive elements</Text>
            <br />
            <Text>Non-interactive elements</Text>
          </td>
          <td>
            <Text>On page load</Text>
            <br />
            <Text>Nav buttons of current popover</Text>
          </td>
        </tr>
        <tr>
          <td>
            <Strong>Content</Strong>
          </td>
          <td>
            <Text>Heading</Text>
            <br />
            <Text>Body Text (Normal + Bold)</Text>
          </td>
          <td>
            <Text>Heading</Text>
            <br />
            <Text>Rich Body Text</Text>
            <br />
            <Text>Links</Text>
            <br />
            <Text>Buttons</Text>
            <br />
            <Text>Assets/ Media</Text>
          </td>
          <td>
            <Text>Heading</Text>
            <br />
            <Text>Rich Body Text</Text>
            <br />
            <Text>Links</Text>
            <br />
            <Text>Buttons</Text>
            <br />
            <Text>Assets/ Media</Text>
          </td>
        </tr>
        <tr>
          <td>
            <Strong>Header</Strong>
          </td>
          <td>
            <Text>Plain Text</Text>
          </td>
          <td>
            <Text>Plain Text</Text>
            <br />
            <Text>Leading Icon</Text>
            <br />
            <Text>Leading Asset</Text>
          </td>
          <td>
            <Text>Plain Text</Text>
            <br />
            <Text>Leading Icon</Text>
            <br />
            <Text>Leading Asset</Text>
          </td>
        </tr>
        <tr>
          <td>
            <Strong>Footer</Strong>
          </td>
          <td>
            <Text>No</Text>
          </td>
          <td>
            <Text>Slot</Text>
            <br />
            <Text>Action Buttons(1 or 2)</Text>
          </td>
          <td>
            <Text>Action Buttons(1 or 2)</Text>
            <br />
            <Text>Nav Buttons (2)</Text>
          </td>
        </tr>
        <tr>
          <td>
            <Strong>Dismiss Button</Strong>
          </td>
          <td>
            <Text>No</Text>
          </td>
          <td>
            <Text>Yes</Text>
          </td>
          <td>
            <Text>Yes</Text>
          </td>
        </tr>
        <tr>
          <td>
            <Strong>Background Overlay</Strong>
          </td>
          <td>
            <Text>No</Text>
          </td>
          <td>
            <Text>No</Text>
          </td>
          <td>
            <Text>Yes</Text>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export { PopoverVsTooltip };
