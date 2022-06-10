import React, { useState } from 'react'

import { DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { FormProvider, SubmitHandler, useForm, useFormContext } from 'react-hook-form'

import CollateralTokenSelector from '../ProductCreate/CollateralTokenSelector'
import { ActionButton } from '../auction/Claimer'
import TooltipElement from '../common/Tooltip'
import { FieldRowLabelStyledText, FieldRowWrapper } from '../form/InterestRateInputPanel'

import { ReactComponent as UnicornSvg } from '@/assets/svg/simple-bond.svg'

export const TokenDetails = ({ option }) => (
  <div className="p-4 space-y-4 w-full text-xs text-white rounded-md form-control">
    <div className="flex justify-between w-full">
      <span className="flex items-center space-x-2">
        {option.icon || <UnicornSvg height={20} width={20} />}
        <span>{option.name}</span>
      </span>
      <span>
        <span className="text-[#696969]">Price:</span> 10.00 USDC
      </span>
    </div>
    <div className="flex justify-between w-full">
      <span>
        <span className="text-[#696969]">Balance:</span> 1,000,000
      </span>
      <span>
        <span className="text-[#696969]">Value:</span> 10,000,000 USDC
      </span>
    </div>
  </div>
)

const StepOne = () => {
  const { register } = useFormContext()

  return (
    <>
      <div className="w-full form-control">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Bond to auction</span>}
            tip="Bond you will be selling"
          />
        </label>

        <CollateralTokenSelector />
      </div>

      <div className="w-full form-control">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Number of bonds to auction</span>}
            tip="Number of bonds you will be selling"
          />
        </label>
        <input
          className="w-full input input-bordered"
          name="amountOfBonds"
          placeholder="0"
          type="number"
          {...register('amountOfBonds', { required: true })}
        />
      </div>

      <div className="w-full form-control">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Minimum sale price</span>}
            tip="Minimum price you are willing to accept per bond"
          />
        </label>
        <input
          className="w-full input input-bordered"
          name="minSalePrice"
          placeholder="0"
          type="number"
          {...register('amountOfBonds', { required: true })}
        />
      </div>

      <FieldRowWrapper className="py-1 my-4 space-y-3">
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>-</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Minimum funds raised</FieldRowLabelStyledText>}
            tip="Minimum amount of funds you will raise assuming all bonds are sold. The funds raised will be higher if the final sale price is higher than the minimum price set"
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>-</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Amounted owed at maturity</FieldRowLabelStyledText>}
            tip="Amount you will owe at maturity assuming all bonds are sold."
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>-</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Maximum interest owed</FieldRowLabelStyledText>}
            tip="Maximum interest owed assuming all bonds are sold. The interest owed will be lower if the final sale price is higher than the minimum price set."
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>-</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Maximum APR</FieldRowLabelStyledText>}
            tip="Maximum APR you will be required to pay. The settlement APR might be lower than your maximum set."
          />
        </div>
      </FieldRowWrapper>
    </>
  )
}

const StepTwo = () => {
  const { register } = useFormContext()

  return (
    <>
      <div className="w-full form-control">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Collateral token</span>}
            tip="Collateral token that will be used"
          />
        </label>

        <CollateralTokenSelector />
      </div>
      <div className="w-full form-control">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Amount of collateral tokens</span>}
            tip="Amount of collateral tokens that will be used to secure the whole bond issuance"
          />
        </label>
        <input
          className="w-full input input-bordered"
          name="amountOfCollateral"
          placeholder="0"
          type="number"
          {...register('amountOfCollateral', { required: true })}
        />
      </div>

      <FieldRowWrapper className="py-1 my-4 space-y-3">
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>-</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Collateral value</FieldRowLabelStyledText>}
            tip="Value of the collateral in the borrow token"
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>-</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Collateralization value</FieldRowLabelStyledText>}
            tip="Value of the collateral divided by the amount owed at maturity"
          />
        </div>
      </FieldRowWrapper>
    </>
  )
}

const StepThree = () => {
  const { register } = useFormContext()

  return (
    <>
      <div className="w-full form-control">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Convertible token</span>}
            tip="Token that each bond will be convertible into"
          />
        </label>
        <div className="border border-[#2C2C2C]">
          <TokenDetails option={{ name: 'DAI' }} />
        </div>
      </div>
      <div className="w-full form-control">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Amount of convertible tokens</span>}
            tip="Number of tokens the whole bond issuance will be convertible into"
          />
        </label>
        <input
          className="w-full input input-bordered"
          name="amountOfConvertible"
          placeholder="0"
          type="number"
        />
      </div>

      <FieldRowWrapper className="py-1 my-4 space-y-3">
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>-</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Convertible token value</FieldRowLabelStyledText>}
            tip="Current value of all the convertible tokens for the bond issuance"
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-sm text-[#E0E0E0]">
            <p>-</p>
          </div>

          <TooltipElement
            left={<FieldRowLabelStyledText>Strike price</FieldRowLabelStyledText>}
            tip="Price at which the value of the convertible tokens equals the amount owed at maturity"
          />
        </div>
      </FieldRowWrapper>
    </>
  )
}

const confirmSteps = [
  {
    text: 'Approve UNI as collateral',
    tip: 'The collateral token needs to be approved so it can be transferred into the bond contract and used as collateral.',
  },
  { text: 'Mint Uniswap Convertible Bonds', tip: 'Mint the bonds to the connected wallet.' },
]
const steps = ['Setup auction', 'Schedule auction', 'Bidding config', 'Confirm creation']

const SummaryItem = ({ text, tip, title }) => (
  <div className="pb-4 space-y-2 border-b border-[#2C2C2C]">
    <div className="text-base text-white">{text}</div>
    <div className="text-xs text-[#696969]">
      <TooltipElement left={title} tip={tip} />
    </div>
  </div>
)

const Summary = ({ currentStep }) => (
  <div className="overflow-visible w-[425px] card">
    <div className="card-body">
      <h1 className="pb-4 !text-xs uppercase border-b border-[#2C2C2C] card-title">Summary</h1>
      <div className="space-y-4">
        <SummaryItem text="Uniswap Convertible Bond" tip="Name" title="Name" />
        <SummaryItem text="400,000" tip="Supply" title="Supply" />
        <SummaryItem text="400,000 USDC" tip="Owed at maturity" title="Owed at maturity" />
        <SummaryItem text="07/01/2022" tip="Maturity date" title="Maturity date" />

        {currentStep >= 2 && (
          <>
            <SummaryItem text="400,000 UNI" tip="Collateral tokens" title="Collateral tokens" />
            <SummaryItem text="1,000%" tip="Collateral tokens" title="Collateral tokens" />
          </>
        )}
        {currentStep >= 3 && (
          <>
            <SummaryItem text="10,000 UNI" tip="Convertible tokens" title="Collateral tokens" />
            <SummaryItem text="40 USDC/UNI" tip="Strike price" title="Strike price" />
          </>
        )}
      </div>
    </div>
  </div>
)

type Inputs = {
  issuerName: string
  exampleRequired: string
}

const SetupOffering = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentConfirmStep, setCurrentConfirmStep] = useState(0)

  const methods = useForm<Inputs>()
  const {
    formState: { errors },
    handleSubmit,
  } = methods
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  const midComponents = [<StepOne key={0} />, <StepTwo key={1} />, <StepThree key={2} />]

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center space-x-8">
          <div className="overflow-visible w-[326px] card">
            <div className="card-body">
              <div className="flex items-center pb-4 space-x-4 border-b border-[#2C2C2C]">
                <DoubleArrowRightIcon className="p-1 w-6 h-6 bg-[#532DBE] rounded-md border border-[#ffffff22]" />
                <span className="text-xs text-white uppercase">Auction Creation</span>
              </div>

              <ul className="steps steps-vertical">
                {steps.map((step, i) => (
                  <li
                    className={`step ${
                      i <= currentStep ? 'step-primary hover:underline hover:cursor-pointer' : ''
                    }`}
                    key={i}
                    onClick={() => {
                      if (i !== currentStep && i <= currentStep) setCurrentStep(i)
                    }}
                  >
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="overflow-visible w-[425px] card">
            <div className="card-body">
              <h1 className="!text-2xl card-title">{steps[currentStep]}</h1>
              <div className="space-y-4">
                {midComponents[currentStep]}

                {currentStep < 3 && (
                  <ActionButton
                    color="purple"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    type="submit"
                  >
                    Continue
                  </ActionButton>
                )}
                {currentStep === 3 && (
                  <>
                    <ul className="steps steps-vertical">
                      {confirmSteps.map((step, i) => (
                        <li
                          className={`step ${i <= currentConfirmStep ? 'step-primary' : ''}`}
                          key={i}
                        >
                          <TooltipElement left={step.text} tip={step.tip} />
                        </li>
                      ))}
                    </ul>

                    <ActionButton
                      color="purple"
                      onClick={() => {
                        console.log('click')
                      }}
                    >
                      Approve UNI as collateral
                    </ActionButton>
                  </>
                )}
              </div>
            </div>
          </div>
          {currentStep >= 1 && <Summary currentStep={currentStep} />}
        </div>
      </form>
    </FormProvider>
  )
}

export default SetupOffering
