import React, { useState } from 'react'
import { createGlobalStyle } from 'styled-components'

import { formatUnits } from '@ethersproject/units'
import dayjs from 'dayjs'

import { ReactComponent as ConvertIcon } from '../../assets/svg/convert.svg'
import { ReactComponent as DividerIcon } from '../../assets/svg/divider.svg'
import { ReactComponent as SimpleIcon } from '../../assets/svg/simple.svg'
import { ActiveStatusPill } from '../../components/auction/OrderbookTable'
import Table from '../../components/auctions/Table'
import { ErrorBoundaryWithFallback } from '../../components/common/ErrorAndReload'
import { calculateInterestRate } from '../../components/form/InterestRateInputPanel'
import TokenLogo from '../../components/token/TokenLogo'
import { useBonds } from '../../hooks/useBond'
import { useSetNoDefaultNetworkId } from '../../state/orderPlacement/hooks'
import { AllButton, ConvertButtonOutline, SimpleButtonOutline } from '../Auction'
import { getBondStates } from '../BondDetail'
import { TABLE_FILTERS } from '../Portfolio'

import { Bond } from '@/generated/graphql'

const GlobalStyle = createGlobalStyle`
  .siteHeader {
    background: #532DBE !important;
  }
`

const columns = (showAmount = false) => [
  {
    Header: 'Offering',
    accessor: 'bond',
    align: 'flex-start',
    style: { height: '100%', justifyContent: 'center' },
    filter: 'searchInTags',
  },
  {
    Header: 'Amount issued',
    accessor: 'amountIssued',
    tooltip: 'The number of bonds the borrower issued.',
    align: 'flex-start',
    isVisible: !showAmount,
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Issuance date',
    accessor: 'issuanceDate',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Maturity Date',
    accessor: 'maturityDate',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Currency',
    accessor: 'currency',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
  {
    Header: 'Status',
    accessor: 'status',
    align: 'flex-start',
    style: {},
    filter: 'searchInTags',
  },
]

export const BondIcon = ({ id, name, symbol, type }) => (
  <div className="flex flex-row items-center space-x-4">
    <div className="flex">
      <TokenLogo
        size="41px"
        square
        token={{
          address: id,
          symbol: name,
        }}
      />
    </div>
    <div className="flex flex-col text-lg text-[#EEEFEB]">
      <div className="flex items-center space-x-2 capitalize">
        <span>{name.toLowerCase()} </span>
        {type === 'convert' ? <ConvertIcon width={15} /> : <SimpleIcon width={15} />}
      </div>
      <p className="text-sm text-[#9F9F9F] uppercase">{symbol}</p>
    </div>
  </div>
)

export const createTable = (data?: Bond[]) =>
  data.map((bond: Bond) => {
    const {
      auctions,
      clearingPrice,
      createdAt,
      decimals,
      id,
      maturityDate,
      maxSupply,
      name,
      paymentToken,
      symbol,
      type,
    } = bond

    const fixedAPR =
      calculateInterestRate({
        price: clearingPrice,
        maturityDate,
        startDate: auctions?.[0]?.end,
      }) || '-'

    return {
      id,
      search: JSON.stringify(bond),
      type,
      issuanceDate: (
        <span className="uppercase">
          {dayjs(createdAt * 1000)
            .utc()
            .tz()
            .format('LL')}
        </span>
      ),
      cost: clearingPrice
        ? `${Number(formatUnits(BigInt(clearingPrice * maxSupply), decimals)).toLocaleString()} ${
            paymentToken.symbol
          }`
        : '-',
      fixedAPR,
      bond: <BondIcon id={id} name={name} symbol={symbol} type={type} />,

      amountIssued: maxSupply ? Number(formatUnits(maxSupply, decimals)).toLocaleString() : '-',
      amount: maxSupply ? `${Number(formatUnits(maxSupply, decimals)).toLocaleString()}` : '-',
      maturityValue: maxSupply
        ? `${Number(formatUnits(maxSupply, decimals)).toLocaleString()} ${paymentToken.symbol}`
        : `1 ${paymentToken.symbol}`,

      currency: paymentToken.symbol,

      status: getBondStates(bond).isMatured ? (
        <ActiveStatusPill disabled dot={false} title="Matured" />
      ) : (
        <ActiveStatusPill dot={false} title="Active" />
      ),
      maturityDate: (
        <span className="uppercase">
          {dayjs(maturityDate * 1000)
            .utc()
            .tz()
            .format('ll')}
        </span>
      ),

      url: `/products/${id}`,
    }
  })

const Products = () => {
  const { data, loading } = useBonds()
  const [tableFilter, setTableFilter] = useState(TABLE_FILTERS.ALL)

  const tableData = !data
    ? []
    : !tableFilter
    ? createTable(data as Bond[])
    : createTable(data as Bond[]).filter(({ type }) => type === tableFilter)
  useSetNoDefaultNetworkId()

  return (
    <>
      <GlobalStyle />
      <ErrorBoundaryWithFallback>
        <Table
          columns={columns()}
          data={tableData}
          emptyActionClass="!bg-[#532DBE]"
          emptyDescription="There are no products at the moment"
          emptyLogo={
            <>
              <ConvertIcon height={36} width={36} /> <SimpleIcon height={36} width={36} />
            </>
          }
          legendIcons={
            <>
              <AllButton
                active={tableFilter === TABLE_FILTERS.ALL}
                onClick={() => setTableFilter(TABLE_FILTERS.ALL)}
              />
              <DividerIcon />
              <ConvertButtonOutline
                active={tableFilter === TABLE_FILTERS.CONVERT}
                onClick={() => setTableFilter(TABLE_FILTERS.CONVERT)}
              />
              <SimpleButtonOutline
                active={tableFilter === TABLE_FILTERS.SIMPLE}
                onClick={() => setTableFilter(TABLE_FILTERS.SIMPLE)}
              />
            </>
          }
          loading={loading}
          name="products"
          title="Products"
        />
      </ErrorBoundaryWithFallback>
    </>
  )
}

export default Products
