"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Cloudinary base URL
const CLOUDINARY_URL = "https://res.cloudinary.com/ddobzzim4/image/upload/";

const logos = [
  { src: `${CLOUDINARY_URL}f_auto,q_auto/w_150/images/logo-acme.png`, alt: "Acme Logo" },
  { src: `${CLOUDINARY_URL}f_auto,q_auto/w_150/images/logo-quantum.png`, alt: "Quantum Logo" },
  { src: `${CLOUDINARY_URL}f_auto,q_auto/w_150/images/logo-echo.png`, alt: "Echo Logo" },
  { src: `${CLOUDINARY_URL}f_auto,q_auto/w_150/images/logo-celestial.png`, alt: "Celestial Logo" },
];

export const LogoTicker: React.FC = () => {
  return (
    <div className="py-8 md:py-12 bg-white">
      <div className="container mx-auto">
        <div className="flex overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div
            className="flex gap-14 flex-none pr-14 animate-scroll"
            animate={{ translateX: ["0%", "-100%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {logos.concat(logos).map((logo, index) => (
              <Image
                key={index}
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={100}
                loading="lazy"
                className="logo-ticker-image"
                style={{ width: "auto", height: "auto" }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
