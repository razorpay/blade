import styled from 'styled-components';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import { Code, Text } from '~components/Typography';

const StyledArgsTable = styled(BaseBox)(
  (props) => `
  font-family: ${props.theme.typography.fonts.family.text};
  text-align: left;
  min-width: 500px;

  &,
  & th,
  & td {
    border: 1px solid ${props.theme.colors.surface.border.normal.lowContrast};
    border-collapse: collapse;
  }

  & td,
  & th {
    padding: ${props.theme.spacing[3]}px;
  }
`,
);

const ArgsTable = ({
  data,
  marginBottom = 'spacing.8',
  marginTop = 'spacing.4',
}: {
  data: Record<string, string | { note: string; type: string | JSX.Element } | JSX.Element>;
  marginBottom?: BaseBoxProps['marginBottom'];
  marginTop?: BaseBoxProps['marginTop'];
}): JSX.Element => {
  return (
    <StyledArgsTable as="table" marginBottom={marginBottom} marginTop={marginTop}>
      <tr>
        <th>
          <Text weight="bold">Prop</Text>
        </th>
        <th>
          <Text weight="bold">Type</Text>
        </th>
      </tr>
      {Object.entries(data).map(([propName, propType]) => {
        const isTypeObject = typeof propType === 'object' && 'note' in propType;
        const propNote = isTypeObject ? `(${propType.note})` : undefined;
        const propTypeJSX = (() => {
          if (typeof propType === 'string') {
            return <Text>{propType}</Text>;
          }

          if (isTypeObject) {
            return <Text>{propType.type}</Text>;
          }

          return propType;
        })();

        return (
          <tr key={propName}>
            <td>
              <Text size="medium" variant="caption">
                <Code size="medium">{propName}</Code> {propNote}
              </Text>
            </td>

            <td>{propTypeJSX}</td>
          </tr>
        );
      })}
    </StyledArgsTable>
  );
};

export { ArgsTable };
