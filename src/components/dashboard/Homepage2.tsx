import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Homepage2 = () => {
  // Refs for h2 and p elements
  const h2Ref = useRef(null);
  const pRef = useRef(null);

  useEffect(() => {
    // GSAP animation
    const tl = gsap.timeline({ defaults: { ease: 'power1.out', duration: 1.2 } });

    // Animate h2 and p
    tl.fromTo(h2Ref.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0 })
      .fromTo(pRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, '-=0.5');
  }, []);

  return (
    <section className="bg-[#f5f5f5] w-full h-full p-10">
      {/* Flexbox container with two flex items */}
      <div className="max-w-7xl mx-auto flex flex-row items-start gap-10">
        
        {/* Left Side (Text) */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h2 ref={h2Ref} className="text-3xl font-bold mb-4">WELCOME</h2>
          <p ref={pRef} className="text-lg leading-relaxed text-gray-700">
            Welcome to Cavite Venture, where an island escape awaits you like never before. 
            We are your gateway to exploring the lesser-known historical and attraction sites 
            scattered across the picturesque municipalities of Cavite. Our mission is to shine 
            a light on the unpopular yet captivating destinations that are often overlooked but 
            brimming with rich stories and breathtaking beauty.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Homepage2;
