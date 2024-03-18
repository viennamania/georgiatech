'use client';

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
    return (
        <>

            <div className=" items-center justify-center w-full h-20 bg-black sticky top-0 z-50 
                lg:flex
                ">

                <div className='flex flex-col w-full p-10 text-gray-500 gap-5 bg-black'>
                    {/*
                    <Link href="/hipodrom" className='w-full'>
                        <Image src={"/logo.png"} width="100" height="50" alt="logo" />
                    </Link>
                    */}
                    <div className="w-full">
                        <Image src={"/logo.png"} width="100" height="50" alt="logo" />
                    </div>
                    <div className='w-full flex flex-col'>
                        <p>All Rights Reserved © 2023 Cracle</p>
                    </div>
                </div>


            </div>

            <div id="modal-root"></div>

        </>
    )
}
