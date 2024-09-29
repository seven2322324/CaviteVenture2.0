import React from 'react';
import Image from 'next/image';
import Binakayan from "@/assets/binakayan1.jpg"
import Rosario from "@/assets/rosarioinside.jpg"
import CaviteCity from "@/assets/cavitecityinside.jpg"
import Bacoor from "@/assets/zapote bridge.jpg"

const Location1: React.FC = () => {
  return (
    <div className="bg-[#f8f8f8] font-serif">
      {/* Header */}
      {/* <header className="bg-cover bg-center h-96" style={{ backgroundImage: "url('/path-to-header-image.jpg')" }}>
        <div className="bg-black bg-opacity-70 h-full flex flex-col justify-center items-center">
          <h1 className="text-white text-6xl font-bold">All Posts</h1>
          <p className="text-white mt-4 text-lg">Home / All Posts</p>
        </div>
      </header> */}

      {/* Main Content */}
      <div className="container mx-auto py-20 max-w-4xl space-y-24">
        {/* Post 1: Battle of Binakayan */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
          <Image src={Binakayan.src} alt="Battle of Binakayan" width={1600} height={900} className="w-full h-96 object-cover" />
          <div className="p-10">
            <h2 className="text-5xl font-bold mb-6">Battle of Binakayan Monument</h2>
            <p className="text-gray-700 text-xl leading-relaxed">
              The Battle of Binakayan Monument stands as a reminder of the heroic struggles of the Filipinos during the Philippine Revolution. 
              It marks the place where Filipino forces bravely fought for independence...
            </p>
            <a href="#" className="text-yellow-500 mt-6 inline-block text-xl font-semibold">Read More &rarr;</a>
          </div>
        </div>

        {/* Post 2: San Roque Church */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
          <Image src={CaviteCity.src} alt="San Roque Church" width={1600} height={900} className="w-full h-96 object-cover" />
          <div className="p-10">
            <h2 className="text-5xl font-bold mb-6">San Roque Church</h2>
            <p className="text-gray-700 text-xl leading-relaxed">
              San Roque Church is one of the most prominent landmarks in Cavite City, showcasing both historical significance and architectural beauty.
              Its rich history dates back to the Spanish colonial period...
            </p>
            <a href="#" className="text-yellow-500 mt-6 inline-block text-xl font-semibold">Read More &rarr;</a>
          </div>
        </div>

        {/* Post 3: Casa Detajero */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
          <Image src={Rosario.src} alt="Casa Detajero" width={1600} height={900} className="w-full h-96 object-cover" />
          <div className="p-10">
            <h2 className="text-5xl font-bold mb-6">Casa Detajero</h2>
            <p className="text-gray-700 text-xl leading-relaxed">
              Casa Detajero played a pivotal role during the Philippine Revolution, serving as a key location for planning and executing revolutionary movements. 
              The building is now a historical landmark...
            </p>
            <a href="#" className="text-yellow-500 mt-6 inline-block text-xl font-semibold">Read More &rarr;</a>
          </div>
        </div>

        {/* Post 4: Zapote Bridge */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
          <Image src={Bacoor.src} alt="Zapote Bridge" width={1600} height={900} className="w-full h-96 object-cover" />
          <div className="p-10">
            <h2 className="text-5xl font-bold mb-6">Zapote Bridge</h2>
            <p className="text-gray-700 text-xl leading-relaxed">
              The historic Zapote Bridge is known for the Battle of Zapote, a significant battle during the Philippine Revolution. The bridge remains 
              a witness to the courage and bravery of the Filipino people...
            </p>
            <a href="#" className="text-yellow-500 mt-6 inline-block text-xl font-semibold">Read More &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location1;
