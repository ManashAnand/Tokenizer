"use client";

import { ArrowRight, StarsIcon } from 'lucide-react'
import TagLine from '../Extra/TagLine'
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";
import { cn } from '@/app/lib/utils'

const FirstLook = () => {
    return (
        <>

            <motion.div

                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="relative h-[36rem] bg-transparent flex justify-center overflow-hidden mt-4">
                <BackgroundCellCore />

                <div className="relative z-50 mt-40 pointer-events-none select-none">
                    <div
                        className='w-full  flex flex-col    mt-4 rounded-md relative items-center justify-center'>
                        <div className='bg-white/40 p-2  flex gap-4 text-white
            
            justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-bold   bg-gradient-to-r from-green-500/40 to-green-700   shadow focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.2)_50%,transparent_75%,transparent_100%)]  before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms] 
            '>
                            <span className=''>
                                <StarsIcon />
                            </span>
                            <div>
                                New! With AI powered technology
                            </div>
                        </div>
                        <TagLine />

                        <div className='flex items-center justify-center w-56 h-12 mt-9 rounded-xl border border-emerald-700 bg-gradient-to-b from-emerald-500 to-brand text-base font-semibold text-white cursor-pointer group'>
                            Get started - it&apos;s free
                            <span className='group-hover:translate-x-2  duration-100'>
                                <ArrowRight />
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

        </>
    )
}

export default FirstLook


const BackgroundCellCore = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const ref = useRef<any>(null);

    const handleMouseMove = (event: any) => {
        const rect = ref.current && ref.current.getBoundingClientRect();
        setMousePosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    const size = 600;
    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            className="h-full absolute inset-0"
        >
            <div className="absolute  inset-y-0  overflow-hidden">
                <div className="absolute h-full w-full pointer-events-none -bottom-2 z-40  [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                <div
                    className="absolute inset-0 z-20 bg-transparent"
                    style={{
                        maskImage: `radial-gradient(
                ${size / 4}px circle at center,
               white, transparent
              )`,
                        WebkitMaskImage: `radial-gradient(
              ${size / 4}px circle at center,
              white, transparent
            )`,
                        WebkitMaskPosition: `${mousePosition.x - size / 2}px ${mousePosition.y - size / 2
                            }px`,
                        WebkitMaskSize: `${size}px`,
                        maskSize: `${size}px`,
                        pointerEvents: "none",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                    }}
                >
                    <Pattern cellClassName="border-blue-600 relative z-[100]" />
                </div>
                <Pattern className="opacity-[0.5]" cellClassName="border-neutral-700" />
            </div>
        </div>
    );
};

const Pattern = ({
    className,
    cellClassName,
}: {
    className?: string;
    cellClassName?: string;
}) => {
    const x = new Array(47).fill(0);
    const y = new Array(30).fill(0);
    const matrix = x.map((_, i) => y.map((_, j) => [i, j]));
    const [clickedCell, setClickedCell] = useState<any>(null);

    return (
        <div className={cn("flex flex-row  relative z-30", className)}>
            {matrix.map((row, rowIdx) => (
                <div
                    key={`matrix-row-${rowIdx}`}
                    className="flex flex-col  relative z-20 border-b"
                >
                    {row.map((column, colIdx) => {
                        return (
                            <AnimatedCell
                                key={`matrix-col-${colIdx}`}
                                rowIdx={rowIdx}
                                colIdx={colIdx}
                                clickedCell={clickedCell}
                                setClickedCell={setClickedCell}
                                cellClassName={cellClassName}
                            />
                        )
                    })}
                </div>
            ))}
        </div>
    );
};

const AnimatedCell = ({
    rowIdx,
    colIdx,
    clickedCell,
    setClickedCell,
    cellClassName
}: {
    rowIdx: number;
    colIdx: number;
    clickedCell: [number, number] | null;
    setClickedCell: (cell: [number, number]) => void;
    cellClassName?: string;
}) => {
    const controls = useAnimation();

    useEffect(() => {
        if (clickedCell) {
            const distance = Math.sqrt(
                Math.pow(clickedCell[0] - rowIdx, 2) +
                Math.pow(clickedCell[1] - colIdx, 2)
            );
            controls.start({
                opacity: [0, 1 - distance * 0.1, 0],
                transition: { duration: distance * 0.2 },
            });
        }
    }, [clickedCell, rowIdx, colIdx, controls]);

    return (
        <div
            className={cn("bg-transparent border-l border-b border-neutral-600", cellClassName)}
            onClick={() => setClickedCell([rowIdx, colIdx])}
        >
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: [0, 1, 0.5] }}
                animate={controls}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="bg-[rgba(14,165,233,0.3)] h-12 w-12"
            />
        </div>
    );
};


