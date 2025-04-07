"use client";
import React from 'react'
import { motion } from 'motion/react'

const Pricing = () => {
  const plans = [
    {
      title: "BASIC",
      price: 19,
      features: [
        "1 User",
        "5GB Storage",
        "Basic Support",
        "Limited API Access",
        "Standard Analytics",
      ],
      buttonText: "Subscribe",
      description: "Perfect for individuals and small projects",
      index:0
    },
    {
      title: "PRO",
      price: 49,
      popular: true,
      features: [
        "5 Users",
        "50GB Storage",
        "Priority Support",
        "Full API Access",
        "Advanced Analytics",
      ],
      buttonText: "Subscribe",
      description: "Ideal for growing businesses and teams",
      index:1
    },
    {
      title: "ENTERPRISE",
      price: 99,
      features: [
        "Unlimited Users",
        "500GB Storage",
        "24/7 Premium Support",
        "Custom Integrations",
        "AI-Powered Insights",
      ],
      buttonText: "Subscribe",
      description: "For large-scale operations and high-volume users",
      index:2
    },
  ];

  return (
    <div className="flex justify-center items-center">

      <div className="grid mt-5 grid-cols-1 md:grid-cols-3 gap-2 ">
        {plans.map((plan, index) => (
          <Card key={index} {...plan}  />
        ))}
      </div>
    </div>
  )
}

export default Pricing


type Feature = string;

interface CardProps {
  popular?: boolean;
  title: string;
  price: number;
  period?: string;
  features: Feature[];
  buttonText?: string;
  description?: string;
  index:number
}

const Card = ({
  popular = false,
  title,
  price,
  period = "/mo",
  features,
  buttonText = "Subscribe",
  description = "",
  index
}: CardProps) => {
  const xPositions = [-20, 0, 20];
  const yPositions = [20, 0, 20];
  return (
    <motion.div
    initial={{
      x: xPositions[index] ?? 0,
      y: yPositions[index] ?? 0,
    }}
    whileInView={{ x: 0, y: 0 }}
    transition={{duration:0.7}}
    viewport={{ once: false, amount: 0.5 }} 
    style={{ boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.35)" }} className={`h-full p-6 rounded-lg border-2 ${popular ? "border-emerald-500" : "border-white/15"} text-white/45 flex flex-col relative overflow-hidden min-w-md`}>
      {popular && (
        <span className="bg-emerald-500 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">
          POPULAR
        </span>
      )}

      <h2 className="text-sm tracking-widest title-font mb-1 font-medium text-white/85">{title}</h2>

      <h1 className="text-5xl text-white leading-none flex items-center pb-4 mb-4 border-b border-gray-200 ">
        <span>${price}</span>
        <span className="text-lg ml-1 font-normal text-gray-500">{period}</span>
      </h1>

      {features.map((feature, index) => (
        <p key={index} className="flex items-center text-gray-600 mb-2">
          <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              className="w-3 h-3  text-emerald-600"
              viewBox="0 0 24 24"
            >
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </span>
          {feature}
        </p>
      ))}

      <button className="flex items-center mt-auto text-white bg-emerald-500 border-0 py-2 px-4 w-full focus:outline-none hover:bg-emerald-600 rounded group cursor-pointer">
        {buttonText}
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="w-4 h-4 ml-auto group-hover:translate-x-2 duration-200 ease-in"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </button>

      {description && <p className="text-xs text-gray-500 mt-3">{description}</p>}
    </motion.div>
  );
};
