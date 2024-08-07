export const original = `import Text from '@razorpay/blade-old/src/atoms/Text';
import View from '@razorpay/blade-old/src/atoms/View';
import Flex from '@razorpay/blade-old/src/atoms/Flex';
import Icon from '@razorpay/blade-old/src/atoms/Icon';

import TableBody from 'common/ui/TableBody';
import MobileListView from 'common/ui/MobileListView';
import { amount, createdAt } from 'common/ui/item/pair';

import EntityItemRow from 'merchant/containers/EntityItemRow';
import { isMobileDevice } from 'merchant/components/Home/data';
import {
  customer,
  invoiceId,
  invoiveStatus,
  paymentLink,
  paymentLinkId,
  receiptNumber,
  referenceId,
} from 'merchant/views/Invoices/Invoices/item';
import { shareURL } from 'merchant/views/Invoices/Invoices/helpers';

const PaymentLinkMobileTableListView = (items) => {
  const { item, onShareLinkSuccess = () => {} } = items;

  return (
    <EntityItemRow id={item?.id}>
      <td>
        {paymentLinkId.value(item)}

        {item?.customer_details && customer.value(item)}

        {item?.short_url && (
          <View
            className="link-container"
            data-tip="Copied"
            onClick={() => {
              onShareLinkSuccess();
              shareURL(item.short_url, item?.id);
            }}
          >
            <Flex alignItems="center">
              <Text size="small">
                <div className="share-payment-link">
                  <Icon name="share" size="small" />
                </div>
                Share payment link
              </Text>
            </Flex>
          </View>
        )}
      </td>

      <td>{amount.value(item)}</td>
      <td>{invoiveStatus.value(item)}</td>
    </EntityItemRow>
  );
};

const InvoiceListItem = (props) => {
  const { invoice, columns } = props;

  return (
    <EntityItemRow id={invoice.id}>
      {columns.map(({ title, value }) => (
        <td key={title}>{value(invoice)}</td>
      ))}
    </EntityItemRow>
  );
};

export default (props) => {
  const {
    type,
    invoices,
    isLoading,
    onCopy = () => {},
    EmptyList,
    isPaymentlinksV2Enabled,
  } = props;

  const isPaymentLinksType = type === 'link';
  const label = isPaymentLinksType ? paymentLinkId : invoiceId;
  const listStyle = isPaymentLinksType ? 'Payment-link-list' : 'Invoice-list';
  const receipt = isPaymentlinksV2Enabled ? referenceId : receiptNumber;

  const columns = [label, createdAt, amount, receipt, customer, paymentLink(onCopy), invoiveStatus];

  return isMobileDevice() && isPaymentLinksType ? (
    <MobileListView
      headers={['Payment Link Id', 'Amount', 'Status']}
      TableListItem={PaymentLinkMobileTableListView}
      tableWrapperClass={listStyle}
      items={invoices}
      {...props}
    />
  ) : (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            {columns.map(({ title }) => (
              <th key={title}>{title}</th>
            ))}
          </tr>
        </thead>
        <TableBody isLoading={isLoading} colSpan={8} rows={invoices} emptyTableRow={EmptyList}>
          {invoices.map((invoice) => (
            <InvoiceListItem key={invoice.id} invoice={invoice} columns={columns} />
          ))}
        </TableBody>
      </table>
    </div>
  );
};
`;

export const migrated = `
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@razorpay/blade/components';

import { amount, createdAt } from 'common/ui/item/pair';

import {
  customer,
  invoiceId,
  invoiveStatus,
  paymentLink,
  paymentLinkId,
  receiptNumber,
  referenceId,
} from 'merchant/views/Invoices/Invoices/item';
import { shareURL } from 'merchant/views/Invoices/Invoices/helpers';

const InvoiceListItem = (props) => {
  const { invoice, columns } = props;

  return (
    <TableRow item={invoice}>
      {columns.map(({ title, value }) => (
        <TableCell key={title}>{value(invoice)}</TableCell>
      ))}
    </TableRow>
  );
};

export default (props) => {
  const {
    type,
    invoices,
    isLoading,
    onCopy = () => {},
    EmptyList,
    isPaymentlinksV2Enabled,
  } = props;

  const isPaymentLinksType = type === 'link';
  const label = isPaymentLinksType ? paymentLinkId : invoiceId;
  const receipt = isPaymentlinksV2Enabled ? referenceId : receiptNumber;

  const columns = [label, createdAt, amount, receipt, customer, paymentLink(onCopy), invoiveStatus];

  return (
    <Table data={{ nodes: invoices }} isLoading={isLoading}>
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              {columns.map(({ title }) => (
                <TableHeaderCell key={title}>{title}</TableHeaderCell>
              ))}
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((invoice) => (
              <InvoiceListItem key={invoice.id} invoice={invoice} columns={columns} />
            ))}
          </TableBody>
        </>
      )}
    </Table>
  );
};
`;
