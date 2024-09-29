// File: app/RootClient.tsx
"use client";

import { FC, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RootClient: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading logic or data fetching here
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Increase the loading time for demonstration

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* AnimatePresence is used to handle smooth transitions on mount/unmount */}
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            className="flex items-center justify-center h-screen bg-gray-100"
            // Animate the loader with scaling and opacity
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className="w-16 h-16 rounded-full border-t-4 border-blue-500 border-opacity-75"
              // Framer motion animate spin
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {children}
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
};

export default RootClient;
