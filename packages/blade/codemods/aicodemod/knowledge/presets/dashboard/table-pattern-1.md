### 2. Custom Component Definitions

#### EntityItemRow Component

```jsx
import { Component } from 'react';
import { connect } from 'react-redux';

class EntityItemRow extends Component {
  render() {
    const {
      id,
      luminateRowId,
      activeEntityId,
      activeSecEntityId,
      rowClasses = '',
      onRowClick,
      item,
      isDisabled,
    } = this.props;
    const receiverType = item?.receiver_type || '';
    const sourceChannel = item?.source_channel || '';
    return (
      <tr
        onClick={() => {
          onRowClick?.({
            id,
            rowData: { receiverType, sourceChannel },
          });
        }}
        className={`${luminateRowId === id ? 'luminate' : ''}${
          activeEntityId === id || activeSecEntityId === id ? ' active' : ''
        }${rowClasses ?? ''}${isDisabled?.(item) ? ' disabled' : ''}`}
        data-testid={`entity-item-row-${id}`}
      >
        {this.props.children}
      </tr>
    );
  }
}

const mapStateToProps = (state) => {
  return state.app;
};

export default connect(mapStateToProps, null)(EntityItemRow);
```

#### TableBody Component

```jsx
import React from 'react';
import TableLoader from 'common/ui/TableLoader';
import EmptyTableRow from 'common/ui/EmptyTableRow';

export default (props) => {
  let tableRowComponent;
  const {
    isLoading,
    emptyTableRow,
    emptyTableMsg,
    colSpan,
    rows,
    children,
    SpinnerComponent,
  } = props;

  if (isLoading) {
    tableRowComponent = SpinnerComponent || <TableLoader colSpan={colSpan} />;
  } else if (!rows.length) {
    tableRowComponent = emptyTableRow || (
      <EmptyTableRow colSpan={colSpan} message={emptyTableMsg} />
    );
  }

  return (
    <tbody>
      {tableRowComponent
        ? typeof tableRowComponent === 'function'
          ? tableRowComponent(colSpan)
          : tableRowComponent
        : children}
    </tbody>
  );
};
```

#### ShowWhen Component

```jsx
export const ShowWhen = (props) => {
  const i18 = useI18Service();
  // creating an abstraction of just consuming splitz experiment, rest service should not be accessed via RouteGuard
  const { abExperiments } = useSplitzService();

  const { loader, children, session, ...rest } = props;

  const showWhenUtilResult = validateUtil(
    {
      options: rest,
      session,
    },
    {
      i18,
      splitz: { abExperiments },
    },
  );

  if (showWhenUtilResult === TAGS_API_NOT_RESOLVED_YET) {
    return loader || <Loader />;
  } else if (showWhenUtilResult) {
    return children;
  }
  return null;
};
```

### 3. Migration Example

#### Original Custom Implimentation Code

```jsx
import Text from '@razorpay/blade-old/src/atoms/Text';
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
```

#### Expected Code after Migration

```jsx
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
            {tableData.length <= 0 ? (
              <EmptyList />
            ) : (
              tableData.map((invoice) => (
                <InvoiceListItem key={invoice.id} invoice={invoice} columns={columns} />
              ))
            )}
          </TableBody>
        </>
      )}
    </Table>
  );
};
```
