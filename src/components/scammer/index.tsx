import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Scammer = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl overflow-hidden p-6 text-center">
        <div className="mb-6">
          <Image 
            src="/assets/images/error.svg" 
            alt="Verification Failed" 
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h1>
        <p className="text-gray-700 mb-6">
          Unfortunately, we were unable to verify your identity. If you think we made a mistake, please contact us.
        </p>
        
        <Link href="tel:9448846524">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
            Contact Support
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Scammer
