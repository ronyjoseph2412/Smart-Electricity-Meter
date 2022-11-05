import React from 'react'

const Home = () => {
  return (
    <div className='grid grid-cols-4'>
      <div className='col-span-1'></div>
      <div className='col-span-2 flex flex-col py-4 space-y-3'>
        <div className='font-light text-4xl'>
          Welcome to SmarTRIC
        </div>
        <div className='grid grid-cols-2'>
          <div className='flex flex-col space-y-4'>
            <div className='font-semibold text-xl'>
              Electricity Consumption
            </div>
            <div className='text-3xl tracking-wider font-medium '>
            ₹21000
            </div>
            <div className='flex flex-row justify-start items-center space-x-2'>
              <div className='bg-teal-700 h-3 w-3 rounded-full'></div>
              <div className='text-lg font-medium text-gray-700'>
                Last Month
              </div>
            </div>
            <div className='flex flex-row justify-start items-center space-x-2'>
              <div className='bg-blue-700 h-3 w-3 rounded-full'></div>
              <div className='text-lg font-medium text-gray-700'>
                Running Month
              </div>
            </div>
          </div>
          <div className=''>

          </div>
        </div>
      </div>
      <div className='col-span-1'>

      </div>
    </div>
  )
}

export default Home