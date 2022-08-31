import React from 'react'

const Registration = () => {
  return (
    <>
    <div class="pt-20 mx-20 sm:mt-0">
        <h1>Registration</h1>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <form action="#" method="POST">
          <div class="shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="full-name"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="full-name"
                    type="text"
                    placeholder="ex:"
                    required
                  />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="ex:"
                    required
                  />
                </div>

                <div class="col-span-6 sm:col-span-4">
                  <label
                    for="wallet-address"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Wallet Address
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="wallet-address"
                    type="text"
                    placeholder="ex:"
                    required
                  />
                </div>

                <br />

                <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="phone"
                    type="text"
                    placeholder="ex:"
                    required
                  />
                </div>

                <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                  <label
                    for="meter-id"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Meter ID
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="meter-id"
                    type="number"
                    placeholder="ex:"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="px-4 py-3 mx-5 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default Registration