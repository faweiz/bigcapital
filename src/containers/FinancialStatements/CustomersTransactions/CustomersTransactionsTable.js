import React, { useMemo } from 'react';
import intl from 'react-intl-universal';

import { DataTable, FinancialSheet } from 'components';

import { useCustomersTransactionsColumns } from './components';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';

import { defaultExpanderReducer } from 'utils';

/**
 * Customers transactions table.
 */
export default function CustomersTransactionsTable({
  // #ownProps
  companyName,
}) {
  // Customers transactions context.
  const {
    customersTransactions: { tableRows },
    isCustomersTransactionsLoading,
    query,
  } = useCustomersTransactionsContext();

  // Customers transactions table columns.
  const columns = useCustomersTransactionsColumns();

  const expandedRows = useMemo(
    () => defaultExpanderReducer(tableRows, 4),
    [tableRows],
  );

  const rowClassNames = (row) => {
    return [`row-type--${row.original.row_types}`];
  };

  return (
    <FinancialSheet
      name="customer-transactions"
      companyName={companyName}
      sheetType={intl.get('customers_transactions')}
      loading={isCustomersTransactionsLoading}
      fromDate={query.from_date}
      toDate={query.to_date}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
      />
    </FinancialSheet>
  );
}
