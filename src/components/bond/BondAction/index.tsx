import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { formatUnits, parseUnits } from '@ethersproject/units'
import { Token, TokenAmount } from '@josojo/honeyswap-sdk'
import { useWeb3React } from '@web3-react/core'
import dayjs from 'dayjs'
import { round } from 'lodash'

import { useActiveWeb3React } from '../../../hooks'
import { useBond } from '../../../hooks/useBond'
import { getValuePerBond } from '../../../hooks/useBondExtraDetails'
import { useConvertBond } from '../../../hooks/useConvertBond'
import { usePreviewBond } from '../../../hooks/usePreviewBond'
import { useRedeemBond } from '../../../hooks/useRedeemBond'
import { useTokenPrice } from '../../../hooks/useTokenPrice'
import { BondActions, getBondStates } from '../../../pages/BondDetail'
import { useActivePopups, useWalletModalToggle } from '../../../state/application/hooks'
import { getExplorerLink, getTokenDisplay } from '../../../utils'
import { ActionButton } from '../../auction/Claimer'
import { ActiveStatusPill } from '../../auction/OrderbookTable'
import Tooltip from '../../common/Tooltip'
import AmountInputPanel from '../../form/AmountInputPanel'
import ConfirmationDialog, { ReviewConvert } from '../../modals/ConfirmationDialog'
import { FieldRowTokenSymbol } from '../../pureStyledComponents/FieldRow'
import TokenLogo from '../../token/TokenLogo'

export const TokenPill = ({ token }) => {
  const { chainId } = useActiveWeb3React()
  const noPropagation = (e) => e.stopPropagation()

  let displayName = ''
  if (token) {
    displayName = getTokenDisplay(token)
  }

  return token ? (
    <a
      className="flex flex-row items-center p-1 px-2 pl-1 space-x-2 bg-[#2C2C2C] rounded-full cursor-pointer"
      href={getExplorerLink(chainId, token.address || token.id, 'address')}
      onClick={noPropagation}
      rel="noreferrer"
      target="_blank"
    >
      {(token.address || token.id) && (
        <TokenLogo
          size={'16px'}
          token={{
            address: token.address || token.id,
            symbol: token.symbol,
          }}
        />
      )}
      {displayName && <FieldRowTokenSymbol>{token.symbol}</FieldRowTokenSymbol>}
    </a>
  ) : null
}

export const TokenInfo = ({ disabled = false, extra = '', plus = false, token, value }) => {
  return (
    <div
      className={`text-base text-white ${
        disabled ? 'text-[#696969]' : 'text-white'
      } flex justify-between`}
    >
      <div className="space-x-2">
        <span>{value || '-'}</span>
        <span className="text-[#696969]">{extra}</span>
      </div>
      <TokenPill token={token} />
    </div>
  )
}

const getActionText = (componentType) => {
  if (componentType === BondActions.Redeem) return 'Redeem'
  if (componentType === BondActions.Convert) return 'Convert'
  return 'Unknown'
}

const BondAction = ({
  componentType,
  overwriteBondId,
}: {
  componentType: BondActions
  overwriteBondId?: string
}) => {
  const { account, chainId } = useWeb3React()
  const activePopups = useActivePopups()
  const params = useParams()

  const bondId = overwriteBondId || params?.bondId
  const { data: bondInfo } = useBond(bondId)
  const bondTokenBalance = bondInfo?.tokenBalances?.[0]?.amount || 0

  const [bondsToRedeem, setBondsToRedeem] = useState(null)
  const [openReviewModal, setOpenReviewModal] = useState<boolean>(false)
  const [previewRedeemVal, setPreviewRedeemVal] = useState<string[]>(['0', '0'])
  const [previewConvertVal, setPreviewConvertVal] = useState<string>('0')
  const isConvertComponent = componentType === BondActions.Convert

  const [tokenDetails, setTokenDetails] = useState({ BondAmount: null, payTok: null, tok: null })

  const { isActive, isDefaulted, isMatured, isPaid, isPartiallyPaid } = getBondStates(bondInfo)

  useEffect(() => {
    let BondAmount = null
    let tok = null
    let payTok = null

    if (bondInfo) {
      const bondsToRedeemBigNumber =
        Number(bondsToRedeem) && parseUnits(bondsToRedeem, bondInfo.decimals)
      tok = new Token(chainId, bondInfo.id, bondInfo.decimals, bondInfo.symbol, bondInfo.name)
      payTok = new Token(
        chainId,
        bondInfo?.paymentToken?.id,
        bondInfo?.paymentToken?.decimals,
        bondInfo?.paymentToken?.symbol,
        bondInfo?.paymentToken?.name,
      )
      BondAmount = new TokenAmount(tok, bondsToRedeemBigNumber.toString())
      setTokenDetails({ BondAmount, tok, payTok })
    }
  }, [chainId, bondsToRedeem, bondInfo])

  // these names r so bad
  const { BondAmount, tok } = tokenDetails

  const { redeem } = useRedeemBond(BondAmount, bondId)
  const { convert } = useConvertBond(BondAmount, bondId)
  const { previewConvert, previewRedeem } = usePreviewBond(bondId)
  const toggleWalletModal = useWalletModalToggle()
  const convertiblePerBond = getValuePerBond(bondInfo, bondInfo?.convertibleRatio)
  const { data: collateralTokenPrice } = useTokenPrice(bondInfo?.collateralToken.id)
  const convertibleValue = round(convertiblePerBond * collateralTokenPrice, 3)

  useEffect(() => {
    if (!BondAmount) return

    if (componentType === BondActions.Redeem) {
      previewRedeem(BondAmount).then((r) => {
        const [paymentTokens, collateralTokens] = r
        console.log({ paymentTokens }, collateralTokens)
        // returned in paymentTokens, collateralTokens
        setPreviewRedeemVal([
          formatUnits(paymentTokens, bondInfo?.paymentToken.decimals),
          formatUnits(collateralTokens, bondInfo?.collateralToken?.decimals),
        ])
      })
    }

    if (isConvertComponent) {
      previewConvert(BondAmount).then((r) => {
        setPreviewConvertVal(formatUnits(r, bondInfo?.collateralToken?.decimals))
      })
    }
  }, [
    isConvertComponent,
    componentType,
    bondsToRedeem,
    bondInfo?.paymentToken.decimals,
    bondInfo?.collateralToken?.decimals,
    previewRedeem,
    previewConvert,
    BondAmount,
  ])

  useEffect(() => {
    if (activePopups.length) {
      setBondsToRedeem('')
    }
  }, [activePopups])

  const isConvertable = useMemo(() => {
    if (componentType !== BondActions.Convert) return false

    if (isMatured) {
      return { error: 'Bond is matured' }
    }

    if (!account) return { error: 'Not logged in' }

    const validInput = Number(bondsToRedeem) && parseUnits(bondsToRedeem, bondInfo?.decimals).gt(0)
    if (!validInput) return { error: 'Input must be > 0' }

    const notEnoughBalance =
      Number(bondsToRedeem) &&
      parseUnits(bondsToRedeem, bondInfo?.decimals).gt(
        parseUnits(bondTokenBalance, bondInfo?.decimals),
      )
    if (notEnoughBalance) return { error: 'Bonds to convert exceeds balance' }

    return true
  }, [componentType, account, bondTokenBalance, bondInfo?.decimals, bondsToRedeem, isMatured])

  const isRedeemable = useMemo(() => {
    if (componentType !== BondActions.Redeem) return false
    if (!account) return { error: 'Not logged in' }
    if (!isPaid && !isMatured && !isDefaulted) {
      return { error: 'Must be fully paid, matured, or defaulted' }
    }

    const validInput = Number(bondsToRedeem) && parseUnits(bondsToRedeem, bondInfo?.decimals).gt(0)
    if (!validInput) return { error: 'Input must be > 0' }

    const notEnoughBalance =
      Number(bondsToRedeem) &&
      parseUnits(bondsToRedeem, bondInfo?.decimals).gt(
        parseUnits(bondTokenBalance, bondInfo?.decimals),
      )
    if (notEnoughBalance) return { error: 'Bonds to redeem exceeds balance' }

    return true
  }, [
    componentType,
    account,
    bondTokenBalance,
    bondInfo?.decimals,
    bondsToRedeem,
    isMatured,
    isPaid,
    isDefaulted,
  ])

  const isActionDisabled = useMemo(() => {
    if (isConvertComponent) {
      console.log(isConvertable)
      return isConvertable !== true
    }
    if (componentType === BondActions.Redeem) {
      console.log(isRedeemable)
      return isRedeemable !== true
    }
  }, [isConvertComponent, componentType, isConvertable, isRedeemable])

  const BondStatus = () => {
    if (componentType !== BondActions.Redeem) return null

    if (isDefaulted) {
      return (
        <ActiveStatusPill className="!text-white !bg-[#DB3635]" dot={false} title="Defaulted" />
      )
    }
    if (isPaid) {
      return <ActiveStatusPill dot={false} title="Repaid" />
    }

    if (!isPaid && isPartiallyPaid && isMatured) {
      return <ActiveStatusPill className="!bg-[#EDA651]" dot={false} title="Partially repaid" />
    }

    return null
  }

  const assetsToReceive = []

  if (isActive) {
    // This should only be shown when bond is in active state
    const collateralTokensAmount = previewConvertVal
    assetsToReceive.push({
      token: bondInfo?.collateralToken,
      value: Number(collateralTokensAmount).toLocaleString(undefined, {
        maximumSignificantDigits: bondInfo?.collateralToken?.decimals,
      }),
    })
  } else if (isPaid) {
    const [paymentTokensAmount] = previewRedeemVal
    assetsToReceive.push({
      token: bondInfo?.paymentToken,
      value: Number(paymentTokensAmount).toLocaleString(undefined, {
        maximumSignificantDigits: bondInfo?.paymentToken?.decimals,
      }),
    })
  } else if (isDefaulted) {
    console.log('defaulted')
    const [paymentTokensAmount, collateralTokensAmount] = previewRedeemVal
    console.log(collateralTokensAmount, paymentTokensAmount)
    assetsToReceive.push({
      token: bondInfo?.collateralToken,
      value: Number(collateralTokensAmount).toLocaleString(undefined, {
        maximumSignificantDigits: 2,
      }),
      extra: `($${(convertibleValue * Number(collateralTokensAmount)).toLocaleString()})`,
    })
  } else if (isPartiallyPaid) {
    // TODO, correctly fetch this state from the graph
    const [paymentTokensAmount, collateralTokensAmount] = previewRedeemVal
    assetsToReceive.push({
      token: bondInfo?.paymentToken,
      value: Number(paymentTokensAmount).toLocaleString(undefined, {
        maximumSignificantDigits: 2,
      }),
      extra: `($${(convertibleValue * Number(paymentTokensAmount)).toLocaleString()})`,
    })

    assetsToReceive.push({
      token: bondInfo?.collateralToken,
      value: Number(collateralTokensAmount).toLocaleString(undefined, {
        maximumSignificantDigits: 2,
      }),
      extra: `($${(convertibleValue * Number(collateralTokensAmount)).toLocaleString()})`,
    })
  }

  return (
    <div className="card redeem-card-color">
      <div className="card-body">
        <div className="flex flex-row justify-between items-start">
          <h2 className="card-title">{getActionText(componentType)}</h2>
          <BondStatus />
        </div>
        {isConvertComponent && !isMatured && bondInfo && (
          <div className="mb-1 space-y-1">
            <div className="text-sm text-[#EEEFEB]">
              {dayjs(bondInfo.maturityDate * 1000)
                .utc()
                .tz()
                .format('LL HH:mm z')}
            </div>
            <div className="text-xs text-[#696969]">
              <Tooltip
                left="Active until"
                tip="Date each bond is no longer convertible into the convertible tokens and will only be redeemable for its face value (assuming no default)."
              />
            </div>
          </div>
        )}
        <div>
          <div className="space-y-6">
            {account && !Number(bondTokenBalance) ? (
              <div className="flex justify-center p-12 text-sm text-[#696969] rounded-lg border border-[#2C2C2C]">
                <span>No bonds to {getActionText(componentType).toLowerCase()}</span>
              </div>
            ) : (
              <AmountInputPanel
                amountText={`Amount of bonds to ${getActionText(componentType).toLowerCase()}`}
                amountTooltip={
                  isConvertComponent
                    ? 'Amount of bonds you are exchanging for convertible tokens.'
                    : 'Amount of bonds you are redeeming.'
                }
                chainId={chainId}
                disabled={!account}
                maxTitle={`${getActionText(componentType)} all`}
                onMax={() => {
                  setBondsToRedeem(formatUnits(bondTokenBalance, bondInfo?.decimals))
                }}
                onUserSellAmountInput={setBondsToRedeem}
                token={tok}
                value={bondsToRedeem}
                wrap={{ isWrappable: false, onClick: null }}
              />
            )}
            <div className="space-y-6 text-xs text-[#696969]">
              {(isConvertComponent || componentType === BondActions.Redeem) && (
                <div className="space-y-2">
                  {assetsToReceive.map(({ extra, token, value }, index) => (
                    <TokenInfo
                      disabled={!account}
                      extra={extra}
                      key={index}
                      token={token}
                      value={value}
                    />
                  ))}

                  <div className="text-xs text-[#696969]">
                    <Tooltip
                      left="Amount of assets to receive"
                      tip={
                        isConvertComponent
                          ? 'Amount of convertible tokens you will receive in exchange for your bonds.'
                          : 'Amount of assets you are receiving for your bonds.'
                      }
                    />
                  </div>
                </div>
              )}

              {!account ? (
                <ActionButton color="purple" onClick={toggleWalletModal}>
                  Connect wallet
                </ActionButton>
              ) : (
                <ActionButton
                  color="purple"
                  disabled={isActionDisabled}
                  onClick={() => {
                    setOpenReviewModal(true)
                  }}
                >
                  Review {isConvertComponent ? 'conversion' : 'redemption'}
                </ActionButton>
              )}
            </div>
          </div>
          <ConfirmationDialog
            actionColor="purple"
            actionText={`${getActionText(componentType)} bonds`}
            beforeDisplay={
              <ReviewConvert
                amount={Number(bondsToRedeem).toLocaleString()}
                amountToken={tok}
                assetsToReceive={assetsToReceive}
                type={getActionText(componentType).toLowerCase()}
              />
            }
            finishedText={`Bonds ${getActionText(componentType)}ed`}
            loadingText={`${getActionText(componentType)}ing bonds`}
            onOpenChange={setOpenReviewModal}
            open={openReviewModal}
            pendingText={`Confirm ${isConvertComponent ? 'conversion' : 'redemption'} in wallet`}
            placeOrder={isConvertComponent ? convert : redeem}
            title={`Review ${isConvertComponent ? 'conversion' : 'redemption'}`}
          />
        </div>
      </div>
    </div>
  )
}

export default BondAction
