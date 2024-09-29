"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import Shrine from '@/components/aboutpage/shrine/Shrine';

// Cloudinary Image Path with Next.js Image Optimization
const iconUrl = 'https://res.cloudinary.com/ddobzzim4/image/upload/f_auto,q_auto/v1695584000/images/icon.webp';

const AboutUs = () => {
  useEffect(() => {
    // Preload font for critical rendering
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Event handlers for mouse enter/leave (card hover effects)
    const handleMouseEnter = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      gsap.to(target, {
        scale: 1.05,
        rotationY: 10,
        rotationX: -3,
        boxShadow: '0px 10px 20px rgba(0,0,0,0.2)',
        transformPerspective: 1000,
        duration: 0.3,
      });
    };

    const handleMouseLeave = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      gsap.to(target, {
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        boxShadow: '0px 0px 0px rgba(0,0,0,0)',
        duration: 0.3,
      });
    };

    const paragraphs = document.querySelectorAll('.fourplaces .animate-paragraph');
    paragraphs.forEach(paragraph => {
      paragraph.addEventListener('mouseenter', handleMouseEnter);
      paragraph.addEventListener('mouseleave', handleMouseLeave);
    });

    // Add fade-in animation when elements come into view
    const sections = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      paragraphs.forEach(paragraph => {
        paragraph.removeEventListener('mouseenter', handleMouseEnter);
        paragraph.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Smooth scroll handler
  const scrollToExplore = () => {
    const exploreSection = document.getElementById('explore');
    exploreSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="w-full min-h-screen bg-gradient-to-bl from-[#fae8b4] to-[#EAEEFE] fade-in" 
      style={{ backgroundSize: 'cover', width: '100vw', overflowX: 'hidden' }}
    >
      {/* Hero Section */}
      <div className="hero-section flex flex-col md:flex-row justify-center items-center min-h-screen text-left space-y-8 md:space-y-0 fade-in">
        <div className="flex-1 px-5 md:px-20 lg:px-32">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl text-center font-bold font-serif text-gray-800" 
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            We Are CodeBreakers
          </h1>
          <p 
            className="text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-center mt-5 text-gray-600 leading-relaxed" 
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            Welcome to Cavite Venture, your gateway to the hidden gems of Cavite! We are passionate about uncovering and promoting the lesser-known historical and attraction sites across selected municipalities in Cavite.
          </p>
          {/* Add a modern CTA button with smooth scroll */}
          <div className="text-center mt-10">
            <button 
              onClick={scrollToExplore} 
              className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-indigo-500 hover:to-blue-400 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg"
            >
              Explore More
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3">
          <Shrine />
        </div>
      </div>

      {/* Places Section */}
      <div id="explore" className="fourplaces grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center mt-16 px-8 fade-in">
        {[
          { title: "Bacoor", description: "Bacoor is a rapidly urbanizing city in Cavite, Philippines, known for its historical significance in the Philippine Revolution and its proximity to Metro Manila." },
          { title: "Binakayan", description: "Binakayan is a historic district in Kawit, Cavite, known for its role in the Philippine Revolution, particularly the Battle of Binakayan." },
          { title: "Rosario", description: "Rosario is a coastal town in Cavite, Philippines, known for its thriving fishing industry and rich cultural heritage." },
          { title: "Cavite City", description: "Cavite City is a historic port city in Cavite, Philippines, known for its role in the Philippine Revolution and its rich colonial heritage." }
        ].map((place, index) => (
          <div
            key={index}
            className="animate-paragraph border-2 border-gray-300 p-6 rounded-lg relative w-full h-64 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105 fade-in"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            <Image
              src={iconUrl}
              alt="Icon"
              width={40}
              height={40}
              loading="lazy"  // Ensure lazy loading for performance
              className="absolute top-2 left-2"
            />
            <h2 className="font-serif text-xl mt-4 font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>{place.title}</h2>
            <p className="text-sm mt-2 text-gray-600">{place.description}</p>
            {/* Add an Explore button on hover */}
            <a 
              href="#" 
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300"
            >
              Explore
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;
