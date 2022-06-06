import React from 'react'
import { useNavigate } from 'react-router-dom'

import ConvertCreateIcon from './ConvertCreateIcon'
import SimpleCreateIcon from './SimpleCreateIcon'

const SelectProduct = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex justify-center space-x-8">
        <div className="w-[326px] card">
          <div className="card-body">
            <ConvertCreateIcon className="mb-32" />

            <div className="text-3xl font-medium text-white">Convertible Bond</div>
            <p className="text-[#696969]">A convertible bond built for DeFi.</p>
            <button
              className="flex self-start mt-4 !text-2sm font-normal text-white normal-case bg-[#181A1C] !border-[#2A2B2C] btn btn-sm"
              onClick={() => navigate('/bonds/create/convertible')}
            >
              Learn more
            </button>
          </div>
        </div>
        <div className="w-[326px] card">
          <div className="card-body">
            <SimpleCreateIcon className="mb-32" />

            <div className="text-3xl font-medium text-white">Simple Bond</div>
            <p className="text-[#696969]">A simple bond built for DeFi.</p>

            <button
              className="flex self-start mt-4 !text-2sm font-normal text-white normal-case bg-[#181A1C] !border-[#2A2B2C] btn btn-sm"
              onClick={() => navigate('/bonds/create/simple')}
            >
              Learn more
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SelectProduct