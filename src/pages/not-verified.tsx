import React from 'react'
import Head from 'next/head'
import Scammer from '~/components/scammer'

const NotVerifiedPage = () => {
  return (
    <>
      <Head>
        <title>Verification Failed | Alumni Incridea</title>
        <meta name="description" content="Your verification was not successful" />
      </Head>
      <Scammer />
    </>
  )
}

export default NotVerifiedPage
