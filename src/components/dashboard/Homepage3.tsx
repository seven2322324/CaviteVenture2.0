import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router'; // for navigation
import Cavitecity from '@/assets/cavitecity.jpg';
import Rosario from '@/assets/rosario.jpg';


const Homepage3 = () => {
  const [isModalOpen, setModalOpen] = useState(false); // state to manage modal
  const router = useRouter(); // router instance

  // Function to handle navigation to /exhibit
  const handleViewAll = () => {
    router.push('/exhibit');
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <section className="bg-[#f8f8f8] p-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold"></h1>
        <button
          onClick={handleViewAll}
          className="flex items-center text-lg font-medium text-gray-600 hover:text-gray-900"
        >
          VIEW ALL EXHIBITIONS
          <span className="ml-2">&rarr;</span>
        </button>
      </div>
      <hr className="border-t-2 border-gray-300 mb-8" />
      
      {/* Exhibitions Section */}
      <div className="space-y-8">
        {/* Exhibition 1 */}
        <div className="flex gap-8 items-start">
          <Image
            src={Rosario} // Replace with your actual image path
            alt="Bernard van Orley At Saint-Géry"
            width={500}
            height={300}
            className="object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">Casa Hacienda De Tajero</h2>
            <p className="text-gray-500">March 22, 1897</p>
            <p className="mt-4 text-gray-700">
            Casa Hacienda de Tajero, also known as the Tejeros Convention House, is a historical site located in Rosario, Cavite, Philippines. This Spanish-era building is significant for its role in Philippine history, as it was the site of the Tejeros Convention on March 22, 1897. The convention was a pivotal moment in the Philippine Revolution against Spanish colonial rule, as it marked the establishment of the first revolutionary government in the country.
            </p>
          </div>
          <button
            onClick={toggleModal}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            MORE INFO
          </button>
        </div>

        {/* Exhibition 2 */}
        <div className="flex gap-8 items-start">
          <Image
            src={Cavitecity} // Replace with your actual image path
            alt="Records & Rebels 1966-1970"
            width={500}
            height={300}
            className="object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">San Roque Church</h2>
            <p className="text-gray-500"> established in 1586 by Spanish missionaries</p>
            <p className="mt-4 text-gray-700">
            San Roque Church, located in Cavite City, is a historic and culturally significant Catholic church in the Philippines. Originally established in 1586 by Spanish missionaries, the church has been a prominent spiritual and community center for centuries. It reflects a blend of Spanish colonial and Filipino architectural styles, characterized by its stone facade, arched doorways, and ornate bell tower.
            </p>
          </div>
          <button
            onClick={toggleModal}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            MORE INFO
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 w-11/12 md:w-1/2 max-w-3xl relative">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">San Roque Church, Cavite City</h2>
            <Image
              src={Rosario} // Image for the modal
              alt="San Roque Church"
              width={600}
              height={400}
              className="object-cover rounded-lg"
            />
            <p className="mt-4 text-gray-700">
            The structure itself showcases Spanish colonial architecture, featuring thick stone walls, large wooden windows, and a traditional tiled roof. Surrounded by lush greenery, the Casa Hacienda exudes an old-world charm, with its classic colonial design elements reflecting the history and culture of the period. Inside, the rooms are spacious, with high ceilings and wooden beams, adding to the rustic and historic ambiance. Today, it serves as a reminder of the Philippines struggle for independence and a symbol of the countrys rich cultural heritage.
              <br /><br />
              Whether youre a history enthusiast or someone seeking a deeper connection with the past, Casa Hacienda de Tajero offers a serene and captivating experience. The historic architecture, the old-world ambiance, and the profound significance of the site in the Philippine Revolution make it a must-visit destination in Cavite.

            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Homepage3;
