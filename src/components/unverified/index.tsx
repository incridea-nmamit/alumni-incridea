import React from 'react'
import Image from 'next/image'

const Unverified = () => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6 md:p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48">
            <Image 
              src="/verification-pending.svg" 
              alt="Verification Pending"
              layout="fill"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
          Verification in Progress
        </h1>
        
        <div className="h-2 w-64 mx-auto bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        
        <p className="text-lg md:text-xl text-gray-700 mb-4">
          Your documents are currently being verified by our team.
        </p>
        
        <p className="text-gray-600 mb-6">
          We&apos;ll update you once your verification is complete.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Need help? 
          </span>
          <a href="tel:+919448846524" className="text-blue-600 hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </div>  
  )
}

export default Unverified
