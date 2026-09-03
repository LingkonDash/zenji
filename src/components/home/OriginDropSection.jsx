"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Flame, ShoppingBag, ShoppingCart } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function OriginDropSection({ data }) {
    const targetRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const track = containerRef.current;
            if (!track) return;

            const getScrollAmount = () => {
                return track.scrollWidth - window.innerWidth;
            };

            gsap.to(track, {
                x: () => -getScrollAmount(),
                ease: "none",
                scrollTrigger: {
                    trigger: targetRef.current,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => `+=${getScrollAmount()}`,
                    invalidateOnRefresh: true,
                },
            });
        });

        return () => mm.revert();
    }, []);

    return (
        <section
            ref={targetRef}
            className="relative md:h-screen w-full bg-[#0B0404] text-white overflow-hidden font-sans py-8 md:py-6 flex flex-col justify-between"
        >
            {/* Background Graphic Watermark */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none flex items-center justify-center">
                <span className="font-anton text-[25vw] uppercase tracking-tighter text-white select-none">
                    ORIGIN
                </span>
            </div>

            {/* Section Header */}
            <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4 bg-[#0B0404] px-4 md:px-8 mx-4 md:mx-8 shrink-0">
                <div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#BC0100]">
                        <Flame className="w-4 h-4 animate-pulse" />
                        <span>COLLECTION // THE_ORIGIN_DROP</span>
                    </div>
                    <h2 className="font-anton leading-[0.88] text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-wider text-white mt-1">
                        LIMITED SALES
                    </h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <p className="text-xs font-mono text-[#9D9D9D] max-w-xs">
                        HEAVYWEIGHT COTTON ARCHIVAL EDITIONS. ONCE THE ALLOCATION IS EXHAUSTED, THEY ARE RETIRED.
                    </p>
                    <Link
                        href="/collection"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-white/20 bg-white/5 hover:bg-[#BC0100] hover:border-[#BC0100] text-white hover:text-black font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-none shrink-0"
                    >
                        <span>SEE ALL</span>
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>

            {/* Horizontal Scroll Track */}
            <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar px-4 md:px-8 pt-4 md:pt-6 pb-4 md:pb-6 z-10 relative flex-1 flex items-center">
                <div
                    ref={containerRef}
                    className="flex items-center md:h-full gap-4 md:gap-8 w-max"
                >
                    {data.map((item, index) => {
                        const isOnSale = item.price !== item.originalPrice;

                        return (
                            <div
                                key={item.id}
                                className="group relative w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] h-[480px] md:h-[calc(100vh-220px)] max-h-[640px] flex-shrink-0 flex flex-col justify-between bg-[#0B0404] border border-white/10 hover:border-[#BC0100]/60 transition-all duration-500 rounded-none overflow-hidden shadow-2xl"
                            >
                                {/* Badge Overlay */}
                                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                                    <span className="px-3 py-1 bg-[#0B0404]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-white uppercase rounded-none">
                                        0{index + 1} / 0{data.length}
                                    </span>
                                    {isOnSale && (
                                        <span className="px-3 py-1 bg-[#BC0100] text-white text-[10px] font-mono font-bold tracking-widest uppercase rounded-none animate-pulse">
                                            SALE
                                        </span>
                                    )}
                                </div>

                                {/* Artwork Container */}
                                <div className="relative w-full h-[60%] md:h-[65%] overflow-hidden bg-gradient-to-b from-transparent to-[#0B0404]">
                                    <Image
                                        src={item.posterImage}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 320px, 380px"
                                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0404] via-transparent to-transparent opacity-90" />
                                </div>

                                {/* Content Footer */}
                                <div className="p-5 md:p-6 flex flex-col justify-between flex-grow z-10 bg-[#0B0404]">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h3 className="font-anton text-xl md:text-2xl uppercase tracking-wide text-white group-hover:text-[#BC0100] transition-colors duration-300">
                                                {item.title}
                                            </h3>
                                            <Link
                                                href={`/drop/${item.id}`}
                                                className="p-2 rounded-none border border-white/10 hover:border-[#BC0100] hover:bg-[#BC0100] text-white transition-all duration-300"
                                            >
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                        <p className="text-xs font-mono text-[#9D9D9D] line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Price and CTA */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-anton text-xl text-[#BC0100]">
                                                {item.price}
                                            </span>
                                            {isOnSale && (
                                                <span className="text-xs font-mono text-[#9D9D9D] line-through">
                                                    {item.originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            href={`/drop/${item.id}`}
                                            className="flex items-center gap-1.5 text-xs font-mono uppercase font-semibold text-white hover:text-[#BC0100] transition-colors"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            <span>CLAIM</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}