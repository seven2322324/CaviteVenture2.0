import React from 'react';
import Image from 'next/image';
import Binakayan from '@/assets/binakayan.jpg'; // Replace with the correct path

const Homepage = () => {
  return (
    <section className="relative w-full h-screen">
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-full" style={{ height: '100vh' }}>
        <Image
          src={Binakayan}
          alt="Historical Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
        />
      </div>

      {/* Text Overlay (Positioned at the bottom-left corner) */}
      <div className="absolute bottom-0 left-0 z-10 flex flex-col items-start justify-start text-left text-white p-5 sm:p-10 md:p-20">
        {/* Adjust font size for different screen sizes */}
        <p className="text-sm sm:text-lg md:text-2xl lg:text-5xl mb-2">Discover Unpopular History</p>
        <h1 className="text-7xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          AN HISTORY TO <br /> DISCOVER AWAITS <br /> YOU
        </h1>
      </div>
    </section>
  );
};

export default Homepage;
