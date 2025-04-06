"use client";
import React from 'react'
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { memo } from 'react';


const Sentence = () => {
    const mainSentence = "Launch your own token at single tap"
    const [timer, setTimer] = useState(0)
    useEffect(() => {
  
      const testing = setInterval(() => {
        setTimer((prev) => (prev + 1) % (mainSentence.split(" ").length + 1));
      }, 2000);
  
  
      return () => {
        clearInterval(testing)
      }
    }, [timer])
  return (
  
    <div className="text-xl sm:text-4xl text-white text-center flex flex-wrap md:flex-nowrap justify-center gap-2 max-w-xl sm:w-full ">
    <AnimatePresence mode="popLayout">
      {
        mainSentence.split(" ").map((word, idx) => {
          return (
            <motion.div
              transition={{ duration: 1 }}
              layoutId={`word-${idx}`}
              className={`${idx == timer ? 'text-white bg-white/30 ' : 'text-green-900'} rounded-2xl px-4 py-2 ${timer==6 && "scale-90"} `}
              key={idx}
            >
              {word}
            </motion.div>
          )
        })
      }
    </AnimatePresence>
  </div>
  )
}

export default memo(Sentence)
