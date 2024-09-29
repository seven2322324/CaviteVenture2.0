"use client";
import Image from "next/image";
import { motion } from "framer-motion";

// Cloudinary base URL
const CLOUDINARY_URL = "https://res.cloudinary.com/ddobzzim4/image/upload/images/";  // Note: Added /images/ folder path

// Testimonials data with Cloudinary images
const testimonials = [
  {
    text: "As a seasoned designer always on the lookout for innovative tools, Framer.com instantly grabbed my attention.",
    imageSrc: `${CLOUDINARY_URL}avatar-1.png`,
    name: "Jamie Rivera",
    username: "@jamietechguru00",
  },
  {
    text: "Our team's productivity has skyrocketed since we started using this tool.",
    imageSrc: `${CLOUDINARY_URL}avatar-2.png`,
    name: "Josh Smith",
    username: "@jjsmith",
  },
  {
    text: "This app has completely transformed how I manage my projects and deadlines.",
    imageSrc: `${CLOUDINARY_URL}avatar-3.png`, // Properly closed backtick
    name: "Morgan Lee",
    username: "@morganleewhiz",
  },
  {
    text: "I was amazed at how quickly we were able to integrate this app into our workflow.",
    imageSrc: `${CLOUDINARY_URL}avatar-4.png`,
    name: "Casey Jordan",
    username: "@caseyj",
  },
  {
    text: "Planning and executing events has never been easier. This app helps me keep track of all the moving parts, ensuring nothing slips through the cracks.",
    imageSrc: `${CLOUDINARY_URL}avatar-5.png`,
    name: "Taylor Kim",
    username: "@taylorkimm",
  },
  {
    text: "The customizability and integration capabilities of this app are top-notch.",
    imageSrc: `${CLOUDINARY_URL}avatar-6.png`,
    name: "Riley Smith",
    username: "@rileysmith1",
  },
  {
    text: "Adopting this app for our team has streamlined our project management and improved communication across the board.",
    imageSrc: `${CLOUDINARY_URL}avatar-7.png`,
    name: "Jordan Patels",
    username: "@jpatelsdesign",
  },
  {
    text: "With this app, we can easily assign tasks, track progress, and manage documents all in one place.",
    imageSrc: `${CLOUDINARY_URL}avatar-8.png`,
    name: "Sam Dawson",
    username: "@dawsontechtips",
  },
  {
    text: "Its user-friendly interface and robust features support our diverse needs.",
    imageSrc: `${CLOUDINARY_URL}avatar-9.png`,
    name: "Casey Harper",
    username: "@casey09",
  },
];

// Split testimonials into columns
const columns = [
  testimonials.slice(0, 3),
  testimonials.slice(3, 6),
  testimonials.slice(6, 9),
];

export const Testimonials = () => {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="tag mt-5">Testimonials</div>
        </div>
        <h2 className="section-title mt-5 text-center text-3xl font-bold">
          Our Users Response
        </h2>
        <p className="section-description mt-5 text-center text-lg">
          From intuitive design to powerful features, our app has become an
          essential tool for users around the world.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {columns.map((column, index) => (
            <div key={index} className="flex flex-col gap-6">
              {column.map(({ text, imageSrc, name, username }, idx) => (
                <motion.div
                  key={idx}
                  className="card p-4 bg-gray-50 rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-base text-gray-700">{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <Image
                      src={imageSrc}
                      alt={name}
                      height={40}
                      width={40}
                      className="h-10 w-10 rounded-full"
                      layout="fixed"
                      loading="lazy" // Lazy load the images for performance
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">
                        {name}
                      </div>
                      <div className="text-gray-500 text-sm leading-5 tracking-tight">
                        {username}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
