"use client";

import { motion } from "motion/react";
import { CircleDot } from "lucide-react";
import FirstLook from "@/components/custom/FirstLook";
import { FeaturesSection } from "../components/custom/FeatureSection";
export default function Home() {

  return (
    <>

      <div
        className="w-full flex justify-center items-center  mt-4 font-semibold text-white/60 text-md ">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="flex flex-col gap-8 justify-center items-center"
        >

          <div
            className=" flex gap-2">
            <span className="animate-pulse">
              <CircleDot/>
              </span>
               Have fun minting your own token
          </div>

        </motion.div>
      </div>
          <FirstLook/>
          <FeaturesSection/>
    </>
  );
}
