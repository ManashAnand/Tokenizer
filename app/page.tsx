"use client";

import React, { Suspense, lazy } from "react";
import { motion } from "motion/react";
import { CircleDot } from "lucide-react";
import FirstLook from "@/components/custom/FirstLook";
import { FeaturesSection } from "../components/custom/FeatureSection";
import { HeaderComponent } from "@/components/custom/HeaderComponent";
import Pricing from "@/components/custom/Pricing";

const MapSection = lazy(() => import("@/components/custom/MapSection"));

export default function Home() {
  const dots = [
    // North America
    {
      start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
      end: { lat: 40.7128, lng: -74.0060, label: "New York" },
    },
    {
      start: { lat: 45.5017, lng: -73.5673, label: "Montreal" },
      end: { lat: 19.4326, lng: -99.1332, label: "Mexico City" },
    },

    // Europe
    {
      start: { lat: 52.5200, lng: 13.4050, label: "Berlin" },
      end: { lat: 48.8566, lng: 2.3522, label: "Paris" },
    },
    {
      start: { lat: 41.9028, lng: 12.4964, label: "Rome" },
      end: { lat: 38.7223, lng: -9.1393, label: "Lisbon" },
    },

    // Asia
    {
      start: { lat: 35.6895, lng: 139.6917, label: "Tokyo" },
      end: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
    },
    {
      start: { lat: 28.6139, lng: 77.2090, label: "Delhi" },
      end: { lat: 31.2304, lng: 121.4737, label: "Shanghai" },
    },

    // Africa
    {
      start: { lat: -1.2921, lng: 36.8219, label: "Nairobi" },
      end: { lat: 30.0444, lng: 31.2357, label: "Cairo" },
    },

    // Oceania
    {
      start: { lat: -33.8688, lng: 151.2093, label: "Sydney" },
      end: { lat: -36.8485, lng: 174.7633, label: "Auckland" },
    },

    // Intercontinental
    {
      start: { lat: 51.5074, lng: -0.1278, label: "London" },
      end: { lat: 40.7128, lng: -74.0060, label: "New York" },
    },
    {
      start: { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
      end: { lat: 35.6895, lng: 139.6917, label: "Tokyo" },
    },
  ];

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
              <CircleDot />
            </span>
            Have fun minting your own token
          </div>

        </motion.div>
      </div>
      <FirstLook />
      <HeaderComponent text="Features" className="w-full flex justify-center items-center text-white/45 font-semibold my-4 mb-4" />
      <FeaturesSection />

      <Suspense fallback={<div className="w-full flex justify-center items-center text-white">
        Loading maps
      </div>}>
        <HeaderComponent text="We are present everywhere" className="w-full flex justify-center items-center text-white/45 font-semibold my-4 mb-4" />
        <MapSection dots={dots} lineColor="#228B22" />
      </Suspense>
      <HeaderComponent text="Pricing" className="w-full flex justify-center items-center text-white/45 font-semibold my-4 mb-4" />
      <Pricing/>
        <div className="mt-5">Manash</div>
    </>
  );
}
