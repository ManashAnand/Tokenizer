"use client"
import React from 'react'

import { motion } from "motion/react";

const Display = () => {
    const tokenNames = [
        'Bitcoin',
        'Ethereum',
        'Litecoin',
        'Dogecoin',
        'Ripple ',
        'Stellar',
        'Tether',
        'USDC',
        'USDT',
        'Chainlink',

    ]
    const greenShades = [
        'bg-green-100',
        'bg-green-200',
        'bg-green-300',
        'bg-green-400',
        'bg-green-500',
        'bg-green-600',
        'bg-green-700',
        'bg-green-800',
        'bg-green-900',
        'bg-green-950',
    ];

    return (
        <div className='flex gap-2  items-end justify-center h-full w-full'>
            {
                Array.from({ length: 10 }).map((_, index) => {
                    const height = 10 + index * 10;

                    const colorClass = greenShades[index];
                    return (
                        <motion.div
                            key={index}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            style={{ height: `${height}%` }} className={`w-18 rounded-t-lg justify-center items-center flex text-white font-bold  ${colorClass} ${index > 4 && "hidden md:block"}`}>
                            {tokenNames[index]}
                        </motion.div>
                    )
                })}
        </div>
    )
}

export default Display
