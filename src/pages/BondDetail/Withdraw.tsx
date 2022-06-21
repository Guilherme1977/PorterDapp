import React, { useState } from 'react'

import { formatUnits, parseUnits } from '@ethersproject/units'
import { useContractRead, useContractWrite } from 'wagmi'

import { SummaryItem } from '@/components/ProductCreate/SummaryItem'
import { ActionButton } from '@/components/auction/Claimer'
import AmountInputPanel from '@/components/form/AmountInputPanel'
import WarningModal from '@/components/modals/WarningModal'
import BOND_ABI from '@/constants/abis/bond.json'
import { Bond } from '@/generated/graphql'

export const Withdraw = ({
  bond,
}: {
  bond: Pick<
    Bond,
    | 'id'
    | 'owner'
    | 'collateralTokenAmount'
    | 'paymentToken'
    | 'collateralToken'
    | 'convertibleTokenAmount'
    | 'collateralRatio'
    | 'maxSupply'
    | 'amountUnpaid'
  >
}) => {
  const [collateralAmount, setCollateralAmount] = useState('0')
  const [paymentAmount, setPaymentAmount] = useState('0')
  const { error, isError, isLoading, reset, write } = useContractWrite(
    {
      addressOrName: bond?.id,
      contractInterface: BOND_ABI,
    },
    'withdrawExcessCollateral',
  )
  const onMaxCollateral = () => {
    setCollateralAmount(
      formatUnits(previewWithdrawExcessCollateral.toString(), bond?.collateralToken?.decimals),
    )
  }

  const onMaxPayment = () => {
    setPaymentAmount(
      formatUnits(previewWithdrawExcessPayment.toString(), bond?.paymentToken?.decimals),
    )
  }

  const { data: previewWithdrawExcessCollateral } = useContractRead(
    { addressOrName: bond?.id, contractInterface: BOND_ABI },
    'previewWithdrawExcessCollateral',
  )
  const excessCollateralDisplay = Number(
    formatUnits(
      (previewWithdrawExcessCollateral || '0').toString(),
      bond?.collateralToken?.decimals,
    ),
  ).toLocaleString()

  const { data: previewWithdrawExcessPayment } = useContractRead(
    { addressOrName: bond?.id, contractInterface: BOND_ABI },
    'previewWithdrawExcessPayment',
  )
  const excessPaymentDisplay = Number(
    formatUnits((previewWithdrawExcessPayment || '0').toString(), bond?.paymentToken?.decimals),
  ).toLocaleString()

  return (
    <>
      <div className="space-y-2">
        <SummaryItem
          border={false}
          text={`${Number(
            formatUnits(bond?.collateralTokenAmount, bond?.collateralToken?.decimals),
          ).toLocaleString()} ${bond?.collateralToken?.symbol}`}
          tip="The amount of total collateral in the Bond contract."
          title="Collateral locked"
        />
        <SummaryItem
          border={false}
          text={`${excessCollateralDisplay} ${bond?.collateralToken?.symbol}`}
          tip="At the moment, the amount of collateral available to withdraw from the contract."
          title="Collateral available to withdraw"
        />
        <AmountInputPanel
          amountText="Amount of collateral to withdraw"
          amountTooltip="This is your withdraw amount"
          maxTitle="Withdraw all"
          onMax={onMaxCollateral}
          onUserSellAmountInput={setCollateralAmount}
          token={bond?.collateralToken}
          value={collateralAmount || ''}
        />

        <ActionButton
          className={`${isLoading ? 'loading' : ''}`}
          onClick={() =>
            write({
              args: [parseUnits(collateralAmount, bond?.collateralToken.decimals), bond?.owner],
            })
          }
        >
          Withdraw Collateral
        </ActionButton>
      </div>
      <div className="space-y-2">
        <SummaryItem
          border={false}
          text={`${Number(
            formatUnits(
              Math.abs(bond?.maxSupply - bond?.amountUnpaid).toString(),
              bond?.paymentToken?.decimals,
            ),
          ).toLocaleString()} ${bond?.paymentToken?.symbol}`}
          tip="The amount of total payment in the Bond contract."
          title="Payment locked"
        />
        <SummaryItem
          border={false}
          text={`${excessPaymentDisplay} ${bond?.paymentToken?.symbol}`}
          tip="At the moment, the amount of payment available to withdraw from the contract."
          title="Payment available to withdraw"
        />
        <AmountInputPanel
          amountText="Amount of payment to withdraw"
          amountTooltip="This is your withdraw amount"
          maxTitle="Withdraw all"
          onMax={onMaxPayment}
          onUserSellAmountInput={setPaymentAmount}
          token={bond?.paymentToken}
          value={paymentAmount || ''}
        />

        <ActionButton
          className={`${isLoading ? 'loading' : ''}`}
          onClick={() =>
            write({
              args: [parseUnits(paymentAmount, bond?.paymentToken.decimals), bond?.owner],
            })
          }
        >
          Withdraw Payment
        </ActionButton>
        <WarningModal content={error?.message} isOpen={isError} onDismiss={reset} />
      </div>
    </>
  )
}
