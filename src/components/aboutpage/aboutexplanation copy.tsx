"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface AboutData {
  title: string;
  description: string;
  images: { url: string; alt: string }[];
}

const Aboutexplanation = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/about-explanation');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setAboutData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    // Initial data fetch
    fetchData();

    // Polling every 10 seconds for live updates
    const intervalId = setInterval(fetchData, 10000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!aboutData) {
    return <div>No data available</div>;
  }

  return (
    <div className="bg-white py-10">
      <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#cbbd93] text-transparent bg-clip-text mt-5">
        {aboutData.title || 'Default Title'}
      </h2>
      <p className="text-center text-sm sm:text-base md:text-lg lg:text-[22px] leading-5 sm:leading-6 md:leading-7 lg:leading-[30px] tracking-tight text-[#80775c] mt-5">
        {aboutData.description || 'Default Description'}
      </p>

      <div className="image-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        {aboutData.images?.length > 0 ? (
          aboutData.images.map((image, index) => (
            <Image
              key={index}
              className="rounded-lg"
              src={image.url.startsWith('http') ? image.url : `/api/get-image/${image.url}`} // Use the database image URL
              width={400}
              height={400}
              alt={image.alt}
              onError={(e) => console.error(`Failed to load image: ${image.url}`, e)}
            />
          ))
        ) : (
          <div>No images available</div>
        )}
      </div>
    </div>
  );
};

export default Aboutexplanation;
