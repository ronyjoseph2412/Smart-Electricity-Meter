import React from "react";

const PaymentHistory = () => {
  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Payment History
            </h2>
          </div>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="user-address" className="sr-only">
                User Address
              </label>
              <input
                id="user-address"
                name="user-address"
                type="text"
                autoComplete="user-address"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Wallet Address"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your Address?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
              Get Details
            </button>
          </div>
          <table className="shadow-lg bg-white border-separate">
            <tr>
              <th className="bg-blue-100 border text-left px-8 py-4">
                Paid by
              </th>
              <th className="bg-blue-100 border text-left px-8 py-4">Amount</th>
              <th className="bg-blue-100 border text-left px-8 py-4">Status</th>
            </tr>
            <tr>
              <td className="border px-8 py-4">
                0xB245B4DBEe83064CDd975D31Af9edA5f6a4508A4
              </td>
              <td className="border px-8 py-4">0.01 ETH</td>
              <td className="border px-8 py-4">PAID</td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default PaymentHistory;
