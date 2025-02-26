'use client'
import React from 'react'
import { api } from '~/trpc/react';
import { Card, CardContent } from '~/components/ui/card';

const ProCom = () => {
  const { data: verifiedUsers, isLoading } = api.admin.getAllVerifiedUsers.useQuery();
  
  const paidUsersCount = verifiedUsers?.length ?? 0;

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-8">
      <Card className="w-full max-w-md bg-gradient-to-b from-blue-800/80 to-blue-950/80 border-none shadow-xl">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          {isLoading ? (
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          ) : (
            <>
              <div className="text-8xl font-bold text-white mb-4 animate-pulse">
                {paidUsersCount}
              </div>
              <p className="text-xl text-blue-200">
                Total Number of Verified Alumni
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProCom
