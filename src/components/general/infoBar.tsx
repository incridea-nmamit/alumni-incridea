"use client"

import { useSession } from 'next-auth/react'
import React from 'react'

const InfoBar = () => {
  const { data: session } = useSession()

  if (session?.user.role === "ADMIN")
    return null;

  return (
    <div className="fixed bottom-0 flex w-full flex-col items-center justify-center gap-4 rounded-t-xl">
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-t-2xl bg-blue-800 p-4 md:flex-row">
        <p className="text-center text-sm text-white">
          If you have any issues with payments or anything, WhatsApp {""}
          <a href="tel:9513295282" className="col-span-1 md:col-span-3 hover:underline hover:text-blue-500">
            +919513295282
          </a>{" "} or {""}
          <a href="tel:9448846524" className="col-span-1 md:col-span-3 hover:underline hover:text-blue-500">
            +919448846524
          </a>
        </p>
      </div>
    </div>
  )
}

export default InfoBar
