import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from 'components';
import {
  useTransactionsByReference,
  usePaymentMade,
  usePaymentMadeEditPage,
} from 'hooks/query';

const PaymentMadeDetailContext = React.createContext();

/**
 * Payment made detail provider.
 */
function PaymentMadeDetailProvider({ paymentMadeId, ...props }) {
  // Handle fetch specific payment made details.
  const { data: paymentMade, isLoading: isPaymentMadeLoading } = usePaymentMade(
    paymentMadeId,
    {
      enabled: !!paymentMadeId,
    },
  );
  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionLoading,
  } = useTransactionsByReference(
    {
      reference_id: paymentMadeId,
      reference_type: 'BillPayment',
    },
    { enabled: !!paymentMadeId },
  );

  //provider.
  const provider = {
    transactions,
    paymentMadeId,
    paymentMade,
  };

  const loading = isTransactionLoading || isPaymentMadeLoading;

  return (
    <DrawerLoading loading={loading}>
      <DrawerHeaderContent
        name="payment-made-detail-drawer"
        title={intl.get('payment_made_details')}
      />
      <PaymentMadeDetailContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const usePaymentMadeDetailContext = () =>
  React.useContext(PaymentMadeDetailContext);
export { PaymentMadeDetailProvider, usePaymentMadeDetailContext };