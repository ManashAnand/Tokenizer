"use client";


import React, { useState } from 'react'
import { motion } from "motion/react"
import { TowerControl } from 'lucide-react';
import {
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

const Navbar = () => {
    const [hoverIdx, setHoverIdx] = useState(0)

    const routes = [{
        id: 0,
        name: 'Home',
        link: '/home'
    },
    {
        id: 1,
        name: 'about',
        link: '/home'
    }, {
        id: 2,
        name: 'contact',
        link: '/home'
    }
    ]

    return (
        <motion.div
            initial={{ y: -100, boxShadow: "none" }}

            animate={{ y: 0, boxShadow: " rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset" }}
            transition={{ duration: 0.7 }}
            className='relative z-50 isolate flex w-full justify-between rounded-md bg-white/30 backdrop-blur-md min-h-12 items-center text-white
    px-4 mt-4
'>
            <div className=' flex-1 md:min-w-0 flex text-md md:text-2xl gap-2  items-center'><TowerControl className='' /> Tokenizer</div>
            <div className='sm:flex hidden md:gap-4 text-xs min-w-3/4 md:min-w-0 justify-end '>
                {
                    routes?.map((navItem, index) => {
                        return (
                            <div key={index}>
                                <motion.div
                                    className={`px-2  md:px-4 py-2 rounded-md text-sm lg:text-base cursor-pointer relative no-underline duration-300 ease-in ${index == hoverIdx ? "text-white font-semibold" : "text-zinc-100"
                                        }`}
                                    onHoverStart={() => setHoverIdx(index)}
                                    // onHoverEnd={() => setHoverIdx(0)}

                                >
                                    {
                                        index == hoverIdx && (
                                            <motion.div className="absolute bottom-0 left-0 h-full bg-green-800/40 rounded-md -z-10"
                                                layoutId="navbar"
                                                style={{
                                                    width: "100%",
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    bounce: 0.25,
                                                    stiffness: 70,
                                                    damping: 9,
                                                    duration: 0.3,
                                                }}
                                            >
                                            </motion.div>
                                        )
                                    }

                                    {navItem.name}
                                </motion.div>

                            </div>

                        )
                    })
                }
            </div>
            <motion.div className="relative rounded-md text-white text-sm font-semibold ml-2">
                <motion.div
                    className="absolute bottom-0 left-0 h-full bg-green-800/20 rounded-md -z-10"
                    layoutId="navbar"
                    style={{ width: "100%" }}
                    transition={{
                        type: "spring",
                        bounce: 0.25,
                        stiffness: 70,
                        damping: 9,
                        duration: 0.3,
                    }}
                />
                <WalletMultiButton className="!bg-transparent !text-white !px-4 !py-2 !text-sm !font-semibold relative z-10" />
            </motion.div>

        </motion.div>
    )
}

export default Navbar
