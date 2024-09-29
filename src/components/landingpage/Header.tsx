"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logosaas.png";
import MenuIcon from "@/assets/menu.svg";
import CloseIcon from "@/assets/close.svg";
import ArrowRight from "@/assets/arrow-right.svg";
import EventsButton from "@/components/eventbutton/EventsButton";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as HTMLElement).closest(".mobile-nav")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <header className="top-0 z-20 backdrop-blur-sm relative">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          Explore CaviteVenture in a more Modern world
        </p>
        <div className="inline-flex gap-1 items-center">
          <p>Get Started for Free</p>
          <Image
            src={ArrowRight}
            alt="Arrow icon"
            height={16}
            width={16}
            className="h-4 w-4 inline-flex justify-center items-center"
          />
        </div>
      </div>

      <div className="py-5">
        <div className="container mx-auto px-4 flex items-center justify-between relative">
          <Image src={Logo} alt="Saas logo" width={40} height={40} />

          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Image
              src={isMenuOpen ? CloseIcon : MenuIcon}
              alt="Menu icon"
              height={24}
              width={24}
              className="h-6 w-6"
            />
          </button>

          <nav className="hidden md:flex gap-6 text-black/60 items-center">
            <Link href="/" className="hover:text-black transition-colors duration-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-black transition-colors duration-300">
              About
            </Link>
            <EventsButton />
            <Link href="/signup">
              <button className="bg-black text-white px-4 py-2 rounded-lg font-medium tracking-tight hover:scale-105 transition-transform">
                Explore for Free
              </button>
            </Link>
          </nav>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                className="mobile-nav absolute top-0 right-0 w-2/3 h-screen bg-white shadow-lg z-30 flex flex-col items-center justify-center gap-8"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuVariants}
                transition={{ duration: 0.3 }}
              >
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
                <EventsButton />
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform">
                    Explore for Free
                  </button>
                </Link>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
