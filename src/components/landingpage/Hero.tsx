"use client";
import ArrowIcon from "@/assets/arrow-right.svg";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// Cloudinary Image URLs
const CLOUDINARY_URL = "https://res.cloudinary.com/ddobzzim4/image/upload/";

const cogImage = `${CLOUDINARY_URL}f_auto,q_auto/c_limit,w_800/images/cog.png`;
const cylinderImage = `${CLOUDINARY_URL}f_auto,q_auto/c_limit,w_440/images/cylinder.png`;
const noodleImage = `${CLOUDINARY_URL}f_auto,q_auto/c_limit,w_440/images/noodle.png`;

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={heroRef}
      className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#fae8b4,#EAEEFE_100%)] overflow-x-clip relative"
    >
      <div className="container flex flex-col md:flex-row justify-center items-center max-w-screen-xl px-4 sm:px-6 md:px-12 lg:px-16 pl-6 md:pl-16 lg:pl-48 relative">
        <div className="md:flex items-center justify-between w-full">
          <div className="md:w-[478px] text-center md:text-left">
            <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
              CaviteVenture 2.0 is here
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#cbbd93] text-transparent bg-clip-text mt-6">
              Pathway to new modern Exhibit
            </h1>
            <p className="text-lg sm:text-xl text-[#010D3E] tracking-tight mt-6">
              Explore with the app design to trace your progress, motivate your efforts
            </p>
            <div className="flex gap-1 items-center justify-center md:justify-start mt-[30px]">
              <Link href="/signup">
                <button className="btn btn-primary">Explore for Free</button>
              </Link>
              <button className="btn btn-text gap-1">
                <span>Learn More</span>
                <Image
                  src={ArrowIcon}
                  alt="Menu icon"
                  height={40}
                  width={40}
                  className="h-5 w-5"
                  loading="lazy"
                />
              </button>
            </div>
          </div>

          <div className="mt-10 md:mt-0 md:h-[648px] md:flex-1 relative flex justify-center items-center">
            <motion.img
              src={cogImage}
              alt="cog image"
              className="md:absolute md:h-3/4 md:w-auto md:max-w-none md:-left-6 lg:left-0 rounded-lg"
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut",
              }}
              loading="lazy"
            />

            <motion.img
              src={cylinderImage}
              alt="cylinder image"
              width={220}
              height={220}
              className="hidden md:block -top-8 -left-32 md:absolute rounded-lg"
              style={{
                translateY: translateY,
              }}
              loading="lazy"
            />

            <motion.img
              src={noodleImage}
              width={220}
              height={220}
              alt="noodle image"
              className="hidden lg:block absolute top-[524px] left-[448px] rotate-[10deg] rounded-lg"
              style={{
                translateY: translateY,
                rotate: 30,
              }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
