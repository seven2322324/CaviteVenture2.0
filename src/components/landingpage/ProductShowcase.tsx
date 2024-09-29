"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

// Cloudinary base URL
const CLOUDINARY_URL = "https://res.cloudinary.com/ddobzzim4/image/upload/";
const productImageURL = `${CLOUDINARY_URL}images/product-image.png`;
const pyramidImageURL = `${CLOUDINARY_URL}images/pyramid.png`;
const tubeImageURL = `${CLOUDINARY_URL}images/tube.png`;

export const ProductShowcase = () => {
  const sectionRef = useRef(null);

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transform animation for smooth scrolling
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  // Measure performance timing for loading images and content
  useEffect(() => {
    const startTime = performance.now();

    const handleLoad = () => {
      const endTime = performance.now();
      console.log(`Content loaded in ${endTime - startTime}ms`);
    };

    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#FFFFFF] to-[#fae8b4] py-24 overflow-x-clip"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">Discover About Cavite</div>
          </div>
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#cbbd93] text-transparent bg-clip-text mt-5">
            A more effective way to explore Cavite
          </h2>
          <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#80775c] mt-5">
            Effortlessly explore some parts of unpopular places in Cavite
          </p>
        </div>

        <div className="relative mt-10">
          {/* Product Image with rounded corners */}
          <Image
            src={productImageURL}
            alt="Product image"
            layout="responsive"
            width={540}
            height={540}
            className="mt-10 rounded-lg"
            priority={true} // Prioritize loading of product image
          />

          {/* Pyramid Image (appears on medium and large screens) */}
          <motion.div
            className="hidden md:block absolute -right-36 -top-32"
            style={{ translateY }}
          >
            <Image
              src={pyramidImageURL}
              alt="Pyramid image"
              layout="intrinsic"
              width={262}
              height={262}
              loading="lazy" // Lazy load for performance
            />
          </motion.div>

          {/* Tube Image (appears on medium and large screens) */}
          <motion.div
            className="hidden md:block absolute bottom-24 -left-36"
            style={{ translateY }}
          >
            <Image
              src={tubeImageURL}
              alt="Tube image"
              layout="intrinsic"
              width={248}
              height={248}
              loading="lazy" // Lazy load for performance
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
