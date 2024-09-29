"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import NavBar from '@/components/navbar/NavBar';

// Cloudinary image URLs
const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/ddobzzim4/image/upload/';
const ICON_MAP_URL = `${CLOUDINARY_BASE_URL}images/iconmapremove.png`;
const ICON_ROUND_URL = `${CLOUDINARY_BASE_URL}images/iconround.png`;

const Exhibitpro: React.FC = () => {
  const [hoveredContainer, setHoveredContainer] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, containerId: number) => {
    if (hoveredContainer !== containerId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });

    gsap.to(containerRefs.current[containerId], {
      rotationY: (x - rect.width / 2) / 20,
      rotationX: -(y - rect.height / 2) / 20,
      ease: 'power3.out',
    });
  };

  const handleMouseEnter = (containerId: number) => {
    setHoveredContainer(containerId);

    gsap.to(containerRefs.current[containerId], {
      scale: 1.1,
      ease: 'power3.out',
      duration: 0.5,
    });
  };

  const handleMouseLeave = (containerId: number) => {
    setHoveredContainer(null);

    gsap.to(containerRefs.current[containerId], {
      scale: 1,
      rotationY: 0,
      rotationX: 0,
      ease: 'power3.out',
      duration: 0.5,
    });
  };

  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (headingRef.current && paragraphRef.current) {
      gsap.fromTo(
        [headingRef.current, paragraphRef.current],
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', stagger: 0.3 }
      );
    }
  }, []);

  return (
    <section className="mb-10">
      <NavBar />
      <div className="container mx-auto px-4">
        {/* Centered heading and paragraph */}
        <div className="flex flex-col items-center text-center mb-8">
          <h1 ref={headingRef} className="text-4xl font-bold text-gray-800 mt-8 font-montserrat">
            Start Exploring
          </h1>
          <p ref={paragraphRef} className="text-lg text-gray-600 mt-4 font-sans">
            Navigate all in your own desire experience like you never expect
          </p>
        </div>

        <div className="flex justify-center">
          <div className="tag">Everything you need to explore</div>
        </div>

        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#cbbd93] text-transparent bg-clip-text mt-5">
          Explore both 3D and Augmented Reality
        </h2>
        <p className="text-center text-sm sm:text-base md:text-lg lg:text-[22px] leading-5 sm:leading-6 md:leading-7 lg:leading-[30px] tracking-tight text-[#80775c] mt-5">
          Enjoy exploring the History of Cavite in your own hands with both 3D and AR experiences, a modern discovery of the past by Cavite Venture.
        </p>

        <div className="flex flex-wrap justify-center mt-10 gap-10">
          <Link href="#" passHref>
            <div
              ref={(el) => {
                containerRefs.current[1] = el; // Correctly assigning the ref
              }}
              className="bg-white shadow-lg rounded-lg w-full sm:w-[350px] md:w-[400px] lg:w-[500px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] relative overflow-hidden cursor-pointer p-5 flex flex-col items-center justify-center"
              onMouseMove={(e) => handleMouseMove(e, 1)}
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={() => handleMouseLeave(1)}
            >
              <Image src={ICON_MAP_URL} width={200} height={200} alt="3D Museum" />
              <h3 className="text-center mt-4 font-bold text-base sm:text-lg md:text-xl">3D Museum</h3>
              <p className="text-center mt-2 text-sm sm:text-base md:text-lg text-[#80775c]">
                Lets explore Cavite in a museum in 3D and interact with the 3D elements.
              </p>
              {hoveredContainer === 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(203, 189, 147, 0.6), transparent 200px)`,
                  }}
                />
              )}
            </div>
          </Link>

          <Link href="#" passHref>
            <div
              ref={(el) => {
                containerRefs.current[2] = el; // Correctly assigning the ref
              }}
              className="bg-white shadow-lg rounded-lg w-full sm:w-[350px] md:w-[400px] lg:w-[500px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] relative overflow-hidden cursor-pointer p-5 flex flex-col items-center justify-center"
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={() => handleMouseLeave(2)}
            >
              <Image src={ICON_ROUND_URL} width={200} height={200} alt="Augmented Reality" />
              <h3 className="text-center mt-4 font-bold text-base sm:text-lg md:text-xl">Augmented Reality</h3>
              <p className="text-center mt-2 text-sm sm:text-base md:text-lg text-[#80775c]">
                Explore the amazing features of Cavite Venture and discover what the past holds.
              </p>
              {hoveredContainer === 2 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(203, 189, 147, 0.6), transparent 200px)`,
                  }}
                />
              )}
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Exhibitpro;
