/* ===========================================


This is the index page, or the start page ('/')


==============================================*/

import { Head } from '@inertiajs/react'
import React from 'react'

const IndexPage = () => {
  return (
    <>
        <Head title="DOST-STII" />
        <div className='min-h-screen flex justify-center items-center'>
            <div className='text-center'>
                <div className='flex justify-center gap-2 mb-2'>
                    <div>
                        <img src='/img/dost.png' width='100' height={100} className='mx-auto'/>
                    </div>
                    <div>
                        <img src='/img/finish-logo.png' width='100' height={100} className='mx-auto'/>
                    </div>
                </div>

                <div className='font-bold text-4xl'>
                    WELCOME
                </div>
                <div className='text-2xl font-bold'>
                    DOST - Science and Technology Information Institute
                </div>
            </div>
        </div>
    </>
  )
}

export default IndexPage