import { Box } from '~components/Box';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from '~components/Table';
import { Code, Text } from '~components/Typography';

const ArgsTable = ({
  data,
  marginBottom = 'spacing.8',
  marginTop = 'spacing.4',
}: {
  data: Record<string, string | { note: string; type: string | JSX.Element } | JSX.Element>;
  marginBottom?: BaseBoxProps['marginBottom'];
  marginTop?: BaseBoxProps['marginTop'];
}): JSX.Element => {
  const nodes = Object.entries(data).map(([prop, type], index) => {
    return {
      id: index,
      prop,
      type,
    };
  });

  return (
    <div className="sb-unstyled">
      <Box marginBottom={marginBottom} marginTop={marginTop}>
        <Table data={{ nodes }}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Prop</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => {
                  const propType = tableItem.type;
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
                    <TableRow key={index} item={tableItem}>
                      <TableCell>
                        <Text size="medium" variant="body">
                          <Code size="medium">{tableItem.prop}</Code> {propNote}
                        </Text>
                      </TableCell>
                      <TableCell>{propTypeJSX}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </>
          )}
        </Table>
      </Box>
    </div>
  );
};

export { ArgsTable };
