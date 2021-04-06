import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@blueprintjs/core';
import { getColumnWidth } from 'utils';
import { If, Icon } from 'components';
import { CellTextSpan } from 'components/Datatable/Cells';
import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve purchases by items table columns.
 */
export const usePurchasesByItemsTableColumns = () => {
  const { formatMessage } = useIntl();

  // purchases by items context.
  const {
    purchaseByItems: { tableRows },
  } = usePurchaseByItemsContext();

  return React.useMemo(
    () => [
      {
        Header: formatMessage({ id: 'item_name' }),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 180,
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'quantity_purchased' }),
        accessor: 'quantity_purchased_formatted',
        Cell: CellTextSpan,
        className: 'quantity_purchased_formatted',
        width: getColumnWidth(tableRows, `quantity_purchased_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'purchase_amount' }),
        accessor: 'purchase_cost_formatted',
        Cell: CellTextSpan,
        className: 'purchase_cost_formatted',
        width: getColumnWidth(tableRows, `purchase_cost_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'average_price' }),
        accessor: 'average_cost_price_formatted',
        Cell: CellTextSpan,
        className: 'average_cost_price_formatted',
        width: getColumnWidth(tableRows, `average_cost_price_formatted`, {
          minWidth: 180,
        }),
        textOverview: true,
      },
    ],
    [tableRows,formatMessage],
  );
};

/**
 * Purchases by items progress loading bar.
 */
export function PurchasesByItemsLoadingBar() {
  const { isFetching } = usePurchaseByItemsContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}