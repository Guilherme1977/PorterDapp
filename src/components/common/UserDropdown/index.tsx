import React, { Fragment } from 'react'
import styled from 'styled-components'

import { WalletConnectConnector } from '@anxolin/walletconnect-connector'
import { Menu, Transition } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'

import { ChevronRight } from '@/components/icons/ChevronRight'
import { TransactionsModal } from '@/components/modals/TransactionsModal'
import { useActiveWeb3React } from '@/hooks'
import { getChainName, truncateStringInTheMiddle } from '@/utils/tools'

export const DropdownButton = styled.button`
  background-color: #e0e0e0;
  border-radius: 100px;
  color: #1e1e1e;
  font-size: 14px;
  height: 29px;
  font-weight: 400;
  align-items: center;
  text-align: center;
  display: flex;

  .fill {
    fill: #1e1e1e;
  }

  &:hover {
    background-color: #ffffff;
  }
`

const Address = styled.div``

const AddressText = styled.div``

const Connection = styled.div`
  align-items: center;
  display: flex;
`

const ConnectionStatus = styled.div`
  background-color: ${({ theme }) => theme.green1};
  border-radius: 8px;
  flex-grow: 0;
  flex-shrink: 0;
  height: 8px;
  margin-right: 4px;
  width: 8px;
`

const ConnectionText = styled.div`
  color: ${({ theme }) => theme.green1};
  font-size: 9px;
  font-weight: 400;
  margin-bottom: -2px;
`

const UserDropdownButton = () => {
  const { account } = useWeb3React()

  return (
    <Menu.Button as="div">
      <DropdownButton className="w-full btn btn-sm">
        <Address>
          <div className="flex flex-row items-center w-full lg:flex-row nowrap">
            <AddressText className="addressText" title={account}>
              {account ? truncateStringInTheMiddle(account, 5, 3) : 'Invalid address.'}
            </AddressText>
            <div className="mx-1 after:bg-gray-300 before:bg-gray-300 divider divider-horizontal" />
            <div className="grid grow place-items-center">
              <svg
                className="chevronDown"
                fill="none"
                height="15"
                viewBox="0 0 14 15"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="fill"
                  clipRule="evenodd"
                  d="M3.69653 3.96083C3.92437 4.18859 3.92443 4.55794 3.69666 4.78578C3.04417 5.43849 2.59986 6.27001 2.41992 7.17522C2.23998 8.08042 2.33249 9.01865 2.68574 9.87128C3.03899 10.7239 3.63713 11.4527 4.40453 11.9654C5.17193 12.4781 6.07412 12.7517 6.99703 12.7517C7.91995 12.7517 8.82214 12.4781 9.58954 11.9654C10.3569 11.4527 10.9551 10.7239 11.3083 9.87128C11.6616 9.01865 11.7541 8.08042 11.5741 7.17522C11.3942 6.27001 10.9499 5.43849 10.2974 4.78578C10.0696 4.55794 10.0697 4.18859 10.2975 3.96083C10.5254 3.73306 10.8947 3.73312 11.1225 3.96096C11.9381 4.77684 12.4935 5.81625 12.7184 6.94775C12.9433 8.07925 12.8277 9.25205 12.3861 10.3178C11.9446 11.3836 11.1969 12.2946 10.2377 12.9354C9.27842 13.5763 8.15068 13.9184 6.99703 13.9184C5.84339 13.9184 4.71565 13.5763 3.7564 12.9354C2.79716 12.2946 2.04948 11.3836 1.60792 10.3178C1.16635 9.25205 1.05072 8.07925 1.27565 6.94775C1.50057 5.81625 2.05595 4.77684 2.87157 3.96096C3.09934 3.73312 3.46868 3.73306 3.69653 3.96083Z"
                  fillRule="evenodd"
                />
                <path
                  className="fill"
                  clipRule="evenodd"
                  d="M6.99996 1.08325C7.32213 1.08325 7.58329 1.34442 7.58329 1.66659V7.49992C7.58329 7.82208 7.32213 8.08325 6.99996 8.08325C6.67779 8.08325 6.41663 7.82208 6.41663 7.49992V1.66659C6.41663 1.34442 6.67779 1.08325 6.99996 1.08325Z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </Address>
      </DropdownButton>
    </Menu.Button>
  )
}

interface Props {
  disabled?: boolean
}

const HeadlessDropdown = ({ children }) => (
  <Menu as="div" className="fixed z-10">
    <UserDropdownButton />
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="flex fixed flex-col p-2 mt-2 w-56 bg-base-100 rounded-md focus:outline-none ring-1 ring-black ring-opacity-5 shadow-lg origin-bottom-right">
        {children}
      </Menu.Items>
    </Transition>
  </Menu>
)

export const UserDropdown: React.FC<Props> = ({ disabled = false }) => {
  const { chainId } = useActiveWeb3React()
  const [transactionsModalVisible, setTransactionsModalVisible] = React.useState(false)

  const { connector, deactivate, library } = useActiveWeb3React()

  const getWalletName = React.useCallback((): string => {
    const provider = library?.provider

    const isMetaMask = provider
      ? Object.prototype.hasOwnProperty.call(provider, 'isMetaMask') && provider?.isMetaMask
      : undefined
    const isWalletConnect = provider
      ? Object.prototype.hasOwnProperty.call(provider, 'wc')
      : undefined

    return isMetaMask ? 'MetaMask' : isWalletConnect ? 'WalletConnect' : 'Safe App'
  }, [library])

  const disconnect = React.useCallback(async () => {
    deactivate()
    if (connector instanceof WalletConnectConnector && typeof connector.close === 'function') {
      connector.close()
      connector.walletConnectProvider = null
      localStorage.removeItem('walletconnect')
    }
  }, [connector, deactivate])

  const UserDropdownContent = () => {
    const items = [
      {
        title: 'Wallet',
        value: (
          <div>
            {getWalletName()}
            <Connection>
              <ConnectionStatus />
              <ConnectionText>{getChainName(chainId)}</ConnectionText>
            </Connection>
          </div>
        ),
      },
      {
        title: 'Your transactions',
        onClick: () => {
          setTransactionsModalVisible(true)
        },
        value: <ChevronRight />,
      },
    ]

    return (
      <>
        {items.map((item, index) => (
          <Menu.Item key={index}>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-gray-700' : ''
                } group flex w-full justify-between items-center rounded-md p-2 my-1 text-sm text-white`}
                onClick={item.onClick && item.onClick}
              >
                <span>{item.title}</span>
                <span>{item.value}</span>
              </button>
            )}
          </Menu.Item>
        ))}

        <Menu.Item>
          {({ active }) => (
            <button
              className="group p-2 my-1 w-full text-sm text-center !text-white rounded-md btn-error"
              onClick={disconnect}
            >
              Disconnect
            </button>
          )}
        </Menu.Item>
      </>
    )
  }

  return (
    <div className="w-[130px] h-[32px]">
      <HeadlessDropdown>
        <UserDropdownContent />
      </HeadlessDropdown>
      <TransactionsModal
        isOpen={transactionsModalVisible}
        onDismiss={() => setTransactionsModalVisible(false)}
      />
    </div>
  )
}
