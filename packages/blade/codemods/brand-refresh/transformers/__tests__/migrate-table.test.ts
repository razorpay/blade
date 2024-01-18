import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate the ActionList component', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
            <Table {...args} data={data} surfaceLevel={3}>
                {(tableData) => (
                    <>
                        <TableHeader>
                        <TableHeaderRow>
                            <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                            <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                            <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
                        </TableHeaderRow>
                        </TableHeader>
                        <TableBody>
                        {tableData.map((tableItem, index) => (
                            <TableRow key={index} item={tableItem}>
                            <TableCell>
                                <Code size="medium">{tableItem.paymentId}</Code>
                            </TableCell>
                            <TableCell>
                                <Amount value={tableItem.amount} />
                            </TableCell>
                            <TableCell>{tableItem.account}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </>
                )}
            </Table>

            <Table {...args} data={data} surfaceLevel={2}>
                {(tableData) => (
                    <>
                        <TableHeader>
                        <TableHeaderRow>
                            <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                            <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                            <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
                        </TableHeaderRow>
                        </TableHeader>
                        <TableBody>
                        {tableData.map((tableItem, index) => (
                            <TableRow key={index} item={tableItem}>
                            <TableCell>
                                <Code size="medium">{tableItem.paymentId}</Code>
                            </TableCell>
                            <TableCell>
                                <Amount value={tableItem.amount} />
                            </TableCell>
                            <TableCell>{tableItem.account}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </>
                )}
            </Table>

            <Table {...args} data={data} surfaceLevel={1}>
                {(tableData) => (
                    <>
                        <TableHeader>
                        <TableHeaderRow>
                            <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                            <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                            <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
                        </TableHeaderRow>
                        </TableHeader>
                        <TableBody>
                        {tableData.map((tableItem, index) => (
                            <TableRow key={index} item={tableItem}>
                            <TableCell>
                                <Code size="medium">{tableItem.paymentId}</Code>
                            </TableCell>
                            <TableCell>
                                <Amount value={tableItem.amount} />
                            </TableCell>
                            <TableCell>{tableItem.account}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </>
                )}
            </Table>
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
                <Table {...args} data={data}>
                    {(tableData) => (
                        <>
                            <TableHeader>
                            <TableHeaderRow>
                                <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                                <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
                            </TableHeaderRow>
                            </TableHeader>
                            <TableBody>
                            {tableData.map((tableItem, index) => (
                                <TableRow key={index} item={tableItem}>
                                <TableCell>
                                    <Code size="medium">{tableItem.paymentId}</Code>
                                </TableCell>
                                <TableCell>
                                    <Amount value={tableItem.amount} />
                                </TableCell>
                                <TableCell>{tableItem.account}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </>
                    )}
                </Table>

                <Table {...args} data={data}>
                    {(tableData) => (
                        <>
                            <TableHeader>
                            <TableHeaderRow>
                                <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                                <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
                            </TableHeaderRow>
                            </TableHeader>
                            <TableBody>
                            {tableData.map((tableItem, index) => (
                                <TableRow key={index} item={tableItem}>
                                <TableCell>
                                    <Code size="medium">{tableItem.paymentId}</Code>
                                </TableCell>
                                <TableCell>
                                    <Amount value={tableItem.amount} />
                                </TableCell>
                                <TableCell>{tableItem.account}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </>
                    )}
                </Table>

                <Table {...args} data={data}>
                    {(tableData) => (
                        <>
                            <TableHeader>
                            <TableHeaderRow>
                                <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                                <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
                            </TableHeaderRow>
                            </TableHeader>
                            <TableBody>
                            {tableData.map((tableItem, index) => (
                                <TableRow key={index} item={tableItem}>
                                <TableCell>
                                    <Code size="medium">{tableItem.paymentId}</Code>
                                </TableCell>
                                <TableCell>
                                    <Amount value={tableItem.amount} />
                                </TableCell>
                                <TableCell>{tableItem.account}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </>
                    )}
                </Table>
            </>
          );"
  `);
});
